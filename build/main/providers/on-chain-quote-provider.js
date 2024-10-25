"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChainQuoteProvider = exports.ProviderGasError = exports.ProviderTimeoutError = exports.ProviderBlockHeaderError = exports.SuccessRateError = exports.BlockConflictError = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const dswap_router_sdk_1 = require("@miljan9602/dswap-router-sdk");
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
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
            if (failedQuoteStates.length > 0) {
                // TODO: Work with Arbitrum to find a solution for making large multicalls with gas limits that always
                // successfully.
                //
                // On Arbitrum we can not set a gas limit for every call in the multicall and guarantee that
                // we will not run out of gas on the node. This is because they have a different way of accounting
                // for gas, that seperates storage and compute gas costs, and we can not cover both in a single limit.
                //
                // To work around this and avoid throwing errors when really we just couldn't get a quote, we catch this
                // case and return 0 quotes found.
                if ((this.chainId == dswap_sdk_core_1.ChainId.ARBITRUM_ONE ||
                    this.chainId == dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI) &&
                    lodash_1.default.every(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason instanceof ProviderGasError) &&
                    attemptNumber == this.retryOptions.retries) {
                    log_1.log.error(`Failed to get quotes on Arbitrum due to provider gas error issue. Overriding error to return 0 quotes.`);
                    return {
                        results: [],
                        blockNumber: bignumber_1.BigNumber.from(0),
                        approxGasUsedPerSuccessCall: 0,
                    };
                }
                throw new Error(`Failed to get ${failedQuoteStates.length} quotes. Reasons: ${reasonForFailureStr}`);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib24tY2hhaW4tcXVvdGUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL29uLWNoYWluLXF1b3RlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUFxRDtBQUVyRCxtRUFJc0M7QUFDdEMsK0RBQXFEO0FBQ3JELDJEQUE2RDtBQUM3RCw4REFBNkQ7QUFDN0Qsb0RBQXVCO0FBQ3ZCLDREQUErQjtBQUUvQiw4Q0FBaUU7QUFDakUsd0dBRStEO0FBQy9ELGlGQUE4RTtBQUM5RSxrQ0FBdUU7QUFDdkUsaURBRzJCO0FBRTNCLHFDQUFrQztBQUNsQyxxRkFHNkM7QUFDN0MsMkNBQStDO0FBbUMvQyxNQUFhLGtCQUFtQixTQUFRLEtBQUs7SUFBN0M7O1FBQ1MsU0FBSSxHQUFHLG9CQUFvQixDQUFDO0lBQ3JDLENBQUM7Q0FBQTtBQUZELGdEQUVDO0FBRUQsTUFBYSxnQkFBaUIsU0FBUSxLQUFLO0lBQTNDOztRQUNTLFNBQUksR0FBRyxrQkFBa0IsQ0FBQztJQUNuQyxDQUFDO0NBQUE7QUFGRCw0Q0FFQztBQUVELE1BQWEsd0JBQXlCLFNBQVEsS0FBSztJQUFuRDs7UUFDUyxTQUFJLEdBQUcsMEJBQTBCLENBQUM7SUFDM0MsQ0FBQztDQUFBO0FBRkQsNERBRUM7QUFFRCxNQUFhLG9CQUFxQixTQUFRLEtBQUs7SUFBL0M7O1FBQ1MsU0FBSSxHQUFHLHNCQUFzQixDQUFDO0lBQ3ZDLENBQUM7Q0FBQTtBQUZELG9EQUVDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxLQUFLO0lBQTNDOztRQUNTLFNBQUksR0FBRyxrQkFBa0IsQ0FBQztJQUNuQyxDQUFDO0NBQUE7QUFGRCw0Q0FFQztBQW1KRCxNQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQztBQUVoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILE1BQWEsb0JBQW9CO0lBQy9C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