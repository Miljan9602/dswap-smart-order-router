"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2SubgraphProvider = exports.BLACKLISTED_V2_TOKENS = void 0;
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const async_retry_1 = __importDefault(require("async-retry"));
const await_timeout_1 = __importDefault(require("await-timeout"));
const graphql_request_1 = require("graphql-request");
const log_1 = require("../../util/log");
const metric_1 = require("../../util/metric");
exports.BLACKLISTED_V2_TOKENS = [
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
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: 'https://sei-api.dragonswap.app/api/v1/graph/factory/pairs',
};
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
class V2SubgraphProvider {
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
        this.client = new graphql_request_1.GraphQLClient(subgraphUrl);
    }
    async getPools(_tokenIn, _tokenOut, providerConfig) {
        const beforeAll = Date.now();
        let blockNumber = (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? await providerConfig.blockNumber
            : undefined;
        // Due to limitations with the Subgraph API this is the only way to parameterize the query.
        const query2 = (0, graphql_request_1.gql) `
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
        log_1.log.info(`Getting V2 pools from the subgraph with page size ${this.pageSize}${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? ` as of block ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}`
            : ''}.`);
        let outerRetries = 0;
        await (0, async_retry_1.default)(async () => {
            const timeout = new await_timeout_1.default();
            const getPools = async () => {
                let lastId = '';
                let pairs = [];
                let pairsPage = [];
                // metrics variables
                let totalPages = 0;
                let retries = 0;
                do {
                    totalPages += 1;
                    await (0, async_retry_1.default)(async () => {
                        const before = Date.now();
                        const poolsResult = await this.client.request(query2, {
                            pageSize: this.pageSize,
                            id: lastId,
                        });
                        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.latency`, Date.now() - before);
                        pairsPage = poolsResult.pairs;
                        pairs = pairs.concat(pairsPage);
                        lastId = pairs[pairs.length - 1].id;
                        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.pageSize`, pairsPage.length);
                    }, {
                        retries: this.retries,
                        onRetry: (err, retry) => {
                            pools = [];
                            retries += 1;
                            log_1.log.info({ err }, `Failed request for page of pools from subgraph. Retry attempt: ${retry}`);
                        },
                    });
                } while (pairsPage.length > 0);
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate`, totalPages);
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.pairs.length`, pairs.length);
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.paginate.retries`, retries);
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
                    blockNumber) {
                    metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.indexError`, 1);
                    blockNumber = blockNumber - 10;
                    log_1.log.info(`Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`);
                }
                metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.timeout`, 1);
                pools = [];
                log_1.log.info({ err }, `Failed to get pools from subgraph. Retry attempt: ${retry}`);
            },
        });
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.retries`, outerRetries);
        // Filter pools that have tracked reserve ETH less than threshold.
        // trackedReserveETH filters pools that do not involve a pool from this allowlist:
        // https://github.com/Uniswap/v2-subgraph/blob/7c82235cad7aee4cfce8ea82f0030af3d224833e/src/mappings/pricing.ts#L43
        // Which helps filter pools with manipulated prices/liquidity.
        // TODO: Remove. Temporary fix to ensure tokens without trackedReserveETH are in the list.
        const tracked = pools.filter(pool => {
            if (exports.BLACKLISTED_V2_TOKENS.includes(pool.token0.id) || exports.BLACKLISTED_V2_TOKENS.includes(pool.token1.id))
                return false;
            return parseFloat(pool.trackedReserveETH) > this.trackedEthThreshold;
        });
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.length`, tracked.length);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.percent`, (tracked.length / pools.length) * 100);
        const beforeFilter = Date.now();
        const poolsSanitized = pools
            .filter((pool) => {
            if (exports.BLACKLISTED_V2_TOKENS.includes(pool.token0.id) || exports.BLACKLISTED_V2_TOKENS.includes(pool.token1.id))
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
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.filter.latency`, Date.now() - beforeFilter);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.length`, poolsSanitized.length);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.untracked.percent`, (poolsSanitized.length / pools.length) * 100);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools`, 1);
        metric_1.metric.putMetric(`V2SubgraphProvider.chain_${this.chainId}.getPools.latency`, Date.now() - beforeAll);
        log_1.log.info(`Got ${pools.length} V2 pools from the subgraph. ${poolsSanitized.length} after filtering`);
        return poolsSanitized;
    }
}
exports.V2SubgraphProvider = V2SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YyL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtEQUE0RDtBQUM1RCw4REFBZ0M7QUFDaEMsa0VBQW9DO0FBQ3BDLHFEQUFxRDtBQUdyRCx3Q0FBcUM7QUFDckMsOENBQTJDO0FBRzlCLFFBQUEscUJBQXFCLEdBQUc7SUFDbkMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7SUFDNUMsNENBQTRDO0lBQzVDLDRDQUE0QztJQUM1Qyw0Q0FBNEM7Q0FDN0MsQ0FBQztBQThCRixNQUFNLHFCQUFxQixHQUFzQztJQUMvRCxDQUFDLHdCQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsMkRBQTJEO0NBQ25GLENBQUM7QUFFRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQywrQ0FBK0M7QUFnQnZFLE1BQWEsa0JBQWtCO0lBRzdCLFlBQ1UsT0FBZ0IsRUFDaEIsVUFBVSxDQUFDLEVBQ1gsVUFBVSxNQUFNLEVBQ2hCLFdBQVcsSUFBSSxFQUNmLFdBQVcsU0FBUyxFQUNwQixzQkFBc0IsRUFBRSxFQUN4Qix3QkFBd0IsTUFBTSxDQUFDLFNBQVMsRUFDeEMsbUJBQTRCOztRQVA1QixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFDWCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQU87UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBSztRQUN4QiwwQkFBcUIsR0FBckIscUJBQXFCLENBQW1CO1FBQ3hDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBUztRQUVwQyxNQUFNLFdBQVcsR0FB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