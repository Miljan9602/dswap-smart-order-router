"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSwapMethodParameters = exports.buildTrade = void 0;
const dswap_router_sdk_1 = require("@miljan9602/dswap-router-sdk");
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const dswap_universal_router_sdk_1 = require("@miljan9602/dswap-universal-router-sdk");
const dswap_v2_sdk_1 = require("@miljan9602/dswap-v2-sdk");
const dswap_v3_sdk_1 = require("@miljan9602/dswap-v3-sdk");
const lodash_1 = __importDefault(require("lodash"));
const __1 = require("..");
function buildTrade(tokenInCurrency, tokenOutCurrency, tradeType, routeAmounts) {
    /// Removed partition because of new mixedRoutes
    const v3RouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === dswap_router_sdk_1.Protocol.V3);
    const v2RouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === dswap_router_sdk_1.Protocol.V2);
    const mixedRouteAmounts = lodash_1.default.filter(routeAmounts, (routeAmount) => routeAmount.protocol === dswap_router_sdk_1.Protocol.MIXED);
    const v3Routes = lodash_1.default.map(v3RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == dswap_sdk_core_1.TradeType.EXACT_INPUT) {
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeRaw = new dswap_v3_sdk_1.Route(route.pools, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev3: routeRaw,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeCurrency = new dswap_v3_sdk_1.Route(route.pools, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev3: routeCurrency,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const v2Routes = lodash_1.default.map(v2RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == dswap_sdk_core_1.TradeType.EXACT_INPUT) {
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeV2SDK = new dswap_v2_sdk_1.Route(route.pairs, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev2: routeV2SDK,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeV2SDK = new dswap_v2_sdk_1.Route(route.pairs, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev2: routeV2SDK,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const mixedRoutes = lodash_1.default.map(mixedRouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        if (tradeType != dswap_sdk_core_1.TradeType.EXACT_INPUT) {
            throw new Error('Mixed routes are only supported for exact input trades');
        }
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        const amountCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
        const quoteCurrency = __1.CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
        const routeRaw = new dswap_router_sdk_1.MixedRouteSDK(route.pools, amountCurrency.currency, quoteCurrency.currency);
        return {
            mixedRoute: routeRaw,
            inputAmount: amountCurrency,
            outputAmount: quoteCurrency,
        };
    });
    const trade = new dswap_router_sdk_1.Trade({ v2Routes, v3Routes, mixedRoutes, tradeType });
    return trade;
}
exports.buildTrade = buildTrade;
function buildSwapMethodParameters(trade, swapConfig, chainId) {
    if (swapConfig.type == __1.SwapType.UNIVERSAL_ROUTER) {
        return Object.assign(Object.assign({}, dswap_universal_router_sdk_1.SwapRouter.swapERC20CallParameters(trade, swapConfig)), { to: (0, dswap_universal_router_sdk_1.UNIVERSAL_ROUTER_ADDRESS)(chainId) });
    }
    else if (swapConfig.type == __1.SwapType.SWAP_ROUTER_02) {
        const { recipient, slippageTolerance, deadline, inputTokenPermit } = swapConfig;
        return Object.assign(Object.assign({}, dswap_router_sdk_1.SwapRouter.swapCallParameters(trade, {
            recipient,
            slippageTolerance,
            deadlineOrPreviousBlockhash: deadline,
            inputTokenPermit,
        })), { to: (0, __1.SWAP_ROUTER_02_ADDRESSES)(chainId) });
    }
    throw new Error(`Unsupported swap type ${swapConfig}`);
}
exports.buildSwapMethodParameters = buildSwapMethodParameters;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kUGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL21ldGhvZFBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbUVBS3NDO0FBQ3RDLCtEQUEwRTtBQUMxRSx1RkFHZ0Q7QUFDaEQsMkRBQStEO0FBQy9ELDJEQUErRDtBQUMvRCxvREFBdUI7QUFFdkIsMEJBVVk7QUFFWixTQUFnQixVQUFVLENBQ3hCLGVBQXlCLEVBQ3pCLGdCQUEwQixFQUMxQixTQUFxQixFQUNyQixZQUFtQztJQUVuQyxnREFBZ0Q7SUFDaEQsTUFBTSxjQUFjLEdBQUcsZ0JBQUMsQ0FBQyxNQUFNLENBQzdCLFlBQVksRUFDWixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsS0FBSywyQkFBUSxDQUFDLEVBQUUsQ0FDdEQsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUM3QixZQUFZLEVBQ1osQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssMkJBQVEsQ0FBQyxFQUFFLENBQ3RELENBQUM7SUFDRixNQUFNLGlCQUFpQixHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUNoQyxZQUFZLEVBQ1osQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssMkJBQVEsQ0FBQyxLQUFLLENBQ3pELENBQUM7SUFFRixNQUFNLFFBQVEsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FRcEIsY0FBeUMsRUFDekMsQ0FBQyxXQUFrQyxFQUFFLEVBQUU7UUFDckMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsV0FBVyxDQUFDO1FBRTdDLGtFQUFrRTtRQUNsRSx1RUFBdUU7UUFDdkUsa0dBQWtHO1FBQ2xHLElBQUksU0FBUyxJQUFJLDBCQUFTLENBQUMsV0FBVyxFQUFFO1lB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