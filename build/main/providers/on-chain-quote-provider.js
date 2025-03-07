"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainQuoteProvider = exports.ProviderGasError = exports.ProviderTimeoutError = exports.ProviderBlockHeaderError = exports.SuccessRateError = exports.BlockConflictError = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const dswap_router_sdk_1 = require("@miljan9602/dswap-router-sdk");
const dswap_v3_sdk_1 = require("@miljan9602/dswap-v3-sdk");
const async_retry_1 = __importDefault(require("async-retry"));
const lodash_1 = __importDefault(require("lodash"));
const stats_lite_1 = __importDefault(require("stats-lite"));
const router_1 = require("../routers/router");
const IMixedRouteQuoterV1__factory_1 = require("../types/other/factories/IMixedRouteQuoterV1__factory");
const IQuoterV2__factory_1 = require("../types/v3/factories/IQuoterV2__factory");
const util_1 = require("../util");
const addresses_1 = require("../util/addresses");
const log_1 = require("../util/log");
const onchainQuoteProviderConfigs_1 = require("../util/onchainQuoteProviderConfigs");
const routes_1 = require("../util/routes");
class BlockConflictError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'BlockConflictError';
    }
}
exports.BlockConflictError = BlockConflictError;
class SuccessRateError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'SuccessRateError';
    }
}
exports.SuccessRateError = SuccessRateError;
class ProviderBlockHeaderError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderBlockHeaderError';
    }
}
exports.ProviderBlockHeaderError = ProviderBlockHeaderError;
class ProviderTimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderTimeoutError';
    }
}
exports.ProviderTimeoutError = ProviderTimeoutError;
/**
 * This error typically means that the gas used by the multicall has
 * exceeded the total call gas limit set by the node provider.
 *
 * This can be resolved by modifying BatchParams to request fewer
 * quotes per call, or to set a lower gas limit per quote.
 *
 * @export
 * @class ProviderGasError
 */
class ProviderGasError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderGasError';
    }
}
exports.ProviderGasError = ProviderGasError;
const DEFAULT_BATCH_RETRIES = 2;
/**
 * Computes on chain quotes for swaps. For pure V3 routes, quotes are computed on-chain using
 * the 'QuoterV2' smart contract. For exactIn mixed and V2 routes, quotes are computed using the 'MixedRouteQuoterV1' contract
 * This is because computing quotes off-chain would require fetching all the tick data for each pool, which is a lot of data.
 *
 * To minimize the number of requests for quotes we use a Multicall contract. Generally
 * the number of quotes to fetch exceeds the maximum we can fit in a single multicall
 * while staying under gas limits, so we also batch these quotes across multiple multicalls.
 *
 * The biggest challenge with the quote provider is dealing with various gas limits.
 * Each provider sets a limit on the amount of gas a call can consume (on Infura this
 * is approximately 10x the block max size), so we must ensure each multicall does not
 * exceed this limit. Additionally, each quote on V3 can consume a large number of gas if
 * the pool lacks liquidity and the swap would cause all the ticks to be traversed.
 *
 * To ensure we don't exceed the node's call limit, we limit the gas used by each quote to
 * a specific value, and we limit the number of quotes in each multicall request. Users of this
 * class should set BatchParams such that multicallChunk * gasLimitPerCall is less than their node
 * providers total gas limit per call.
 *
 * @export
 * @class OnChainQuoteProvider
 */
class OnChainQuoteProvider {
    /**
     * Creates an instance of OnChainQuoteProvider.
     *
     * @param chainId The chain to get quotes for.
     * @param provider The web 3 provider.
     * @param multicall2Provider The multicall provider to use to get the quotes on-chain.
     * Only supports the Uniswap Multicall contract as it needs the gas limitting functionality.
     * @param retryOptions The retry options for each call to the multicall.
     * @param batchParams The parameters for each batched call to the multicall.
     * @param gasErrorFailureOverride The gas and chunk parameters to use when retrying a batch that failed due to out of gas.
     * @param successRateFailureOverrides The parameters for retries when we fail to get quotes.
     * @param blockNumberConfig Parameters for adjusting which block we get quotes from, and how to handle block header not found errors.
     * @param [quoterAddressOverride] Overrides the address of the quoter contract to use.
     * @param metricsPrefix metrics prefix to differentiate between different instances of the quote provider.
     */
    constructor(chainId, provider, 
    // Only supports Uniswap Multicall as it needs the gas limitting functionality.
    multicall2Provider, 
    // retryOptions, batchParams, and gasErrorFailureOverride are always override in alpha-router
    // so below default values are always not going to be picked up in prod.
    // So we will not extract out below default values into constants.
    retryOptions = {
        retries: DEFAULT_BATCH_RETRIES,
        minTimeout: 25,
        maxTimeout: 250,
    }, batchParams = (_optimisticCachedRoutes, _useMixedRouteQuoter) => {
        return {
            multicallChunk: 150,
            gasLimitPerCall: 1000000,
            quoteMinSuccessRate: 0.2,
        };
    }, gasErrorFailureOverride = {
        gasLimitOverride: 1500000,
        multicallChunk: 100,
    }, 
    // successRateFailureOverrides and blockNumberConfig are not always override in alpha-router.
    // So we will extract out below default values into constants.
    // In alpha-router default case, we will also define the constants with same values as below.
    successRateFailureOverrides = onchainQuoteProviderConfigs_1.DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES, blockNumberConfig = onchainQuoteProviderConfigs_1.DEFAULT_BLOCK_NUMBER_CONFIGS, quoterAddressOverride, metricsPrefix = (chainId, useMixedRouteQuoter, optimisticCachedRoutes) => useMixedRouteQuoter
        ? `ChainId_${chainId}_MixedQuoter_OptimisticCachedRoutes${optimisticCachedRoutes}_`
        : `ChainId_${chainId}_V3Quoter_OptimisticCachedRoutes${optimisticCachedRoutes}_`) {
        this.chainId = chainId;
        this.provider = provider;
        this.multicall2Provider = multicall2Provider;
        this.retryOptions = retryOptions;
        this.batchParams = batchParams;
        this.gasErrorFailureOverride = gasErrorFailureOverride;
        this.successRateFailureOverrides = successRateFailureOverrides;
        this.blockNumberConfig = blockNumberConfig;
        this.quoterAddressOverride = quoterAddressOverride;
        this.metricsPrefix = metricsPrefix;
    }
    getQuoterAddress(useMixedRouteQuoter) {
        if (this.quoterAddressOverride) {
            const quoterAddress = this.quoterAddressOverride(useMixedRouteQuoter);
            if (!quoterAddress) {
                throw new Error(`No address for the quoter contract on chain id: ${this.chainId}`);
            }
            return quoterAddress;
        }
        const quoterAddress = useMixedRouteQuoter
            ? addresses_1.MIXED_ROUTE_QUOTER_V1_ADDRESSES[this.chainId]
            : addresses_1.NEW_QUOTER_V2_ADDRESSES[this.chainId];
        if (!quoterAddress) {
            throw new Error(`No address for the quoter contract on chain id: ${this.chainId}`);
        }
        return quoterAddress;
    }
    async getQuotesManyExactIn(amountIns, routes, providerConfig) {
        return this.getQuotesManyData(amountIns, routes, 'quoteExactInput', providerConfig);
    }
    async getQuotesManyExactOut(amountOuts, routes, providerConfig) {
        return this.getQuotesManyData(amountOuts, routes, 'quoteExactOutput', providerConfig);
    }
    async getQuotesManyData(amounts, routes, functionName, _providerConfig) {
        var _a, _b;
        const useMixedRouteQuoter = routes.some((route) => route.protocol === dswap_router_sdk_1.Protocol.V2) ||
            routes.some((route) => route.protocol === dswap_router_sdk_1.Protocol.MIXED);
        const optimisticCachedRoutes = (_a = _providerConfig === null || _providerConfig === void 0 ? void 0 : _providerConfig.optimisticCachedRoutes) !== null && _a !== void 0 ? _a : false;
        /// Validate that there are no incorrect routes / function combinations
        this.validateRoutes(routes, functionName, useMixedRouteQuoter);
        let multicallChunk = this.batchParams(optimisticCachedRoutes, useMixedRouteQuoter).multicallChunk;
        let gasLimitOverride = this.batchParams(optimisticCachedRoutes, useMixedRouteQuoter).gasLimitPerCall;
        const { baseBlockOffset, rollback } = this.blockNumberConfig;
        // Apply the base block offset if provided
        const originalBlockNumber = await this.provider.getBlockNumber();
        const providerConfig = Object.assign(Object.assign({}, _providerConfig), { blockNumber: (_b = _providerConfig === null || _providerConfig === void 0 ? void 0 : _providerConfig.blockNumber) !== null && _b !== void 0 ? _b : originalBlockNumber + baseBlockOffset });
        const inputs = (0, lodash_1.default)(routes)
            .flatMap((route) => {
            const encodedRoute = route.protocol === dswap_router_sdk_1.Protocol.V3
                ? (0, dswap_v3_sdk_1.encodeRouteToPath)(route, functionName == 'quoteExactOutput' // For exactOut must be true to ensure the routes are reversed.
                )
                : (0, dswap_router_sdk_1.encodeMixedRouteToPath)(route instanceof router_1.V2Route
                    ? new dswap_router_sdk_1.MixedRouteSDK(route.pairs, route.input, route.output)
                    : route);
            const routeInputs = amounts.map((amount) => [
                encodedRoute,
                `0x${amount.quotient.toString(16)}`,
            ]);
            return routeInputs;
        })
            .value();
        const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk));
        const inputsChunked = lodash_1.default.chunk(inputs, normalizedChunk);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let quoteStates = lodash_1.default.map(inputsChunked, (inputChunk) => {
            return {
                status: 'pending',
                inputs: inputChunk,
            };
        });
        log_1.log.info(`About to get ${inputs.length} quotes in chunks of ${normalizedChunk} [${lodash_1.default.map(inputsChunked, (i) => i.length).join(',')}] ${gasLimitOverride
            ? `with a gas limit override of ${gasLimitOverride}`
            : ''} and block number: ${await providerConfig.blockNumber} [Original before offset: ${originalBlockNumber}].`);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBatchSize`, inputs.length, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBatchSize_${(0, util_1.ID_TO_NETWORK_NAME)(this.chainId)}`, inputs.length, util_1.MetricLoggerUnit.Count);
        const startTime = Date.now();
        let haveRetriedForSuccessRate = false;
        let haveRetriedForBlockHeader = false;
        let blockHeaderRetryAttemptNumber = 0;
        let haveIncrementedBlockHeaderFailureCounter = false;
        let blockHeaderRolledBack = false;
        let haveRetriedForBlockConflictError = false;
        let haveRetriedForOutOfGas = false;
        let haveRetriedForTimeout = false;
        let haveRetriedForUnknownReason = false;
        let finalAttemptNumber = 1;
        const expectedCallsMade = quoteStates.length;
        let totalCallsMade = 0;
        const { results: quoteResults, blockNumber, approxGasUsedPerSuccessCall, } = await (0, async_retry_1.default)(async (_bail, attemptNumber) => {
            haveIncrementedBlockHeaderFailureCounter = false;
            finalAttemptNumber = attemptNumber;
            const [success, failed, pending] = this.partitionQuotes(quoteStates);
            log_1.log.info(`Starting attempt: ${attemptNumber}.
          Currently ${success.length} success, ${failed.length} failed, ${pending.length} pending.
          Gas limit override: ${gasLimitOverride} Block number override: ${providerConfig.blockNumber}.`);
            quoteStates = await Promise.all(lodash_1.default.map(quoteStates, async (quoteState, idx) => {
                if (quoteState.status == 'success') {
                    return quoteState;
                }
                // QuoteChunk is pending or failed, so we try again
                const { inputs } = quoteState;
                try {
                    totalCallsMade = totalCallsMade + 1;
                    const results = await this.multicall2Provider.callSameFunctionOnContractWithMultipleParams({
                        address: this.getQuoterAddress(useMixedRouteQuoter),
                        contractInterface: useMixedRouteQuoter
                            ? IMixedRouteQuoterV1__factory_1.IMixedRouteQuoterV1__factory.createInterface()
                            : IQuoterV2__factory_1.IQuoterV2__factory.createInterface(),
                        functionName,
                        functionParams: inputs,
                        providerConfig,
                        additionalConfig: {
                            gasLimitPerCallOverride: gasLimitOverride,
                        },
                    });
                    const successRateError = this.validateSuccessRate(results.results, haveRetriedForSuccessRate, useMixedRouteQuoter, optimisticCachedRoutes);
                    if (successRateError) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: successRateError,
                            results,
                        };
                    }
                    return {
                        status: 'success',
                        inputs,
                        results,
                    };
                }
                catch (err) {
                    // Error from providers have huge messages that include all the calldata and fill the logs.
                    // Catch them and rethrow with shorter message.
                    if (err.message.includes('header not found')) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: new ProviderBlockHeaderError(err.message.slice(0, 500)),
                        };
                    }
                    if (err.message.includes('timeout')) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: new ProviderTimeoutError(`Req ${idx}/${quoteStates.length}. Request had ${inputs.length} inputs. ${err.message.slice(0, 500)}`),
                        };
                    }
                    if (err.message.includes('out of gas')) {
                        return {
                            status: 'failed',
                            inputs,
                            reason: new ProviderGasError(err.message.slice(0, 500)),
                        };
                    }
                    return {
                        status: 'failed',
                        inputs,
                        reason: new Error(`Unknown error from provider: ${err.message.slice(0, 500)}`),
                    };
                }
            }));
            const [successfulQuoteStates, failedQuoteStates, pendingQuoteStates] = this.partitionQuotes(quoteStates);
            if (pendingQuoteStates.length > 0) {
                throw new Error('Pending quote after waiting for all promises.');
            }
            let retryAll = false;
            const blockNumberError = this.validateBlockNumbers(successfulQuoteStates, inputsChunked.length, gasLimitOverride);
            // If there is a block number conflict we retry all the quotes.
            if (blockNumberError) {
                retryAll = true;
            }
            const reasonForFailureStr = lodash_1.default.map(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason.name).join(', ');
            if (failedQuoteStates.length > 0) {
                log_1.log.info(`On attempt ${attemptNumber}: ${failedQuoteStates.length}/${quoteStates.length} quotes failed. Reasons: ${reasonForFailureStr}`);
                for (const failedQuoteState of failedQuoteStates) {
                    const { reason: error } = failedQuoteState;
                    log_1.log.info({ error }, `[QuoteFetchError] Attempt ${attemptNumber}. ${error.message}`);
                    if (error instanceof BlockConflictError) {
                        if (!haveRetriedForBlockConflictError) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBlockConflictErrorRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForBlockConflictError = true;
                        }
                        retryAll = true;
                    }
                    else if (error instanceof ProviderBlockHeaderError) {
                        if (!haveRetriedForBlockHeader) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBlockHeaderNotFoundRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForBlockHeader = true;
                        }
                        // Ensure that if multiple calls fail due to block header in the current pending batch,
                        // we only count once.
                        if (!haveIncrementedBlockHeaderFailureCounter) {
                            blockHeaderRetryAttemptNumber =
                                blockHeaderRetryAttemptNumber + 1;
                            haveIncrementedBlockHeaderFailureCounter = true;
                        }
                        if (rollback.enabled) {
                            const { rollbackBlockOffset, attemptsBeforeRollback } = rollback;
                            if (blockHeaderRetryAttemptNumber >= attemptsBeforeRollback &&
                                !blockHeaderRolledBack) {
                                log_1.log.info(`Attempt ${attemptNumber}. Have failed due to block header ${blockHeaderRetryAttemptNumber - 1} times. Rolling back block number by ${rollbackBlockOffset} for next retry`);
                                providerConfig.blockNumber = providerConfig.blockNumber
                                    ? (await providerConfig.blockNumber) + rollbackBlockOffset
                                    : (await this.provider.getBlockNumber()) +
                                        rollbackBlockOffset;
                                retryAll = true;
                                blockHeaderRolledBack = true;
                            }
                        }
                    }
                    else if (error instanceof ProviderTimeoutError) {
                        if (!haveRetriedForTimeout) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteTimeoutRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForTimeout = true;
                        }
                    }
                    else if (error instanceof ProviderGasError) {
                        if (!haveRetriedForOutOfGas) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteOutOfGasExceptionRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForOutOfGas = true;
                        }
                        gasLimitOverride = this.gasErrorFailureOverride.gasLimitOverride;
                        multicallChunk = this.gasErrorFailureOverride.multicallChunk;
                        retryAll = true;
                    }
                    else if (error instanceof SuccessRateError) {
                        if (!haveRetriedForSuccessRate) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteSuccessRateRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForSuccessRate = true;
                            // Low success rate can indicate too little gas given to each call.
                            gasLimitOverride =
                                this.successRateFailureOverrides.gasLimitOverride;
                            multicallChunk =
                                this.successRateFailureOverrides.multicallChunk;
                            retryAll = true;
                        }
                    }
                    else {
                        if (!haveRetriedForUnknownReason) {
                            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteUnknownReasonRetry`, 1, util_1.MetricLoggerUnit.Count);
                            haveRetriedForUnknownReason = true;
                        }
                    }
                }
            }
            if (retryAll) {
                log_1.log.info(`Attempt ${attemptNumber}. Resetting all requests to pending for next attempt.`);
                const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk));
                const inputsChunked = lodash_1.default.chunk(inputs, normalizedChunk);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                quoteStates = lodash_1.default.map(inputsChunked, (inputChunk) => {
                    return {
                        status: 'pending',
                        inputs: inputChunk,
                    };
                });
            }
            // if (failedQuoteStates.length > 0) {
            //   // TODO: Work with Arbitrum to find a solution for making large multicalls with gas limits that always
            //   // successfully.
            //   //
            //   // On Arbitrum we can not set a gas limit for every call in the multicall and guarantee that
            //   // we will not run out of gas on the node. This is because they have a different way of accounting
            //   // for gas, that seperates storage and compute gas costs, and we can not cover both in a single limit.
            //   //
            //   // To work around this and avoid throwing errors when really we just couldn't get a quote, we catch this
            //   // case and return 0 quotes found.
            //   if (
            //     (this.chainId == ChainId.ARBITRUM_ONE ||
            //       this.chainId == ChainId.ARBITRUM_GOERLI) &&
            //     _.every(
            //       failedQuoteStates,
            //       (failedQuoteState) =>
            //         failedQuoteState.reason instanceof ProviderGasError
            //     ) &&
            //     attemptNumber == this.retryOptions.retries
            //   ) {
            //     log.error(
            //       `Failed to get quotes on Arbitrum due to provider gas error issue. Overriding error to return 0 quotes.`
            //     );
            //     return {
            //       results: [],
            //       blockNumber: BigNumber.from(0),
            //       approxGasUsedPerSuccessCall: 0,
            //     };
            //   }
            //   throw new Error(
            //     `Failed to get ${failedQuoteStates.length} quotes. Reasons: ${reasonForFailureStr}`
            //   );
            // }
            const callResults = lodash_1.default.map(successfulQuoteStates, (quoteState) => quoteState.results);
            return {
                results: lodash_1.default.flatMap(callResults, (result) => result.results),
                blockNumber: bignumber_1.BigNumber.from(callResults[0].blockNumber),
                approxGasUsedPerSuccessCall: stats_lite_1.default.percentile(lodash_1.default.map(callResults, (result) => result.approxGasUsedPerSuccessCall), 100),
            };
        }, Object.assign({ retries: DEFAULT_BATCH_RETRIES }, this.retryOptions));
        const routesQuotes = this.processQuoteResults(quoteResults, routes, amounts, bignumber_1.BigNumber.from(gasLimitOverride));
        const endTime = Date.now();
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteLatency`, endTime - startTime, util_1.MetricLoggerUnit.Milliseconds);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteApproxGasUsedPerSuccessfulCall`, approxGasUsedPerSuccessCall, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteNumRetryLoops`, finalAttemptNumber - 1, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteTotalCallsToProvider`, totalCallsMade, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteExpectedCallsToProvider`, expectedCallsMade, util_1.MetricLoggerUnit.Count);
        util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteNumRetriedCalls`, totalCallsMade - expectedCallsMade, util_1.MetricLoggerUnit.Count);
        const [successfulQuotes, failedQuotes] = (0, lodash_1.default)(routesQuotes)
            .flatMap((routeWithQuotes) => routeWithQuotes[1])
            .partition((quote) => quote.quote != null)
            .value();
        log_1.log.info(`Got ${successfulQuotes.length} successful quotes, ${failedQuotes.length} failed quotes. Took ${finalAttemptNumber - 1} attempt loops. Total calls made to provider: ${totalCallsMade}. Have retried for timeout: ${haveRetriedForTimeout}`);
        return {
            routesWithQuotes: routesQuotes,
            blockNumber,
        };
    }
    partitionQuotes(quoteStates) {
        const successfulQuoteStates = lodash_1.default.filter(quoteStates, (quoteState) => quoteState.status == 'success');
        const failedQuoteStates = lodash_1.default.filter(quoteStates, (quoteState) => quoteState.status == 'failed');
        const pendingQuoteStates = lodash_1.default.filter(quoteStates, (quoteState) => quoteState.status == 'pending');
        return [successfulQuoteStates, failedQuoteStates, pendingQuoteStates];
    }
    processQuoteResults(quoteResults, routes, amounts, gasLimit) {
        const routesQuotes = [];
        const quotesResultsByRoute = lodash_1.default.chunk(quoteResults, amounts.length);
        const debugFailedQuotes = [];
        for (let i = 0; i < quotesResultsByRoute.length; i++) {
            const route = routes[i];
            const quoteResults = quotesResultsByRoute[i];
            const quotes = lodash_1.default.map(quoteResults, (quoteResult, index) => {
                var _a;
                const amount = amounts[index];
                if (!quoteResult.success) {
                    const percent = (100 / amounts.length) * (index + 1);
                    const amountStr = amount.toFixed(Math.min(amount.currency.decimals, 2));
                    const routeStr = (0, routes_1.routeToString)(route);
                    debugFailedQuotes.push({
                        route: routeStr,
                        percent,
                        amount: amountStr,
                    });
                    return {
                        amount,
                        quote: null,
                        sqrtPriceX96AfterList: null,
                        gasEstimate: (_a = quoteResult.gasUsed) !== null && _a !== void 0 ? _a : null,
                        gasLimit: gasLimit,
                        initializedTicksCrossedList: null,
                    };
                }
                return {
                    amount,
                    quote: quoteResult.result[0],
                    sqrtPriceX96AfterList: quoteResult.result[1],
                    initializedTicksCrossedList: quoteResult.result[2],
                    gasEstimate: quoteResult.result[3],
                    gasLimit: gasLimit,
                };
            });
            routesQuotes.push([route, quotes]);
        }
        // For routes and amounts that we failed to get a quote for, group them by route
        // and batch them together before logging to minimize number of logs.
        const debugChunk = 80;
        lodash_1.default.forEach(lodash_1.default.chunk(debugFailedQuotes, debugChunk), (quotes, idx) => {
            const failedQuotesByRoute = lodash_1.default.groupBy(quotes, (q) => q.route);
            const failedFlat = lodash_1.default.mapValues(failedQuotesByRoute, (f) => (0, lodash_1.default)(f)
                .map((f) => `${f.percent}%[${f.amount}]`)
                .join(','));
            log_1.log.info({
                failedQuotes: lodash_1.default.map(failedFlat, (amounts, routeStr) => `${routeStr} : ${amounts}`),
            }, `Failed on chain quotes for routes Part ${idx}/${Math.ceil(debugFailedQuotes.length / debugChunk)}`);
        });
        return routesQuotes;
    }
    validateBlockNumbers(successfulQuoteStates, totalCalls, gasLimitOverride) {
        if (successfulQuoteStates.length <= 1) {
            return null;
        }
        const results = lodash_1.default.map(successfulQuoteStates, (quoteState) => quoteState.results);
        const blockNumbers = lodash_1.default.map(results, (result) => result.blockNumber);
        const uniqBlocks = (0, lodash_1.default)(blockNumbers)
            .map((blockNumber) => blockNumber.toNumber())
            .uniq()
            .value();
        if (uniqBlocks.length == 1) {
            return null;
        }
        /* if (
          uniqBlocks.length == 2 &&
          Math.abs(uniqBlocks[0]! - uniqBlocks[1]!) <= 1
        ) {
          return null;
        } */
        return new BlockConflictError(`Quotes returned from different blocks. ${uniqBlocks}. ${totalCalls} calls were made with gas limit ${gasLimitOverride}`);
    }
    validateSuccessRate(allResults, haveRetriedForSuccessRate, useMixedRouteQuoter, optimisticCachedRoutes) {
        const numResults = allResults.length;
        const numSuccessResults = allResults.filter((result) => result.success).length;
        const successRate = (1.0 * numSuccessResults) / numResults;
        const { quoteMinSuccessRate } = this.batchParams(optimisticCachedRoutes, useMixedRouteQuoter);
        if (successRate < quoteMinSuccessRate) {
            if (haveRetriedForSuccessRate) {
                log_1.log.info(`Quote success rate still below threshold despite retry. Continuing. ${quoteMinSuccessRate}: ${successRate}`);
                util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteRetriedSuccessRateLow`, successRate, util_1.MetricLoggerUnit.Percent);
                return;
            }
            util_1.metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteSuccessRateLow`, successRate, util_1.MetricLoggerUnit.Percent);
            return new SuccessRateError(`Quote success rate below threshold of ${quoteMinSuccessRate}: ${successRate}`);
        }
    }
    /**
     * Throw an error for incorrect routes / function combinations
     * @param routes Any combination of V3, V2, and Mixed routes.
     * @param functionName
     * @param useMixedRouteQuoter true if there are ANY V2Routes or MixedRoutes in the routes parameter
     */
    validateRoutes(routes, functionName, useMixedRouteQuoter) {
        /// We do not send any V3Routes to new qutoer becuase it is not deployed on chains besides mainnet
        if (routes.some((route) => route.protocol === dswap_router_sdk_1.Protocol.V3) &&
            useMixedRouteQuoter) {
            throw new Error(`Cannot use mixed route quoter with V3 routes`);
        }
        /// We cannot call quoteExactOutput with V2 or Mixed routes
        if (functionName === 'quoteExactOutput' && useMixedRouteQuoter) {
            throw new Error('Cannot call quoteExactOutput with V2 or Mixed routes');
        }
    }
}
exports.OnChainQuoteProvider = OnChainQuoteProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib24tY2hhaW4tcXVvdGUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL29uLWNoYWluLXF1b3RlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUFxRDtBQUVyRCxtRUFJc0M7QUFFdEMsMkRBQTZEO0FBQzdELDhEQUE2RDtBQUM3RCxvREFBdUI7QUFDdkIsNERBQStCO0FBRS9CLDhDQUFpRTtBQUNqRSx3R0FFK0Q7QUFDL0QsaUZBQThFO0FBQzlFLGtDQUF1RTtBQUN2RSxpREFHMkI7QUFFM0IscUNBQWtDO0FBQ2xDLHFGQUc2QztBQUM3QywyQ0FBK0M7QUFtQy9DLE1BQWEsa0JBQW1CLFNBQVEsS0FBSztJQUE3Qzs7UUFDUyxTQUFJLEdBQUcsb0JBQW9CLENBQUM7SUFDckMsQ0FBQztDQUFBO0FBRkQsZ0RBRUM7QUFFRCxNQUFhLGdCQUFpQixTQUFRLEtBQUs7SUFBM0M7O1FBQ1MsU0FBSSxHQUFHLGtCQUFrQixDQUFDO0lBQ25DLENBQUM7Q0FBQTtBQUZELDRDQUVDO0FBRUQsTUFBYSx3QkFBeUIsU0FBUSxLQUFLO0lBQW5EOztRQUNTLFNBQUksR0FBRywwQkFBMEIsQ0FBQztJQUMzQyxDQUFDO0NBQUE7QUFGRCw0REFFQztBQUVELE1BQWEsb0JBQXFCLFNBQVEsS0FBSztJQUEvQzs7UUFDUyxTQUFJLEdBQUcsc0JBQXNCLENBQUM7SUFDdkMsQ0FBQztDQUFBO0FBRkQsb0RBRUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLGdCQUFpQixTQUFRLEtBQUs7SUFBM0M7O1FBQ1MsU0FBSSxHQUFHLGtCQUFrQixDQUFDO0lBQ25DLENBQUM7Q0FBQTtBQUZELDRDQUVDO0FBbUpELE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsTUFBYSxvQkFBb0I7SUFDL0I7Ozs7Ozs7Ozs7Ozs7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