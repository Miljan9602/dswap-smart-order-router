import { BigNumber } from '@ethersproject/bignumber';
import { encodeMixedRouteToPath, MixedRouteSDK, Protocol } from '@miljan9602/dswap-router-sdk';
import { encodeRouteToPath } from '@miljan9602/dswap-v3-sdk';
import retry from 'async-retry';
import _ from 'lodash';
import stats from 'stats-lite';
import { V2Route } from '../routers/router';
import { IMixedRouteQuoterV1__factory } from '../types/other/factories/IMixedRouteQuoterV1__factory';
import { IQuoterV2__factory } from '../types/v3/factories/IQuoterV2__factory';
import { ID_TO_NETWORK_NAME, metric, MetricLoggerUnit } from '../util';
import { MIXED_ROUTE_QUOTER_V1_ADDRESSES, NEW_QUOTER_V2_ADDRESSES } from '../util/addresses';
import { log } from '../util/log';
import { DEFAULT_BLOCK_NUMBER_CONFIGS, DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES } from '../util/onchainQuoteProviderConfigs';
import { routeToString } from '../util/routes';
export class BlockConflictError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'BlockConflictError';
    }
}
export class SuccessRateError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'SuccessRateError';
    }
}
export class ProviderBlockHeaderError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderBlockHeaderError';
    }
}
export class ProviderTimeoutError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderTimeoutError';
    }
}
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
export class ProviderGasError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ProviderGasError';
    }
}
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
export class OnChainQuoteProvider {
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
    successRateFailureOverrides = DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES, blockNumberConfig = DEFAULT_BLOCK_NUMBER_CONFIGS, quoterAddressOverride, metricsPrefix = (chainId, useMixedRouteQuoter, optimisticCachedRoutes) => useMixedRouteQuoter
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
            ? MIXED_ROUTE_QUOTER_V1_ADDRESSES[this.chainId]
            : NEW_QUOTER_V2_ADDRESSES[this.chainId];
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
        const useMixedRouteQuoter = routes.some((route) => route.protocol === Protocol.V2) ||
            routes.some((route) => route.protocol === Protocol.MIXED);
        const optimisticCachedRoutes = (_a = _providerConfig === null || _providerConfig === void 0 ? void 0 : _providerConfig.optimisticCachedRoutes) !== null && _a !== void 0 ? _a : false;
        /// Validate that there are no incorrect routes / function combinations
        this.validateRoutes(routes, functionName, useMixedRouteQuoter);
        let multicallChunk = this.batchParams(optimisticCachedRoutes, useMixedRouteQuoter).multicallChunk;
        let gasLimitOverride = this.batchParams(optimisticCachedRoutes, useMixedRouteQuoter).gasLimitPerCall;
        const { baseBlockOffset, rollback } = this.blockNumberConfig;
        // Apply the base block offset if provided
        const originalBlockNumber = await this.provider.getBlockNumber();
        const providerConfig = {
            ..._providerConfig,
            blockNumber: (_b = _providerConfig === null || _providerConfig === void 0 ? void 0 : _providerConfig.blockNumber) !== null && _b !== void 0 ? _b : originalBlockNumber + baseBlockOffset,
        };
        const inputs = _(routes)
            .flatMap((route) => {
            const encodedRoute = route.protocol === Protocol.V3
                ? encodeRouteToPath(route, functionName == 'quoteExactOutput' // For exactOut must be true to ensure the routes are reversed.
                )
                : encodeMixedRouteToPath(route instanceof V2Route
                    ? new MixedRouteSDK(route.pairs, route.input, route.output)
                    : route);
            const routeInputs = amounts.map((amount) => [
                encodedRoute,
                `0x${amount.quotient.toString(16)}`,
            ]);
            return routeInputs;
        })
            .value();
        const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk));
        const inputsChunked = _.chunk(inputs, normalizedChunk);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let quoteStates = _.map(inputsChunked, (inputChunk) => {
            return {
                status: 'pending',
                inputs: inputChunk,
            };
        });
        log.info(`About to get ${inputs.length} quotes in chunks of ${normalizedChunk} [${_.map(inputsChunked, (i) => i.length).join(',')}] ${gasLimitOverride
            ? `with a gas limit override of ${gasLimitOverride}`
            : ''} and block number: ${await providerConfig.blockNumber} [Original before offset: ${originalBlockNumber}].`);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBatchSize`, inputs.length, MetricLoggerUnit.Count);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBatchSize_${ID_TO_NETWORK_NAME(this.chainId)}`, inputs.length, MetricLoggerUnit.Count);
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
        const { results: quoteResults, blockNumber, approxGasUsedPerSuccessCall, } = await retry(async (_bail, attemptNumber) => {
            haveIncrementedBlockHeaderFailureCounter = false;
            finalAttemptNumber = attemptNumber;
            const [success, failed, pending] = this.partitionQuotes(quoteStates);
            log.info(`Starting attempt: ${attemptNumber}.
          Currently ${success.length} success, ${failed.length} failed, ${pending.length} pending.
          Gas limit override: ${gasLimitOverride} Block number override: ${providerConfig.blockNumber}.`);
            quoteStates = await Promise.all(_.map(quoteStates, async (quoteState, idx) => {
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
                            ? IMixedRouteQuoterV1__factory.createInterface()
                            : IQuoterV2__factory.createInterface(),
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
            const reasonForFailureStr = _.map(failedQuoteStates, (failedQuoteState) => failedQuoteState.reason.name).join(', ');
            if (failedQuoteStates.length > 0) {
                log.info(`On attempt ${attemptNumber}: ${failedQuoteStates.length}/${quoteStates.length} quotes failed. Reasons: ${reasonForFailureStr}`);
                for (const failedQuoteState of failedQuoteStates) {
                    const { reason: error } = failedQuoteState;
                    log.info({ error }, `[QuoteFetchError] Attempt ${attemptNumber}. ${error.message}`);
                    if (error instanceof BlockConflictError) {
                        if (!haveRetriedForBlockConflictError) {
                            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBlockConflictErrorRetry`, 1, MetricLoggerUnit.Count);
                            haveRetriedForBlockConflictError = true;
                        }
                        retryAll = true;
                    }
                    else if (error instanceof ProviderBlockHeaderError) {
                        if (!haveRetriedForBlockHeader) {
                            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteBlockHeaderNotFoundRetry`, 1, MetricLoggerUnit.Count);
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
                                log.info(`Attempt ${attemptNumber}. Have failed due to block header ${blockHeaderRetryAttemptNumber - 1} times. Rolling back block number by ${rollbackBlockOffset} for next retry`);
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
                            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteTimeoutRetry`, 1, MetricLoggerUnit.Count);
                            haveRetriedForTimeout = true;
                        }
                    }
                    else if (error instanceof ProviderGasError) {
                        if (!haveRetriedForOutOfGas) {
                            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteOutOfGasExceptionRetry`, 1, MetricLoggerUnit.Count);
                            haveRetriedForOutOfGas = true;
                        }
                        gasLimitOverride = this.gasErrorFailureOverride.gasLimitOverride;
                        multicallChunk = this.gasErrorFailureOverride.multicallChunk;
                        retryAll = true;
                    }
                    else if (error instanceof SuccessRateError) {
                        if (!haveRetriedForSuccessRate) {
                            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteSuccessRateRetry`, 1, MetricLoggerUnit.Count);
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
                            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteUnknownReasonRetry`, 1, MetricLoggerUnit.Count);
                            haveRetriedForUnknownReason = true;
                        }
                    }
                }
            }
            if (retryAll) {
                log.info(`Attempt ${attemptNumber}. Resetting all requests to pending for next attempt.`);
                const normalizedChunk = Math.ceil(inputs.length / Math.ceil(inputs.length / multicallChunk));
                const inputsChunked = _.chunk(inputs, normalizedChunk);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                quoteStates = _.map(inputsChunked, (inputChunk) => {
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
            const callResults = _.map(successfulQuoteStates, (quoteState) => quoteState.results);
            return {
                results: _.flatMap(callResults, (result) => result.results),
                blockNumber: BigNumber.from(callResults[0].blockNumber),
                approxGasUsedPerSuccessCall: stats.percentile(_.map(callResults, (result) => result.approxGasUsedPerSuccessCall), 100),
            };
        }, {
            retries: DEFAULT_BATCH_RETRIES,
            ...this.retryOptions,
        });
        const routesQuotes = this.processQuoteResults(quoteResults, routes, amounts, BigNumber.from(gasLimitOverride));
        const endTime = Date.now();
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteLatency`, endTime - startTime, MetricLoggerUnit.Milliseconds);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteApproxGasUsedPerSuccessfulCall`, approxGasUsedPerSuccessCall, MetricLoggerUnit.Count);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteNumRetryLoops`, finalAttemptNumber - 1, MetricLoggerUnit.Count);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteTotalCallsToProvider`, totalCallsMade, MetricLoggerUnit.Count);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteExpectedCallsToProvider`, expectedCallsMade, MetricLoggerUnit.Count);
        metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteNumRetriedCalls`, totalCallsMade - expectedCallsMade, MetricLoggerUnit.Count);
        const [successfulQuotes, failedQuotes] = _(routesQuotes)
            .flatMap((routeWithQuotes) => routeWithQuotes[1])
            .partition((quote) => quote.quote != null)
            .value();
        log.info(`Got ${successfulQuotes.length} successful quotes, ${failedQuotes.length} failed quotes. Took ${finalAttemptNumber - 1} attempt loops. Total calls made to provider: ${totalCallsMade}. Have retried for timeout: ${haveRetriedForTimeout}`);
        return {
            routesWithQuotes: routesQuotes,
            blockNumber,
        };
    }
    partitionQuotes(quoteStates) {
        const successfulQuoteStates = _.filter(quoteStates, (quoteState) => quoteState.status == 'success');
        const failedQuoteStates = _.filter(quoteStates, (quoteState) => quoteState.status == 'failed');
        const pendingQuoteStates = _.filter(quoteStates, (quoteState) => quoteState.status == 'pending');
        return [successfulQuoteStates, failedQuoteStates, pendingQuoteStates];
    }
    processQuoteResults(quoteResults, routes, amounts, gasLimit) {
        const routesQuotes = [];
        const quotesResultsByRoute = _.chunk(quoteResults, amounts.length);
        const debugFailedQuotes = [];
        for (let i = 0; i < quotesResultsByRoute.length; i++) {
            const route = routes[i];
            const quoteResults = quotesResultsByRoute[i];
            const quotes = _.map(quoteResults, (quoteResult, index) => {
                var _a;
                const amount = amounts[index];
                if (!quoteResult.success) {
                    const percent = (100 / amounts.length) * (index + 1);
                    const amountStr = amount.toFixed(Math.min(amount.currency.decimals, 2));
                    const routeStr = routeToString(route);
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
        _.forEach(_.chunk(debugFailedQuotes, debugChunk), (quotes, idx) => {
            const failedQuotesByRoute = _.groupBy(quotes, (q) => q.route);
            const failedFlat = _.mapValues(failedQuotesByRoute, (f) => _(f)
                .map((f) => `${f.percent}%[${f.amount}]`)
                .join(','));
            log.info({
                failedQuotes: _.map(failedFlat, (amounts, routeStr) => `${routeStr} : ${amounts}`),
            }, `Failed on chain quotes for routes Part ${idx}/${Math.ceil(debugFailedQuotes.length / debugChunk)}`);
        });
        return routesQuotes;
    }
    validateBlockNumbers(successfulQuoteStates, totalCalls, gasLimitOverride) {
        if (successfulQuoteStates.length <= 1) {
            return null;
        }
        const results = _.map(successfulQuoteStates, (quoteState) => quoteState.results);
        const blockNumbers = _.map(results, (result) => result.blockNumber);
        const uniqBlocks = _(blockNumbers)
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
                log.info(`Quote success rate still below threshold despite retry. Continuing. ${quoteMinSuccessRate}: ${successRate}`);
                metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteRetriedSuccessRateLow`, successRate, MetricLoggerUnit.Percent);
                return;
            }
            metric.putMetric(`${this.metricsPrefix(this.chainId, useMixedRouteQuoter, optimisticCachedRoutes)}QuoteSuccessRateLow`, successRate, MetricLoggerUnit.Percent);
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
        if (routes.some((route) => route.protocol === Protocol.V3) &&
            useMixedRouteQuoter) {
            throw new Error(`Cannot use mixed route quoter with V3 routes`);
        }
        /// We cannot call quoteExactOutput with V2 or Mixed routes
        if (functionName === 'quoteExactOutput' && useMixedRouteQuoter) {
            throw new Error('Cannot call quoteExactOutput with V2 or Mixed routes');
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib24tY2hhaW4tcXVvdGUtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL29uLWNoYWluLXF1b3RlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVyRCxPQUFPLEVBQ0wsc0JBQXNCLEVBQ3RCLGFBQWEsRUFDYixRQUFRLEVBQ1QsTUFBTSw4QkFBOEIsQ0FBQztBQUV0QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEtBQWtDLE1BQU0sYUFBYSxDQUFDO0FBQzdELE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUN2QixPQUFPLEtBQUssTUFBTSxZQUFZLENBQUM7QUFFL0IsT0FBTyxFQUFjLE9BQU8sRUFBVyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pFLE9BQU8sRUFDTCw0QkFBNEIsRUFDN0IsTUFBTSx1REFBdUQsQ0FBQztBQUMvRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3ZFLE9BQU8sRUFDTCwrQkFBK0IsRUFDL0IsdUJBQXVCLEVBQ3hCLE1BQU0sbUJBQW1CLENBQUM7QUFFM0IsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQ0wsNEJBQTRCLEVBQzVCLHNDQUFzQyxFQUN2QyxNQUFNLHFDQUFxQyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQW1DL0MsTUFBTSxPQUFPLGtCQUFtQixTQUFRLEtBQUs7SUFBN0M7O1FBQ1MsU0FBSSxHQUFHLG9CQUFvQixDQUFDO0lBQ3JDLENBQUM7Q0FBQTtBQUVELE1BQU0sT0FBTyxn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