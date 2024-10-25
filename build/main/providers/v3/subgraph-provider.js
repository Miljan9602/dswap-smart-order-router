"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V3SubgraphProvider = exports.printV2SubgraphPool = exports.printV3SubgraphPool = void 0;
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const async_retry_1 = __importDefault(require("async-retry"));
const await_timeout_1 = __importDefault(require("await-timeout"));
const graphql_request_1 = require("graphql-request");
const util_1 = require("../../util");
const printV3SubgraphPool = (s) => `${s.token0.id}/${s.token1.id}/${s.feeTier}`;
exports.printV3SubgraphPool = printV3SubgraphPool;
const printV2SubgraphPool = (s) => `${s.token0.id}/${s.token1.id}`;
exports.printV2SubgraphPool = printV2SubgraphPool;
const SUBGRAPH_URL_BY_CHAIN = {
    [dswap_sdk_core_1.ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [dswap_sdk_core_1.ChainId.OPTIMISM]: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
    // todo: add once subgraph is live
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: '',
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal',
    // todo: add once subgraph is live
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: '',
    [dswap_sdk_core_1.ChainId.POLYGON]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
    [dswap_sdk_core_1.ChainId.CELO]: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo',
    [dswap_sdk_core_1.ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-gorli',
    [dswap_sdk_core_1.ChainId.BNB]: 'https://api.thegraph.com/subgraphs/name/ilyamk/uniswap-v3---bnb-chain',
    [dswap_sdk_core_1.ChainId.AVALANCHE]: 'https://api.thegraph.com/subgraphs/name/lynnshaoyu/uniswap-v3-avax',
    [dswap_sdk_core_1.ChainId.BASE]: 'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/version/latest',
    [dswap_sdk_core_1.ChainId.BLAST]: 'https://gateway-arbitrum.network.thegraph.com/api/0ae45f0bf40ae2e73119b44ccd755967/subgraphs/id/2LHovKznvo8YmKC9ZprPjsYAZDCc4K5q4AYz8s3cnQn1',
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: 'https://api.goldsky.com/api/public/project_clu1fg6ajhsho01x7ajld3f5a/subgraphs/dragonswap-v3-prod/1.0.0/gn'
};
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
class V3SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 30000, rollback = true, trackedEthThreshold = 30, untrackedUsdThreshold = Number.MAX_VALUE, subgraphUrlOverride) {
        var _a;
        this.chainId = chainId;
        this.retries = retries;
        this.timeout = timeout;
        this.rollback = rollback;
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
        const query = (0, graphql_request_1.gql) `
      query getPools($pageSize: Int!, $id: String) {
        pools(
          first: $pageSize
          ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
          where: { id_gt: $id }
        ) {
          id
          token0 {
            symbol
            id
          }
          token1 {
            symbol
            id
          }
          feeTier
          liquidity
          totalValueLockedUSD
          totalValueLockedETH
          totalValueLockedUSDUntracked
        }
      }
    `;
        let pools = [];
        util_1.log.info(`Getting V3 pools from the subgraph with page size ${PAGE_SIZE}${(providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber)
            ? ` as of block ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}`
            : ''}.`);
        let retries = 0;
        await (0, async_retry_1.default)(async () => {
            const timeout = new await_timeout_1.default();
            const getPools = async () => {
                let lastId = '';
                let pools = [];
                let poolsPage = [];
                // metrics variables
                let totalPages = 0;
                do {
                    totalPages += 1;
                    const poolsResult = await this.client.request(query, {
                        pageSize: PAGE_SIZE,
                        id: lastId,
                    });
                    poolsPage = poolsResult.pools;
                    pools = pools.concat(poolsPage);
                    lastId = pools[pools.length - 1].id;
                    util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.paginate.pageSize`, poolsPage.length);
                } while (poolsPage.length > 0);
                util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.paginate`, totalPages);
                util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.pools.length`, pools.length);
                return pools;
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
                retries += 1;
                if (this.rollback &&
                    blockNumber) {
                    util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.indexError`, 1);
                    blockNumber = blockNumber - 10;
                    util_1.log.info(`Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`);
                }
                util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.timeout`, 1);
                pools = [];
                util_1.log.info({ err }, `Failed to get pools from subgraph. Retry attempt: ${retry}`);
            },
        });
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.retries`, retries);
        const untrackedPools = pools.filter(pool => parseInt(pool.liquidity) > 0 ||
            parseFloat(pool.totalValueLockedETH) > this.trackedEthThreshold ||
            parseFloat(pool.totalValueLockedUSDUntracked) > this.untrackedUsdThreshold);
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.untracked.length`, untrackedPools.length);
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.untracked.percent`, (untrackedPools.length / pools.length) * 100);
        const beforeFilter = Date.now();
        const poolsSanitized = pools
            .map((pool) => {
            const { totalValueLockedETH, totalValueLockedUSD } = pool;
            return {
                id: pool.id.toLowerCase(),
                feeTier: pool.feeTier,
                token0: {
                    id: pool.token0.id.toLowerCase(),
                },
                token1: {
                    id: pool.token1.id.toLowerCase(),
                },
                liquidity: pool.liquidity,
                tvlETH: parseFloat(totalValueLockedETH),
                tvlUSD: parseFloat(totalValueLockedUSD),
            };
        });
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.filter.latency`, Date.now() - beforeFilter);
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.filter.length`, poolsSanitized.length);
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.filter.percent`, (poolsSanitized.length / pools.length) * 100);
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools`, 1);
        util_1.metric.putMetric(`V3SubgraphProvider.chain_${this.chainId}.getPools.latency`, Date.now() - beforeAll);
        util_1.log.info(`Got ${pools.length} V3 pools from the subgraph. ${poolsSanitized.length} after filtering`);
        return poolsSanitized;
    }
}
exports.V3SubgraphProvider = V3SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YzL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtEQUE0RDtBQUM1RCw4REFBZ0M7QUFDaEMsa0VBQW9DO0FBQ3BDLHFEQUFxRDtBQUdyRCxxQ0FBeUM7QUFtQ2xDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FDdkQsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFEbEMsUUFBQSxtQkFBbUIsdUJBQ2U7QUFFeEMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLENBQWlCLEVBQUUsRUFBRSxDQUN2RCxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7QUFEckIsUUFBQSxtQkFBbUIsdUJBQ0U7QUFFbEMsTUFBTSxxQkFBcUIsR0FBc0M7SUFDL0QsQ0FBQyx3QkFBTyxDQUFDLE9BQU8sQ0FBQyxFQUNmLDREQUE0RDtJQUM5RCxDQUFDLHdCQUFPLENBQUMsUUFBUSxDQUFDLEVBQ2hCLDJFQUEyRTtJQUM3RSxrQ0FBa0M7SUFDbEMsQ0FBQyx3QkFBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRTtJQUM5QixDQUFDLHdCQUFPLENBQUMsWUFBWSxDQUFDLEVBQ3BCLG9FQUFvRTtJQUN0RSxrQ0FBa0M7SUFDbEMsQ0FBQyx3QkFBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRTtJQUM5QixDQUFDLHdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQ2Ysc0VBQXNFO0lBQ3hFLENBQUMsd0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFDWixpRUFBaUU7SUFDbkUsQ0FBQyx3QkFB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