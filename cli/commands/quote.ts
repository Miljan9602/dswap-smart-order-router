import { Logger } from '@ethersproject/logger';
import { flags } from '@oclif/command';
import { Protocol } from '@miljan9602/dswap-router-sdk';
import {
  ChainId,
  Currency,
  Percent, Token,
  TradeType
} from '@miljan9602/dswap-sdk-core';
import dotenv from 'dotenv';
import _ from 'lodash';

import {MapWithLowerCaseKey, nativeOnChain, parseAmount, SwapRoute, SwapType, } from '../../src';
import { NATIVE_NAMES_BY_ID, TO_PROTOCOL } from '../../src/util';
import { BaseCommand } from '../base-command';
import { computePairAddress} from '@miljan9602/dswap-v2-sdk'

dotenv.config();

Logger.globalLogger();
Logger.setLogLevel(Logger.levels.DEBUG);

export class Quote extends BaseCommand {
  static description = 'Uniswap Smart Order Router CLI';

  static flags = {
    ...BaseCommand.flags,
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    tokenIn: flags.string({ char: 'i', required: true }),
    tokenOut: flags.string({ char: 'o', required: true }),
    recipient: flags.string({ required: false }),
    amount: flags.string({ char: 'a', required: true }),
    exactIn: flags.boolean({ required: false }),
    exactOut: flags.boolean({ required: false }),
    protocols: flags.string({ required: false }),
    forceCrossProtocol: flags.boolean({ required: false, default: false }),
    forceMixedRoutes: flags.boolean({
      required: false,
      default: false,
    }),
    simulate: flags.boolean({ required: false, default: false }),
    debugRouting: flags.boolean({ required: false, default: true }),
    enableFeeOnTransferFeeFetching: flags.boolean({ required: false, default: false }),
    requestBlockNumber: flags.integer({ required: false }),
    gasToken: flags.string({ required: false }),
    chainId: flags.integer({ required: false, default: ChainId.SEI_MAINNET }),
  };

  async run() {
    const { flags } = this.parse(Quote);
    const {
      tokenIn: tokenInStr,
      tokenOut: tokenOutStr,
      amount: amountStr,
      exactIn,
      exactOut,
      recipient,
      debug,
      topN,
      topNTokenInOut,
      topNSecondHop,
      topNSecondHopForTokenAddressRaw,
      topNWithEachBaseToken,
      topNWithBaseToken,
      topNWithBaseTokenInSet,
      topNDirectSwaps,
      maxSwapsPerPath,
      minSplits,
      maxSplits,
      distributionPercent,
      protocols: protocolsStr,
      forceCrossProtocol,
      forceMixedRoutes,
      simulate,
      debugRouting,
      enableFeeOnTransferFeeFetching,
      requestBlockNumber,
      gasToken,
      chainId
    } = flags;

    let factoryAddress = '0x5D370a6189F89603FaB67e9C68383e63F7B6A262'
    let tokenA = new Token(
      ChainId.SEI_MAINNET,
      '0x8B595a7B0CD41F3C0Dac80114f6A351274Be60e6',
      6,
      'dsUSDT',
      'DS Tether'
    )

    let tokenB = new Token(
      ChainId.SEI_MAINNET,
      '0xf4855a5Aaf42bf27163d8981B16bb0eF80620550',
      6,
      'dsUSDC',
      'DS USD Coin'
    )

    console.log({
      "computePairAddress" : computePairAddress({ factoryAddress, tokenA, tokenB })
    })

    const topNSecondHopForTokenAddress = new MapWithLowerCaseKey();
    topNSecondHopForTokenAddressRaw.split(',').forEach((entry) => {
      if (entry != '') {
        const entryParts = entry.split('|');
        if (entryParts.length != 2) {
          throw new Error(
            'flag --topNSecondHopForTokenAddressRaw must be in format tokenAddress|topN,...');
        }
        const topNForTokenAddress: number = Number(entryParts[1]!);
        topNSecondHopForTokenAddress.set(entryParts[0]!, topNForTokenAddress);
      }
    });

    if ((exactIn && exactOut) || (!exactIn && !exactOut)) {
      throw new Error('Must set either --exactIn or --exactOut.');
    }

    let protocols: Protocol[] = [];
    if (protocolsStr) {
      try {
        protocols = _.map(protocolsStr.split(','), (protocolStr) =>
          TO_PROTOCOL(protocolStr)
        );
      } catch (err) {
        throw new Error(
          `Protocols invalid. Valid options: ${Object.values(Protocol)}`
        );
      }
    }

    const log = this.logger;
    const tokenProvider = this.tokenProvider;
    const router = this.router;

    // if the tokenIn str is 'ETH' or 'MATIC' or in NATIVE_NAMES_BY_ID
    const tokenIn: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(tokenInStr)
      ? nativeOnChain(chainId)
      : (await tokenProvider.getTokens([tokenInStr])).getTokenByAddress(
        tokenInStr
      )!;

    const tokenOut: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(
      tokenOutStr
    )
      ? nativeOnChain(chainId)
      : (await tokenProvider.getTokens([tokenOutStr])).getTokenByAddress(
        tokenOutStr
      )!;

    let swapRoutes: SwapRoute | null;
    if (exactIn) {
      const amountIn = parseAmount(amountStr, tokenIn);
      swapRoutes = await router.route(
        amountIn,
        tokenOut,
        TradeType.EXACT_INPUT,
        recipient
          ? {
            type: SwapType.SWAP_ROUTER_02,
            deadline: 10000000000000,
            recipient,
            slippageTolerance: new Percent(5, 100),
            simulate: simulate ? { fromAddress: recipient } : undefined,
          }
          : undefined,
        {
          blockNumber: requestBlockNumber ?? this.blockNumber,
          v3PoolSelection: {
            topN,
            topNTokenInOut,
            topNSecondHop,
            topNSecondHopForTokenAddress,
            topNWithEachBaseToken,
            topNWithBaseToken,
            topNWithBaseTokenInSet,
            topNDirectSwaps,
          },
          maxSwapsPerPath,
          minSplits,
          maxSplits,
          distributionPercent,
          protocols,
          forceCrossProtocol,
          forceMixedRoutes,
          debugRouting,
          enableFeeOnTransferFeeFetching,
          gasToken
        }
      );
    } else {
      const amountOut = parseAmount(amountStr, tokenOut);
      swapRoutes = await router.route(
        amountOut,
        tokenIn,
        TradeType.EXACT_OUTPUT,
        recipient
          ? {
            type: SwapType.SWAP_ROUTER_02,
            deadline: 100,
            recipient,
            slippageTolerance: new Percent(5, 10_000),
          }
          : undefined,
        {
          blockNumber: this.blockNumber - 10,
          v3PoolSelection: {
            topN,
            topNTokenInOut,
            topNSecondHop,
            topNSecondHopForTokenAddress,
            topNWithEachBaseToken,
            topNWithBaseToken,
            topNWithBaseTokenInSet,
            topNDirectSwaps,
          },
          maxSwapsPerPath,
          minSplits,
          maxSplits,
          distributionPercent,
          protocols,
          forceCrossProtocol,
          forceMixedRoutes,
          debugRouting,
          enableFeeOnTransferFeeFetching,
          gasToken
        }
      );
    }

    if (!swapRoutes) {
      log.error(
        `Could not find route. ${
          debug ? '' : 'Run in debug mode for more info'
        }.`
      );
      return;
    }

    const {
      blockNumber,
      estimatedGasUsed,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      estimatedGasUsedGasToken,
      gasPriceWei,
      methodParameters,
      quote,
      quoteGasAdjusted,
      route: routeAmounts,
      simulationStatus,
    } = swapRoutes;

    this.logSwapResults(
      routeAmounts,
      quote,
      quoteGasAdjusted,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      estimatedGasUsedGasToken,
      methodParameters,
      blockNumber,
      estimatedGasUsed,
      gasPriceWei,
      simulationStatus
    );
  }
}
