import { ChainId } from '@miljan9602/dswap-sdk-core';
import retry from 'async-retry';
import Timeout from 'await-timeout';
import { gql, GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { log } from '../../util/log';
import { metric } from '../../util/metric';
export const BLACKLISTED_V2_TOKENS = [
    '0xad0c5b8c5508ae8fa0195d5d633ad34ebc232437',
    '0x6c155dc99e0a75302e23447e2ebaa4c5fa21dfcc',
    '0x66491aa9e4a02f1da8e3e842bb47585e18957db3',
    '0xc452f2f135a72b322bd453aa28d40adcb4bc9c41',
    '0x1fa26eb21d8fd66ba8fe845d6e813135f893ba63',
    '0x6c155dc99e0a75302e23447e2ebaa4c5fa21dfcc',
    '0x9d9ee08d969557a35208d1c5cf0728c0a65aaff5',
    '0xad0c5b8c5508ae8fa0195d5d633ad34ebc232437',
    '0x79286845fbe1f47d2c9115e7918007290c548439'
];
const SUBGRAPH_URL_BY_CHAIN = {
    [ChainId.SEI_MAINNET]: 'https://sei-api.dragonswap.app/api/v1/graph/factory/pairs',
};
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
export class V2SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 360000, rollback = true, pageSize = PAGE_SIZE, trackedEthThreshold = 30, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrlOverride) {
        var _a;
        this.chainId = chainId;
        this.retries = retries;
        this.timeout = timeout;
        this.rollback = rollback;
        this.pageSize = pageSize;
        this.trackedEthThreshold = trackedEthThreshold;
        this.untrackedUsdThreshold = untrackedUsdThreshold;
        this.subgraphUrlOverride = subgraphUrlOverride;
        const subgraphUrl = (_a = this.subgraphUrlOverride) !== null && _a !== void 0 ? _a : SUBGRAPH_URL_BY_CHAIN[this.chainId];
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new GraphQLClient(subgraphUrl);
    }
    async getPools(_tokenIn, _tokenOut, providerConfig) {
        const beforeAll = Date.now();
        let blockNumber = (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? await providerConfig.blockNumber
            : undefined;
        // Due to limitations with the Subgraph API this is the only way to parameterize the query.
        const query2 = gql `
        query getPools($pageSize: Int!, $id: String) {
            pairs(
                first: $pageSize
                ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
                where: { id_gt: $id }
            ) {
                id
                token0 { id, symbol }
                token1 { id, symbol }
                totalSupply
                trackedReserveETH
                reserveETH
                reserveUSD
            }
        }
    `;
        let pools = [];
        log.info(`Getting V2 pools from the subgraph with page size ${this.pageSize}${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? ` as of block ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}`
            : ''}.`);
        let outerRetries = 0;
        await retry(async () => {
            const timeout = new Timeout();
            const getPools = async () => {
                let lastId = '';
                let pairs = [];
                let pairsPage = [];
                // metrics variables
                let totalPages = 0;
                let retries = 0;
                do {
                    totalPages += 1;
                    await retry(async () => {
                        const before = Date.now();
                        const poolsResult = await this.client.request(query2, {
                            pageSize: this.pageSize,
                            id: lastId,
                        });
                        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.latency`, Date.now() - before);
                        pairsPage = poolsResult.pairs;
                        pairs = pairs.concat(pairsPage);
                        lastId = pairs[pairs.length - 1].id;
                        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.pageSize`, pairsPage.length);
                    }, {
                        retries: this.retries,
                        onRetry: (err, retry) => {
                            pools = [];
                            retries += 1;
                            log.info({ err }, `Failed request for page of pools from subgraph. Retry attempt: ${retry}`);
                        },
                    });
                } while (pairsPage.length > 0);
                metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate`, totalPages);
                metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.pairs.length`, pairs.length);
                metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.retries`, retries);
                return pairs;
            };
            /* eslint-disable no-useless-catch */
            try {
                const getPoolsPromise = getPools();
                const timerPromise = timeout.set(this.timeout).then(() => {
                    throw new Error(`Timed out getting pools from subgraph: ${this.timeout}`);
                });
                pools = await Promise.race([getPoolsPromise, timerPromise]);
                return;
            }
            catch (err) {
                throw err;
            }
            finally {
                timeout.clear();
            }
            /* eslint-enable no-useless-catch */
        }, {
            retries: this.retries,
            onRetry: (err, retry) => {
                outerRetries += 1;
                if (this.rollback &&
                    blockNumber &&
                    _.includes(err.message, 'indexed up to')) {
                    metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.indexError`, 1);
                    blockNumber = blockNumber - 10;
                    log.info(`Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`);
                }
                metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.timeout`, 1);
                pools = [];
                log.info({ err }, `Failed to get pools from subgraph. Retry attempt: ${retry}`);
            },
        });
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.retries`, outerRetries);
        // Filter pools that have tracked reserve ETH less than threshold.
        // trackedReserveETH filters pools that do not involve a pool from this allowlist:
        // https://github.com/Uniswap/v2-subgraph/blob/7c82235cad7aee4cfce8ea82f0030af3d224833e/src/mappings/pricing.ts#L43
        // Which helps filter pools with manipulated prices/liquidity.
        // TODO: Remove. Temporary fix to ensure tokens without trackedReserveETH are in the list.
        const tracked = pools.filter(pool => {
            if (BLACKLISTED_V2_TOKENS.includes(pool.token0.id) || BLACKLISTED_V2_TOKENS.includes(pool.token1.id))
                return false;
            return parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold;
        });
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.length`, tracked.length);
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.percent`, (tracked.length / pools.length) * 100);
        const beforeFilter = Date.now();
        const poolsSanitized = pools
            .filter((pool) => {
            if (BLACKLISTED_V2_TOKENS.includes(pool.token0.id) || BLACKLISTED_V2_TOKENS.includes(pool.token1.id))
                return false;
            return (parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold ||
                parseFloat(pool.reserveUSD) > this.untrackedUsdThreshold);
        })
            .map((pool) => {
            return {
                id: pool.id.toLowerCase(),
                token0: {
                    id: pool.token0.id.toLowerCase(),
                },
                token1: {
                    id: pool.token1.id.toLowerCase(),
                },
                supply: parseFloat(pool.totalSupply),
                reserve: parseFloat(pool.trackedReserveETH),
                reserveUSD: parseFloat(pool.reserveUSD),
            };
        });
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.latency`, Date.now() - beforeFilter);
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.length`, poolsSanitized.length);
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.percent`, (poolsSanitized.length / pools.length) * 100);
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools`, 1);
        metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.latency`, Date.now() - beforeAll);
        log.info(`Got ${pools.length} V2 pools from the subgraph. ${poolsSanitized.length} after filtering`);
        return poolsSanitized;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YyL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQVMsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLEtBQUssTUFBTSxhQUFhLENBQUM7QUFDaEMsT0FBTyxPQUFPLE1BQU0sZUFBZSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHM0MsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUc7SUFDbkMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7Q0FDN0MsQ0FBQztBQThCRixNQUFNLHFCQUFxQixHQUFzQztJQUMvRCxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSwyREFBMkQ7Q0FDbkYsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLCtDQUErQztBQWdCdkUsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUNVLE9BQWdCLEVBQ2hCLFVBQVUsQ0FBQyxFQUNYLFVBQVUsTUFBTSxFQUNoQixXQUFXLElBQUksRUFDZixXQUFXLFNBQVMsRUFDcEIsc0JBQXNCLEVBQUUsRUFDeEIsd0JBQXdCLE1BQU0sQ0FBQyxTQUFTLEVBQ3hDLG1CQUE0Qjs7UUFQNUIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixZQUFP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