"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticV3SubgraphProvider = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const dswap_v3_sdk_1 = require("@miljan9602/dswap-v3-sdk");
const jsbi_1 = __importDefault(require("jsbi"));
const lodash_1 = __importDefault(require("lodash"));
const amounts_1 = require("../../util/amounts");
const chains_1 = require("../../util/chains");
const log_1 = require("../../util/log");
const token_provider_1 = require("../token-provider");
const BASES_TO_CHECK_TRADES_AGAINST = {
    [dswap_sdk_core_1.ChainId.MAINNET]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.MAINNET],
        token_provider_1.DAI_MAINNET,
        token_provider_1.USDC_MAINNET,
        token_provider_1.USDT_MAINNET,
        token_provider_1.WBTC_MAINNET,
    ],
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.SEI_MAINNET],
        token_provider_1.USDC_SEI_MAINNET,
        token_provider_1.USDT_SEI_MAINNET
    ],
    [dswap_sdk_core_1.ChainId.GOERLI]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.GOERLI],
        token_provider_1.USDT_GOERLI,
        token_provider_1.USDC_GOERLI,
        token_provider_1.WBTC_GOERLI,
        token_provider_1.DAI_GOERLI,
    ],
    [dswap_sdk_core_1.ChainId.SEPOLIA]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.SEPOLIA], token_provider_1.USDC_SEPOLIA],
    [dswap_sdk_core_1.ChainId.OPTIMISM]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.OPTIMISM],
        token_provider_1.USDC_OPTIMISM,
        token_provider_1.DAI_OPTIMISM,
        token_provider_1.USDT_OPTIMISM,
        token_provider_1.WBTC_OPTIMISM,
        token_provider_1.OP_OPTIMISM,
    ],
    // todo: once subgraph is created
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: [
    //   WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM_SEPOLIA]!,
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ARBITRUM_ONE],
        token_provider_1.WBTC_ARBITRUM,
        token_provider_1.DAI_ARBITRUM,
        token_provider_1.USDC_ARBITRUM,
        token_provider_1.USDT_ARBITRUM,
        token_provider_1.ARB_ARBITRUM,
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI],
        token_provider_1.USDC_ARBITRUM_GOERLI,
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: [
    // WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM_SEPOLIA]!,
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI],
        token_provider_1.USDC_OPTIMISM_GOERLI,
        token_provider_1.DAI_OPTIMISM_GOERLI,
        token_provider_1.USDT_OPTIMISM_GOERLI,
        token_provider_1.WBTC_OPTIMISM_GOERLI,
    ],
    [dswap_sdk_core_1.ChainId.POLYGON]: [token_provider_1.USDC_POLYGON, token_provider_1.WETH_POLYGON, token_provider_1.WMATIC_POLYGON],
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: [
        token_provider_1.DAI_POLYGON_MUMBAI,
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.POLYGON_MUMBAI],
        token_provider_1.WMATIC_POLYGON_MUMBAI,
    ],
    [dswap_sdk_core_1.ChainId.CELO]: [token_provider_1.CELO, token_provider_1.CUSD_CELO, token_provider_1.CEUR_CELO, token_provider_1.DAI_CELO],
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: [
        token_provider_1.CELO_ALFAJORES,
        token_provider_1.CUSD_CELO_ALFAJORES,
        token_provider_1.CEUR_CELO_ALFAJORES,
        token_provider_1.DAI_CELO_ALFAJORES,
    ],
    [dswap_sdk_core_1.ChainId.GNOSIS]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.GNOSIS],
        token_provider_1.WBTC_GNOSIS,
        token_provider_1.WXDAI_GNOSIS,
        token_provider_1.USDC_ETHEREUM_GNOSIS,
    ],
    [dswap_sdk_core_1.ChainId.BNB]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BNB],
        token_provider_1.BUSD_BNB,
        token_provider_1.DAI_BNB,
        token_provider_1.USDC_BNB,
        token_provider_1.USDT_BNB,
        token_provider_1.BTC_BNB,
        token_provider_1.ETH_BNB,
    ],
    [dswap_sdk_core_1.ChainId.AVALANCHE]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.AVALANCHE],
        token_provider_1.USDC_AVAX,
        token_provider_1.DAI_AVAX,
    ],
    [dswap_sdk_core_1.ChainId.MOONBEAM]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.MOONBEAM],
        token_provider_1.DAI_MOONBEAM,
        token_provider_1.USDC_MOONBEAM,
        token_provider_1.WBTC_MOONBEAM,
    ],
    [dswap_sdk_core_1.ChainId.BASE_GOERLI]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BASE_GOERLI]],
    [dswap_sdk_core_1.ChainId.BASE]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BASE], token_provider_1.USDC_BASE],
    [dswap_sdk_core_1.ChainId.ZORA]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ZORA]],
    [dswap_sdk_core_1.ChainId.ZORA_SEPOLIA]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ZORA_SEPOLIA]],
    [dswap_sdk_core_1.ChainId.ROOTSTOCK]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ROOTSTOCK]],
    [dswap_sdk_core_1.ChainId.BLAST]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BLAST], token_provider_1.USDB_BLAST]
};
/**
 * Provider that uses a hardcoded list of V3 pools to generate a list of subgraph pools.
 *
 * Since the pools are hardcoded and the data does not come from the Subgraph, the TVL values
 * are dummys and should not be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. Subgraph not available.
 *
 * @export
 * @class StaticV3SubgraphProvider
 */
class StaticV3SubgraphProvider {
    constructor(chainId, poolProvider) {
        this.chainId = chainId;
        this.poolProvider = poolProvider;
    }
    async getPools(tokenIn, tokenOut, providerConfig) {
        log_1.log.info('In static subgraph provider for V3');
        const bases = BASES_TO_CHECK_TRADES_AGAINST[this.chainId];
        const basePairs = lodash_1.default.flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]));
        if (tokenIn && tokenOut) {
            basePairs.push([tokenIn, tokenOut], ...bases.map((base) => [tokenIn, base]), ...bases.map((base) => [tokenOut, base]));
        }
        const pairs = (0, lodash_1.default)(basePairs)
            .filter((tokens) => Boolean(tokens[0] && tokens[1]))
            .filter(([tokenA, tokenB]) => tokenA.address !== tokenB.address && !tokenA.equals(tokenB))
            .flatMap(([tokenA, tokenB]) => {
            return [
                [tokenA, tokenB, dswap_v3_sdk_1.FeeAmount.LOWEST],
                [tokenA, tokenB, dswap_v3_sdk_1.FeeAmount.LOW],
                [tokenA, tokenB, dswap_v3_sdk_1.FeeAmount.MEDIUM],
                [tokenA, tokenB, dswap_v3_sdk_1.FeeAmount.HIGH],
            ];
        })
            .value();
        log_1.log.info(`V3 Static subgraph provider about to get ${pairs.length} pools on-chain`);
        const poolAccessor = await this.poolProvider.getPools(pairs, providerConfig);
        const pools = poolAccessor.getAllPools();
        const poolAddressSet = new Set();
        const subgraphPools = (0, lodash_1.default)(pools)
            .map((pool) => {
            const { token0, token1, fee, liquidity } = pool;
            const poolAddress = dswap_v3_sdk_1.Pool.getAddress(pool.token0, pool.token1, pool.fee);
            if (poolAddressSet.has(poolAddress)) {
                return undefined;
            }
            poolAddressSet.add(poolAddress);
            const liquidityNumber = jsbi_1.default.toNumber(liquidity);
            return {
                id: poolAddress,
                feeTier: (0, amounts_1.unparseFeeAmount)(fee),
                liquidity: liquidity.toString(),
                token0: {
                    id: token0.address,
                },
                token1: {
                    id: token1.address,
                },
                // As a very rough proxy we just use liquidity for TVL.
                tvlETH: liquidityNumber,
                tvlUSD: liquidityNumber,
            };
        })
            .compact()
            .value();
        return subgraphPools;
    }
}
exports.StaticV3SubgraphProvider = StaticV3SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92My9zdGF0aWMtc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkRBQTZEO0FBQzdELCtEQUE0RDtBQUM1RCwyREFBMkQ7QUFDM0QsZ0RBQXdCO0FBQ3hCLG9EQUF1QjtBQUV2QixnREFBc0Q7QUFDdEQsOENBQTREO0FBQzVELHdDQUFxQztBQUVyQyxzREF3RDJCO0FBSTNCLE1BQU0sNkJBQTZCLEdBeUIvQjtJQUNGLENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQixnQ0FBdUIsQ0FBQyx3QkFBTyxDQUFDLE9BQU8sQ0FBRTtRQUN6Qyw0QkFBVztRQUNYLDZCQUFZO1FBQ1osNkJBQVk7UUFDWiw2QkFBWTtLQUNiO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3JCLGdDQUF1QixDQUFDLHdCQUFPLENBQUMsV0FBVyxDQUFFO1FBQzdDLGlDQUFnQjtRQUNoQixpQ0FBZ0I7S0FDakI7SUFDRCxDQUFDLHdCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDaEIsZ0NBQXVCLENBQUMsd0JBQU8sQ0FBQyxNQUFNLENBQUU7UUFDeEMsNEJBQVc7UUFDWCw0QkFBVztRQUNYLDRCQUFXO1FBQ1gsMkJBQVU7S0FDWDtJQUNELENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGdDQUF1QixDQUFDLHdCQUFPLENBQUMsT0FBTyxDQUFFLEVBQUUsNkJBQVksQ0FBQztJQUM1RSxDQUFDLHdCQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDbEIsZ0NBQXVCLENBQUMsd0JBQU8sQ0FBQyxRQUFRLENBQUU7UUFDMUMsOEJBQWE7UUFDYiw2QkFBWTtRQUNaLDhCQUFhO1FBQ2IsOEJBQWE7UUFDYiw0QkFBVztLQUNaO0lBQ0QsaUNB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