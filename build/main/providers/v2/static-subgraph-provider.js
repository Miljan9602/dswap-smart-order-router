"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticV2SubgraphProvider = void 0;
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const dswap_v2_sdk_1 = require("@miljan9602/dswap-v2-sdk");
const lodash_1 = __importDefault(require("lodash"));
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
    [dswap_sdk_core_1.ChainId.GOERLI]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.GOERLI]],
    [dswap_sdk_core_1.ChainId.SEPOLIA]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.SEPOLIA]],
    //v2 not deployed on [arbitrum, polygon, celo, gnosis, moonbeam, bnb, avalanche] and their testnets
    [dswap_sdk_core_1.ChainId.OPTIMISM]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.OPTIMISM],
        token_provider_1.USDC_OPTIMISM,
        token_provider_1.DAI_OPTIMISM,
        token_provider_1.USDT_OPTIMISM,
        token_provider_1.WBTC_OPTIMISM,
        token_provider_1.OP_OPTIMISM,
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ARBITRUM_ONE],
        token_provider_1.WBTC_ARBITRUM,
        token_provider_1.DAI_ARBITRUM,
        token_provider_1.USDC_ARBITRUM,
        token_provider_1.USDC_NATIVE_ARBITRUM,
        token_provider_1.USDT_ARBITRUM,
        token_provider_1.ARB_ARBITRUM,
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: [],
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: [],
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: [],
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: [],
    [dswap_sdk_core_1.ChainId.POLYGON]: [token_provider_1.USDC_POLYGON, token_provider_1.WETH_POLYGON, token_provider_1.WMATIC_POLYGON],
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: [],
    [dswap_sdk_core_1.ChainId.CELO]: [token_provider_1.CELO, token_provider_1.CUSD_CELO, token_provider_1.CEUR_CELO, token_provider_1.DAI_CELO],
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: [],
    [dswap_sdk_core_1.ChainId.GNOSIS]: [],
    [dswap_sdk_core_1.ChainId.MOONBEAM]: [
        chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.MOONBEAM],
        token_provider_1.DAI_MOONBEAM,
        token_provider_1.USDC_MOONBEAM,
        token_provider_1.WBTC_MOONBEAM,
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
    [dswap_sdk_core_1.ChainId.BASE_GOERLI]: [],
    [dswap_sdk_core_1.ChainId.BASE]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BASE], token_provider_1.USDC_BASE],
    [dswap_sdk_core_1.ChainId.ZORA]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ZORA]],
    [dswap_sdk_core_1.ChainId.ZORA_SEPOLIA]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ZORA_SEPOLIA]],
    [dswap_sdk_core_1.ChainId.ROOTSTOCK]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ROOTSTOCK]],
    [dswap_sdk_core_1.ChainId.BLAST]: [chains_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BLAST], token_provider_1.USDB_BLAST]
};
/**
 * Provider that does not get data from an external source and instead returns
 * a hardcoded list of Subgraph pools.
 *
 * Since the pools are hardcoded, the liquidity/price values are dummys and should not
 * be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. subgraph not available.
 *
 * @export
 * @class StaticV2SubgraphProvider
 */
class StaticV2SubgraphProvider {
    constructor(chainId) {
        this.chainId = chainId;
    }
    async getPools(tokenIn, tokenOut) {
        log_1.log.info('In static subgraph provider for V2');
        const bases = BASES_TO_CHECK_TRADES_AGAINST[this.chainId];
        const basePairs = lodash_1.default.flatMap(bases, (base) => bases.map((otherBase) => [base, otherBase]));
        if (tokenIn && tokenOut) {
            basePairs.push([tokenIn, tokenOut], ...bases.map((base) => [tokenIn, base]), ...bases.map((base) => [tokenOut, base]));
        }
        const pairs = (0, lodash_1.default)(basePairs)
            .filter((tokens) => Boolean(tokens[0] && tokens[1]))
            .filter(([tokenA, tokenB]) => tokenA.address !== tokenB.address && !tokenA.equals(tokenB))
            .value();
        const poolAddressSet = new Set();
        const subgraphPools = (0, lodash_1.default)(pairs)
            .map(([tokenA, tokenB]) => {
            const poolAddress = dswap_v2_sdk_1.Pair.getAddress(tokenA, tokenB);
            if (poolAddressSet.has(poolAddress)) {
                return undefined;
            }
            poolAddressSet.add(poolAddress);
            const [token0, token1] = tokenA.sortsBefore(tokenB)
                ? [tokenA, tokenB]
                : [tokenB, tokenA];
            return {
                id: poolAddress,
                liquidity: '100',
                token0: {
                    id: token0.address,
                },
                token1: {
                    id: token1.address,
                },
                supply: 100,
                reserve: 100,
                reserveUSD: 100,
            };
        })
            .compact()
            .value();
        return subgraphPools;
    }
}
exports.StaticV2SubgraphProvider = StaticV2SubgraphProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy92Mi9zdGF0aWMtc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0RBQTREO0FBQzVELDJEQUFnRDtBQUNoRCxvREFBdUI7QUFFdkIsOENBQTREO0FBQzVELHdDQUFxQztBQUNyQyxzREFzQzJCO0FBSTNCLE1BQU0sNkJBQTZCLEdBeUIvQjtJQUNGLENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQixnQ0FBdUIsQ0FBQyx3QkFBTyxDQUFDLE9BQU8sQ0FBRTtRQUN6Qyw0QkFBVztRQUNYLDZCQUFZO1FBQ1osNkJBQVk7UUFDWiw2QkFBWTtLQUNiO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3JCLGdDQUF1QixDQUFDLHdCQUFPLENBQUMsV0FBVyxDQUFFO1FBQzdDLGlDQUFnQjtRQUNoQixpQ0FBZ0I7S0FDakI7SUFDRCxDQUFDLHdCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQ0FBdUIsQ0FBQyx3QkFBTyxDQUFDLE1BQU0sQ0FBRSxDQUFDO0lBQzVELENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGdDQUF1QixDQUFDLHdCQUFPLENBQUMsT0FBTyxDQUFFLENBQUM7SUFDOUQsbUdBQW1HO0lBQ25HLENBQUMsd0JBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNsQixnQ0FBdUIsQ0FBQyx3QkFBTyxDQUFDLFFBQVEsQ0FBRTtRQUMxQyw4QkFBYTtRQUNiLDZCQUFZO1FBQ1osOEJBQWE7UUFDYiw4QkFBYTtRQUNiLDRCQUFXO0tBQ1o7SUFDRCxDQUFDLHdCQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDdEIsZ0NBQXVCLENBQUMsd0JBQU8sQ0FBQyxZQUFZLENBQUU7UUFDOUMsOEJBQWE7UUFD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