"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuoteThroughNativePool = exports.IOnChainGasModelFactory = exports.IV2GasModelFactory = exports.usdGasTokensByChain = void 0;
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const token_provider_1 = require("../../../providers/token-provider");
const util_1 = require("../../../util");
// When adding new usd gas tokens, ensure the tokens are ordered
// from tokens with highest decimals to lowest decimals. For example,
// DAI_AVAX has 18 decimals and comes before USDC_AVAX which has 6 decimals.
exports.usdGasTokensByChain = {
    [dswap_sdk_core_1.ChainId.MAINNET]: [token_provider_1.DAI_MAINNET, token_provider_1.USDC_MAINNET, token_provider_1.USDT_MAINNET],
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: [token_provider_1.USDC_SEI_MAINNET, token_provider_1.USDT_SEI_MAINNET],
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: [
        token_provider_1.DAI_ARBITRUM,
        token_provider_1.USDC_ARBITRUM,
        token_provider_1.USDC_NATIVE_ARBITRUM,
        token_provider_1.USDT_ARBITRUM,
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM]: [
        token_provider_1.DAI_OPTIMISM,
        token_provider_1.USDC_OPTIMISM,
        token_provider_1.USDC_NATIVE_OPTIMISM,
        token_provider_1.USDT_OPTIMISM,
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: [
        token_provider_1.DAI_OPTIMISM_GOERLI,
        token_provider_1.USDC_OPTIMISM_GOERLI,
        token_provider_1.USDT_OPTIMISM_GOERLI,
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: [
        token_provider_1.DAI_OPTIMISM_SEPOLIA,
        token_provider_1.USDC_OPTIMISM_SEPOLIA,
        token_provider_1.USDT_OPTIMISM_SEPOLIA,
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: [token_provider_1.USDC_ARBITRUM_GOERLI],
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: [token_provider_1.USDC_ARBITRUM_SEPOLIA],
    [dswap_sdk_core_1.ChainId.GOERLI]: [token_provider_1.DAI_GOERLI, token_provider_1.USDC_GOERLI, token_provider_1.USDT_GOERLI, token_provider_1.WBTC_GOERLI],
    [dswap_sdk_core_1.ChainId.SEPOLIA]: [token_provider_1.USDC_SEPOLIA, token_provider_1.DAI_SEPOLIA],
    [dswap_sdk_core_1.ChainId.POLYGON]: [token_provider_1.USDC_POLYGON, token_provider_1.USDC_NATIVE_POLYGON],
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: [token_provider_1.DAI_POLYGON_MUMBAI],
    [dswap_sdk_core_1.ChainId.CELO]: [token_provider_1.CUSD_CELO, token_provider_1.USDC_CELO, token_provider_1.USDC_NATIVE_CELO, token_provider_1.USDC_WORMHOLE_CELO],
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: [token_provider_1.CUSD_CELO_ALFAJORES],
    [dswap_sdk_core_1.ChainId.GNOSIS]: [token_provider_1.USDC_ETHEREUM_GNOSIS],
    [dswap_sdk_core_1.ChainId.MOONBEAM]: [token_provider_1.USDC_MOONBEAM],
    [dswap_sdk_core_1.ChainId.BNB]: [token_provider_1.USDT_BNB, token_provider_1.USDC_BNB, token_provider_1.DAI_BNB],
    [dswap_sdk_core_1.ChainId.AVALANCHE]: [
        token_provider_1.DAI_AVAX,
        token_provider_1.USDC_AVAX,
        token_provider_1.USDC_NATIVE_AVAX,
        token_provider_1.USDC_BRIDGED_AVAX,
    ],
    [dswap_sdk_core_1.ChainId.BASE]: [token_provider_1.USDC_BASE, token_provider_1.USDC_NATIVE_BASE],
    [dswap_sdk_core_1.ChainId.BLAST]: [token_provider_1.USDB_BLAST],
    [dswap_sdk_core_1.ChainId.ZORA]: [token_provider_1.USDC_ZORA]
};
/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IV2GasModelFactory
 */
class IV2GasModelFactory {
}
exports.IV2GasModelFactory = IV2GasModelFactory;
/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IOnChainGasModelFactory
 */
class IOnChainGasModelFactory {
}
exports.IOnChainGasModelFactory = IOnChainGasModelFactory;
// Determines if native currency is token0
// Gets the native price of the pool, dependent on 0 or 1
// quotes across the pool
const getQuoteThroughNativePool = (chainId, nativeTokenAmount, nativeTokenPool) => {
    const nativeCurrency = util_1.WRAPPED_NATIVE_CURRENCY[chainId];
    const isToken0 = nativeTokenPool.token0.equals(nativeCurrency);
    // returns mid price in terms of the native currency (the ratio of token/nativeToken)
    const nativeTokenPrice = isToken0
        ? nativeTokenPool.token0Price
        : nativeTokenPool.token1Price;
    // return gas cost in terms of the non native currency
    return nativeTokenPrice.quote(nativeTokenAmount);
};
exports.getQuoteThroughNativePool = getQuoteThroughNativePool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvZ2FzLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtEQUlvQztBQUtwQyxzRUErQzJDO0FBTTNDLHdDQUF3RDtBQVN4RCxnRUFBZ0U7QUFDaEUscUVBQXFFO0FBQ3JFLDRFQUE0RTtBQUMvRCxRQUFBLG1CQUFtQixHQUF1QztJQUNyRSxDQUFDLHdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyw0QkFBVyxFQUFFLDZCQUFZLEVBQUUsNkJBQVksQ0FBQztJQUM1RCxDQUFDLHdCQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQ0FBZ0IsRUFBRSxpQ0FBZ0IsQ0FBQztJQUMzRCxDQUFDLHdCQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDdEIsNkJBQVk7UUFDWiw4QkFBYTtRQUNiLHFDQUFvQjtRQUNwQiw4QkFBYTtLQUNkO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2xCLDZCQUFZO1FBQ1osOEJBQWE7UUFDYixxQ0FBb0I7UUFDcEIsOEJBQWE7S0FDZDtJQUNELENBQUMsd0JBQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUN6QixvQ0FBbUI7UUFDbkIscUNBQW9CO1FBQ3BCLHFDQUFvQjtLQUNyQjtJQUNELENBQUMsd0JBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1FBQzFCLHFDQUFvQjtRQUNwQixzQ0FBcUI7UUFDckIsc0NBQXFCO0tBQ3RCO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMscUNBQW9CLENBQUM7SUFDakQsQ0FBQyx3QkFBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxzQ0FBcUIsQ0FBQztJQUNuRCxDQUFDLHdCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQywyQkFBVSxFQUFFLDRCQUFXLEVBQUUsNEJBQVcsRUFBRSw0QkFBVyxDQUFDO0lBQ3JFLENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLDZCQUFZLEVBQUUsNEJBQVcsQ0FBQztJQUM5QyxDQUFDLHdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyw2QkFBWSxFQUFFLG9DQUFtQixDQUFDO0lBQ3RELENBQUMsd0JBQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLG1DQUFrQixDQUFDO0lBQzlDLENBQUMsd0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDBCQUFTLEVBQUUsMEJBQVMsRUFBRSxpQ0FBZ0IsRUFBRSxtQ0FBa0IsQ0FBQztJQUM1RSxDQUFDLHdCQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxvQ0FBbUIsQ0FBQztJQUMvQyxDQUFDLHdCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQ0FBb0IsQ0FBQztJQUN4QyxDQUFDLHdCQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyw4QkFBYSxDQUFDO0lBQ25DLENBQUMsd0JBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLHlCQUFRLEVBQUUseUJBQVEsRUFBRSx3QkFBTyxDQUFDO0lBQzVDLENBQUMsd0JBQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNuQix5QkFBUTtRQUNSLDBCQUFTO1FBQ1QsaUNBQWdCO1FBQ2hCLGtDQUFpQjtLQUNsQjtJQUNELENBQUMsd0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLDBCQUFTLEVBQUUsaUNBQWdCLENBQUM7SUFDN0MsQ0FBQyx3QkFBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsMkJBQVUsQ0FBQztJQUM3QixDQUFDLHdCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQywwQkFBUyxDQUFDO0NBQzVCLENBQUM7QUE2RUY7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQXNCLGtCQUFrQjtDQVF2QztBQVJELGdEQVFDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQXNCLHVCQUF1QjtDQWE1QztBQWJELDBEQWFDO0FBRUQsMENBQTBDO0FBQzFDLHlEQUF5RDtBQUN6RCx5QkFBeUI7QUFDbEIsTUFBTSx5QkFBeUIsR0FBRyxDQUN2QyxPQUFnQixFQUNoQixpQkFBMkMsRUFDM0MsZUFBNEIsRUFDWixFQUFFO0lBQ2xCLE1BQU0sY0FBYyxHQUFHLDhCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQy9ELHFGQUFxRjtJQUNyRixNQUFNLGdCQUFnQixHQUFHLFFBQVE7UUFDL0IsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxXQUFXO1FBQzdCLENBQUMsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDO0lBQ2hDLHNEQUFzRDtJQUN0RCxPQUFPLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBbUIsQ0FBQztBQUNyRSxDQUFDLENBQUM7QUFiVyxRQUFBLHlCQUF5Qiw2QkFhcEMifQ==