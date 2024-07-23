import { Fraction } from '@miljan9602/dswap-sdk-core';
import { CurrencyAmount } from '../../../util/amounts';
export declare function calculateRatioAmountIn(optimalRatio: Fraction, inputTokenPrice: Fraction, inputBalance: CurrencyAmount, outputBalance: CurrencyAmount): CurrencyAmount;
