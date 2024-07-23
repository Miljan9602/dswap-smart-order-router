import http from 'http';
import https from 'https';
import { MaxUint256 } from '@ethersproject/constants';
import { PERMIT2_ADDRESS } from '@miljan9602/dswap-permit2-sdk';
import { ChainId } from '@miljan9602/dswap-sdk-core';
import { UNIVERSAL_ROUTER_ADDRESS } from '@miljan9602/dswap-universal-router-sdk';
import axios from 'axios';
import { BigNumber } from 'ethers/lib/ethers';
import { metric, MetricLoggerUnit, SwapType } from '../routers';
import { Erc20__factory } from '../types/other/factories/Erc20__factory';
import { Permit2__factory } from '../types/other/factories/Permit2__factory';
import { BEACON_CHAIN_DEPOSIT_ADDRESS, log, MAX_UINT160, SWAP_ROUTER_02_ADDRESSES } from '../util';
import { APPROVE_TOKEN_FOR_TRANSFER } from '../util/callData';
import { calculateGasUsed, initSwapRouteFromExisting } from '../util/gas-factory-helpers';
import { SimulationStatus, Simulator } from './simulation-provider';
var TenderlySimulationType;
(function (TenderlySimulationType) {
    TenderlySimulationType["QUICK"] = "quick";
    TenderlySimulationType["FULL"] = "full";
    TenderlySimulationType["ABI"] = "abi";
})(TenderlySimulationType || (TenderlySimulationType = {}));
const TENDERLY_BATCH_SIMULATE_API = (tenderlyBaseUrl, tenderlyUser, tenderlyProject) => `${tenderlyBaseUrl}/api/v1/account/${tenderlyUser}/project/${tenderlyProject}/simulate-batch`;
const TENDERLY_NODE_API = (chainId, tenderlyNodeApiKey) => {
    switch (chainId) {
        case ChainId.MAINNET:
            return `https://mainnet.gateway.tenderly.co/${tenderlyNodeApiKey}`;
        default:
            throw new Error(`ChainId ${chainId} does not correspond to a tenderly node endpoint`);
    }
};
export const TENDERLY_NOT_SUPPORTED_CHAINS = [
    ChainId.CELO,
    ChainId.CELO_ALFAJORES,
];
// We multiply tenderly gas limit by this to overestimate gas limit
const DEFAULT_ESTIMATE_MULTIPLIER = 1.3;
export class FallbackTenderlySimulator extends Simulator {
    constructor(chainId, provider, portionProvider, tenderlySimulator, ethEstimateGasSimulator) {
        super(provider, portionProvider, chainId);
        this.tenderlySimulator = tenderlySimulator;
        this.ethEstimateGasSimulator = ethEstimateGasSimulator;
    }
    async simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig) {
        // Make call to eth estimate gas if possible
        // For erc20s, we must check if the token allowance is sufficient
        const inputAmount = swapRoute.trade.inputAmount;
        if ((inputAmount.currency.isNative && this.chainId == ChainId.MAINNET) ||
            (await this.checkTokenApproved(fromAddress, inputAmount, swapOptions, this.provider))) {
            log.info('Simulating with eth_estimateGas since token is native or approved.');
            try {
                const swapRouteWithGasEstimate = await this.ethEstimateGasSimulator.ethEstimateGas(fromAddress, swapOptions, swapRoute, providerConfig);
                return swapRouteWithGasEstimate;
            }
            catch (err) {
                log.info({ err: err }, 'Error simulating using eth_estimateGas');
                return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
            }
        }
        try {
            return await this.tenderlySimulator.simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig);
        }
        catch (err) {
            log.error({ err: err }, 'Failed to simulate via Tenderly');
            if (err instanceof Error && err.message.includes('timeout')) {
                metric.putMetric('TenderlySimulationTimeouts', 1, MetricLoggerUnit.Count);
            }
            return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
        }
    }
}
export class TenderlySimulator extends Simulator {
    constructor(chainId, tenderlyBaseUrl, tenderlyUser, tenderlyProject, tenderlyAccessKey, tenderlyNodeApiKey, v2PoolProvider, v3PoolProvider, provider, portionProvider, overrideEstimateMultiplier, tenderlyRequestTimeout, tenderlyNodeApiSamplingPercent, tenderlyNodeApiEnabledChains) {
        super(provider, portionProvider, chainId);
        this.tenderlyNodeApiEnabledChains = [];
        this.tenderlyServiceInstance = axios.create({
            // keep connections alive,
            // maxSockets default is Infinity, so Infinity is read as 50 sockets
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
        });
        this.tenderlyBaseUrl = tenderlyBaseUrl;
        this.tenderlyUser = tenderlyUser;
        this.tenderlyProject = tenderlyProject;
        this.tenderlyAccessKey = tenderlyAccessKey;
        this.tenderlyNodeApiKey = tenderlyNodeApiKey;
        this.v2PoolProvider = v2PoolProvider;
        this.v3PoolProvider = v3PoolProvider;
        this.overrideEstimateMultiplier = overrideEstimateMultiplier !== null && overrideEstimateMultiplier !== void 0 ? overrideEstimateMultiplier : {};
        this.tenderlyRequestTimeout = tenderlyRequestTimeout;
        this.tenderlyNodeApiSamplingPercent = tenderlyNodeApiSamplingPercent;
        this.tenderlyNodeApiEnabledChains = tenderlyNodeApiEnabledChains;
    }
    async simulateTransaction(fromAddress, swapOptions, swapRoute, providerConfig) {
        var _a;
        const currencyIn = swapRoute.trade.inputAmount.currency;
        const tokenIn = currencyIn.wrapped;
        const chainId = this.chainId;
        if (TENDERLY_NOT_SUPPORTED_CHAINS.includes(chainId)) {
            const msg = `${TENDERLY_NOT_SUPPORTED_CHAINS.toString()} not supported by Tenderly!`;
            log.info(msg);
            return { ...swapRoute, simulationStatus: SimulationStatus.NotSupported };
        }
        if (!swapRoute.methodParameters) {
            const msg = 'No calldata provided to simulate transaction';
            log.info(msg);
            throw new Error(msg);
        }
        const { calldata } = swapRoute.methodParameters;
        log.info({
            calldata: swapRoute.methodParameters.calldata,
            fromAddress: fromAddress,
            chainId: chainId,
            tokenInAddress: tokenIn.address,
            router: swapOptions.type,
        }, 'Simulating transaction on Tenderly');
        const blockNumber = await (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber);
        let estimatedGasUsed;
        const estimateMultiplier = (_a = this.overrideEstimateMultiplier[chainId]) !== null && _a !== void 0 ? _a : DEFAULT_ESTIMATE_MULTIPLIER;
        if (swapOptions.type == SwapType.UNIVERSAL_ROUTER) {
            // simulating from beacon chain deposit address that should always hold **enough balance**
            if (currencyIn.isNative && this.chainId == ChainId.MAINNET) {
                fromAddress = BEACON_CHAIN_DEPOSIT_ADDRESS;
            }
            // Do initial onboarding approval of Permit2.
            const erc20Interface = Erc20__factory.createInterface();
            const approvePermit2Calldata = erc20Interface.encodeFunctionData('approve', [PERMIT2_ADDRESS, MaxUint256]);
            // We are unsure if the users calldata contains a permit or not. We just
            // max approve the Universal Router from Permit2 instead, which will cover both cases.
            const permit2Interface = Permit2__factory.createInterface();
            const approveUniversalRouterCallData = permit2Interface.encodeFunctionData('approve', [
                tokenIn.address,
                UNIVERSAL_ROUTER_ADDRESS(this.chainId),
                MAX_UINT160,
                Math.floor(new Date().getTime() / 1000) + 10000000,
            ]);
            const approvePermit2 = {
                network_id: chainId,
                estimate_gas: true,
                input: approvePermit2Calldata,
                to: tokenIn.address,
                value: '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
                save_if_fails: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.saveTenderlySimulationIfFailed,
            };
            const approveUniversalRouter = {
                network_id: chainId,
                estimate_gas: true,
                input: approveUniversalRouterCallData,
                to: PERMIT2_ADDRESS,
                value: '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
                save_if_fails: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.saveTenderlySimulationIfFailed,
            };
            const swap = {
                network_id: chainId,
                input: calldata,
                estimate_gas: true,
                to: UNIVERSAL_ROUTER_ADDRESS(this.chainId),
                value: currencyIn.isNative ? swapRoute.methodParameters.value : '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
                save_if_fails: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.saveTenderlySimulationIfFailed,
            };
            const body = {
                simulations: [approvePermit2, approveUniversalRouter, swap],
                estimate_gas: true,
            };
            const opts = {
                headers: {
                    'X-Access-Key': this.tenderlyAccessKey,
                },
                timeout: this.tenderlyRequestTimeout,
            };
            const url = TENDERLY_BATCH_SIMULATE_API(this.tenderlyBaseUrl, this.tenderlyUser, this.tenderlyProject);
            metric.putMetric('TenderlySimulationUniversalRouterRequests', 1, MetricLoggerUnit.Count);
            const before = Date.now();
            const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance
                .post(url, body, opts)
                .finally(() => {
                metric.putMetric('TenderlySimulationLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
            });
            // fire tenderly node endpoint sampling and forget
            this.sampleNodeEndpoint(approvePermit2, approveUniversalRouter, swap, body, resp);
            const latencies = Date.now() - before;
            log.info(`Tenderly simulation universal router request body: ${JSON.stringify(body, null, 2)} with result ${JSON.stringify(resp, null, 2)}, having latencies ${latencies} in milliseconds.`);
            metric.putMetric('TenderlySimulationUniversalRouterLatencies', Date.now() - before, MetricLoggerUnit.Milliseconds);
            metric.putMetric(`TenderlySimulationUniversalRouterResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
            // Validate tenderly response body
            if (!resp ||
                resp.simulation_results.length < 3 ||
                !resp.simulation_results[2].transaction ||
                resp.simulation_results[2].transaction.error_message) {
                this.logTenderlyErrorResponse(resp);
                return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
            }
            // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
            estimatedGasUsed = BigNumber.from((resp.simulation_results[2].transaction.gas * estimateMultiplier).toFixed(0));
            log.info({
                body,
                approvePermit2GasUsed: resp.simulation_results[0].transaction.gas_used,
                approveUniversalRouterGasUsed: resp.simulation_results[1].transaction.gas_used,
                swapGasUsed: resp.simulation_results[2].transaction.gas_used,
                approvePermit2Gas: resp.simulation_results[0].transaction.gas,
                approveUniversalRouterGas: resp.simulation_results[1].transaction.gas,
                swapGas: resp.simulation_results[2].transaction.gas,
                swapWithMultiplier: estimatedGasUsed.toString(),
            }, 'Successfully Simulated Approvals + Swap via Tenderly for Universal Router. Gas used.');
            log.info({
                body,
                swapSimulation: resp.simulation_results[2].simulation,
                swapTransaction: resp.simulation_results[2].transaction,
            }, 'Successful Tenderly Swap Simulation for Universal Router');
        }
        else if (swapOptions.type == SwapType.SWAP_ROUTER_02) {
            const approve = {
                network_id: chainId,
                input: APPROVE_TOKEN_FOR_TRANSFER,
                estimate_gas: true,
                to: tokenIn.address,
                value: '0',
                from: fromAddress,
                simulation_type: TenderlySimulationType.QUICK,
            };
            const swap = {
                network_id: chainId,
                input: calldata,
                to: SWAP_ROUTER_02_ADDRESSES(chainId),
                estimate_gas: true,
                value: currencyIn.isNative ? swapRoute.methodParameters.value : '0',
                from: fromAddress,
                block_number: blockNumber,
                simulation_type: TenderlySimulationType.QUICK,
            };
            const body = { simulations: [approve, swap] };
            const opts = {
                headers: {
                    'X-Access-Key': this.tenderlyAccessKey,
                },
                timeout: this.tenderlyRequestTimeout,
            };
            const url = TENDERLY_BATCH_SIMULATE_API(this.tenderlyBaseUrl, this.tenderlyUser, this.tenderlyProject);
            metric.putMetric('TenderlySimulationSwapRouter02Requests', 1, MetricLoggerUnit.Count);
            const before = Date.now();
            const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance.post(url, body, opts);
            metric.putMetric(`TenderlySimulationSwapRouter02ResponseStatus${httpStatus}`, 1, MetricLoggerUnit.Count);
            const latencies = Date.now() - before;
            log.info(`Tenderly simulation swap router02 request body: ${body}, having latencies ${latencies} in milliseconds.`);
            metric.putMetric('TenderlySimulationSwapRouter02Latencies', latencies, MetricLoggerUnit.Milliseconds);
            // Validate tenderly response body
            if (!resp ||
                resp.simulation_results.length < 2 ||
                !resp.simulation_results[1].transaction ||
                resp.simulation_results[1].transaction.error_message) {
                const msg = `Failed to Simulate Via Tenderly!: ${resp.simulation_results[1].transaction.error_message}`;
                log.info({ err: resp.simulation_results[1].transaction.error_message }, msg);
                return { ...swapRoute, simulationStatus: SimulationStatus.Failed };
            }
            // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
            estimatedGasUsed = BigNumber.from((resp.simulation_results[1].transaction.gas * estimateMultiplier).toFixed(0));
            log.info({
                body,
                approveGasUsed: resp.simulation_results[0].transaction.gas_used,
                swapGasUsed: resp.simulation_results[1].transaction.gas_used,
                approveGas: resp.simulation_results[0].transaction.gas,
                swapGas: resp.simulation_results[1].transaction.gas,
                swapWithMultiplier: estimatedGasUsed.toString(),
            }, 'Successfully Simulated Approval + Swap via Tenderly for SwapRouter02. Gas used.');
            log.info({
                body,
                swapTransaction: resp.simulation_results[1].transaction,
                swapSimulation: resp.simulation_results[1].simulation,
            }, 'Successful Tenderly Swap Simulation for SwapRouter02');
        }
        else {
            throw new Error(`Unsupported swap type: ${swapOptions}`);
        }
        const { estimatedGasUsedUSD, estimatedGasUsedQuoteToken, estimatedGasUsedGasToken, quoteGasAdjusted, } = await calculateGasUsed(chainId, swapRoute, estimatedGasUsed, this.v2PoolProvider, this.v3PoolProvider, this.provider, providerConfig);
        return {
            ...initSwapRouteFromExisting(swapRoute, this.v2PoolProvider, this.v3PoolProvider, this.portionProvider, quoteGasAdjusted, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, swapOptions, estimatedGasUsedGasToken),
            simulationStatus: SimulationStatus.Succeeded,
        };
    }
    logTenderlyErrorResponse(resp) {
        log.info({
            resp,
        }, 'Failed to Simulate on Tenderly');
        log.info({
            err: resp.simulation_results.length >= 1
                ? resp.simulation_results[0].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #1 Transaction');
        log.info({
            err: resp.simulation_results.length >= 1
                ? resp.simulation_results[0].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #1 Simulation');
        log.info({
            err: resp.simulation_results.length >= 2
                ? resp.simulation_results[1].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #2 Transaction');
        log.info({
            err: resp.simulation_results.length >= 2
                ? resp.simulation_results[1].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #2 Simulation');
        log.info({
            err: resp.simulation_results.length >= 3
                ? resp.simulation_results[2].transaction
                : {},
        }, 'Failed to Simulate on Tenderly #3 Transaction');
        log.info({
            err: resp.simulation_results.length >= 3
                ? resp.simulation_results[2].simulation
                : {},
        }, 'Failed to Simulate on Tenderly #3 Simulation');
    }
    async sampleNodeEndpoint(approvePermit2, approveUniversalRouter, swap, gatewayReq, gatewayResp) {
        var _a, _b;
        if (Math.random() * 100 < ((_a = this.tenderlyNodeApiSamplingPercent) !== null && _a !== void 0 ? _a : 0) &&
            ((_b = this.tenderlyNodeApiEnabledChains) !== null && _b !== void 0 ? _b : []).find((chainId) => chainId === this.chainId)) {
            const nodeEndpoint = TENDERLY_NODE_API(this.chainId, this.tenderlyNodeApiKey);
            const blockNumber = swap.block_number
                ? BigNumber.from(swap.block_number).toHexString().replace('0x0', '0x')
                : 'latest';
            const body = {
                id: 1,
                jsonrpc: '2.0',
                method: 'tenderly_estimateGasBundle',
                params: [
                    [
                        {
                            from: approvePermit2.from,
                            to: approvePermit2.to,
                            data: approvePermit2.input,
                        },
                        {
                            from: approveUniversalRouter.from,
                            to: approveUniversalRouter.to,
                            data: approveUniversalRouter.input,
                        },
                        { from: swap.from, to: swap.to, data: swap.input },
                    ],
                    blockNumber,
                ],
            };
            log.info(`About to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}.`);
            const before = Date.now();
            try {
                // For now, we don't timeout tenderly node endpoint, but we should before we live switch to node endpoint
                const { data: resp, status: httpStatus } = await this.tenderlyServiceInstance.post(nodeEndpoint, body);
                const latencies = Date.now() - before;
                metric.putMetric('TenderlyNodeGasEstimateBundleLatencies', latencies, MetricLoggerUnit.Milliseconds);
                metric.putMetric('TenderlyNodeGasEstimateBundleSuccess', 1, MetricLoggerUnit.Count);
                log.info(`Tenderly estimate gas bundle request body: ${JSON.stringify(body, null, 2)} with http status ${httpStatus} result ${JSON.stringify(resp, null, 2)}, having latencies ${latencies} in milliseconds.`);
                if (httpStatus !== 200) {
                    log.error(`Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}. HTTP Status: ${httpStatus}`, { resp });
                    return;
                }
                if (gatewayResp.simulation_results.length !== resp.result.length) {
                    metric.putMetric('TenderlyNodeGasEstimateBundleLengthMismatch', 1, MetricLoggerUnit.Count);
                    return;
                }
                let gasEstimateMismatch = false;
                for (let i = 0; i <
                    Math.min(gatewayResp.simulation_results.length, resp.result.length); i++) {
                    const singleNodeResp = resp.result[i];
                    const singleGatewayResp = gatewayResp.simulation_results[i];
                    if (singleNodeResp.gas &&
                        singleNodeResp.gasUsed) {
                        const gatewayGas = singleGatewayResp === null || singleGatewayResp === void 0 ? void 0 : singleGatewayResp.transaction.gas;
                        const nodeGas = Number(singleNodeResp.gas);
                        const gatewayGasUsed = singleGatewayResp === null || singleGatewayResp === void 0 ? void 0 : singleGatewayResp.transaction.gas_used;
                        const nodeGasUsed = Number(singleNodeResp.gasUsed);
                        if (gatewayGas !== nodeGas) {
                            log.error(`Gateway gas and node gas estimates do not match for index ${i}`, { gatewayGas, nodeGas, blockNumber });
                            metric.putMetric(`TenderlyNodeGasEstimateBundleGasMismatch${i}`, 1, MetricLoggerUnit.Count);
                            gasEstimateMismatch = true;
                        }
                        if (gatewayGasUsed !== nodeGasUsed) {
                            log.error(`Gateway gas and node gas used estimates do not match for index ${i}`, { gatewayGas, nodeGas, blockNumber });
                            metric.putMetric(`TenderlyNodeGasEstimateBundleGasUsedMismatch${i}`, 1, MetricLoggerUnit.Count);
                            gasEstimateMismatch = true;
                        }
                    }
                    else if (singleNodeResp.error) {
                        if (!(singleGatewayResp === null || singleGatewayResp === void 0 ? void 0 : singleGatewayResp.transaction.error_message)) {
                            log.error(`Gateway and node error messages do not match for index ${i}`, { blockNumber });
                            metric.putMetric(`TenderlyNodeGasEstimateBundleErrorMismatch${i}`, 1, MetricLoggerUnit.Count);
                            gasEstimateMismatch = true;
                        }
                    }
                }
                if (!gasEstimateMismatch) {
                    metric.putMetric('TenderlyNodeGasEstimateBundleMatch', 1, MetricLoggerUnit.Count);
                }
                else {
                    log.error(`Gateway gas and node gas estimates do not match
              gateway request body ${JSON.stringify(gatewayReq, null, 2)}
              node request body ${JSON.stringify(body, null, 2)}`);
                }
            }
            catch (err) {
                log.error({ err }, `Failed to invoke Tenderly Node Endpoint for gas estimation bundle ${JSON.stringify(body, null, 2)}. Error: ${err}`);
                metric.putMetric('TenderlyNodeGasEstimateBundleFailure', 1, MetricLoggerUnit.Count);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3JELE9BQU8sRUFDTCx3QkFBd0IsRUFDekIsTUFBTSx3Q0FBd0MsQ0FBQztBQUNoRCxPQUFPLEtBQTZCLE1BQU0sT0FBTyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUU5QyxPQUFPLEVBRUwsTUFBTSxFQUNOLGdCQUFnQixFQUdoQixRQUFRLEVBQ1QsTUFBTSxZQUFZLENBQUM7QUFDcEIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzdFLE9BQU8sRUFDTCw0QkFBNEIsRUFDNUIsR0FBRyxFQUNILFdBQVcsRUFDWCx3QkFBd0IsRUFDekIsTUFBTSxTQUFTLENBQUM7QUFDakIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUQsT0FBTyxFQUNMLGdCQUFnQixFQUNoQix5QkFBeUIsRUFDMUIsTUFBTSw2QkFBNkIsQ0FBQztBQUlyQyxPQUFPLEVBRUwsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVixNQUFNLHVCQUF1QixDQUFDO0FBMEMvQixJQUFLLHNCQUlKO0FBSkQsV0FBSyxzQkFBc0I7SUFD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