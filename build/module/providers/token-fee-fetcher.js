import { BigNumber } from '@ethersproject/bignumber';
import { ChainId } from '@miljan9602/dswap-sdk-core';
import { TokenFeeDetector__factory } from '../types/other/factories/TokenFeeDetector__factory';
import { log, metric, MetricLoggerUnit, WRAPPED_NATIVE_CURRENCY } from '../util';
const DEFAULT_TOKEN_BUY_FEE_BPS = BigNumber.from(0);
const DEFAULT_TOKEN_SELL_FEE_BPS = BigNumber.from(0);
// on detector failure, assume no fee
export const DEFAULT_TOKEN_FEE_RESULT = {
    buyFeeBps: DEFAULT_TOKEN_BUY_FEE_BPS,
    sellFeeBps: DEFAULT_TOKEN_SELL_FEE_BPS,
};
// address at which the FeeDetector lens is deployed
const FEE_DETECTOR_ADDRESS = (chainId) => {
    switch (chainId) {
        case ChainId.MAINNET:
            return '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f';
        case ChainId.OPTIMISM:
            return '0xa7c17505B43955A474fb6AFE61E093907a7567c9';
        case ChainId.BNB:
            return '0x331f6D0AAB4A1F039f0d75A613a7F1593DbDE1BB';
        case ChainId.POLYGON:
            return '0x92bCCCb6c8c199AAcA38408621E38Ab6dBfA00B5';
        case ChainId.BASE:
            return '0x331f6D0AAB4A1F039f0d75A613a7F1593DbDE1BB';
        case ChainId.ARBITRUM_ONE:
            return '0x64CF365CC5CCf5E64380bc05Acd5df7D0618c118';
        case ChainId.CELO:
            return '0x3dfF0145E68a5880EAbE8F56b6Bc30C4AdCF3413';
        case ChainId.AVALANCHE:
            return '0xBF2B9F6A6eCc4541b31ab2dCF8156D33644Ca3F3';
        default:
            // just default to mainnet contract
            return '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f';
    }
};
// Amount has to be big enough to avoid rounding errors, but small enough that
// most v2 pools will have at least this many token units
// 100000 is the smallest number that avoids rounding errors in bps terms
// 10000 was not sufficient due to rounding errors for rebase token (e.g. stETH)
const AMOUNT_TO_FLASH_BORROW = '100000';
// 1M gas limit per validate call, should cover most swap cases
const GAS_LIMIT_PER_VALIDATE = 1000000;
export class OnChainTokenFeeFetcher {
    constructor(chainId, rpcProvider, tokenFeeAddress = FEE_DETECTOR_ADDRESS(chainId), gasLimitPerCall = GAS_LIMIT_PER_VALIDATE, amountToFlashBorrow = AMOUNT_TO_FLASH_BORROW) {
        var _a;
        this.chainId = chainId;
        this.tokenFeeAddress = tokenFeeAddress;
        this.gasLimitPerCall = gasLimitPerCall;
        this.amountToFlashBorrow = amountToFlashBorrow;
        this.BASE_TOKEN = (_a = WRAPPED_NATIVE_CURRENCY[this.chainId]) === null || _a === void 0 ? void 0 : _a.address;
        this.contract = TokenFeeDetector__factory.connect(this.tokenFeeAddress, rpcProvider);
    }
    async fetchFees(addresses, providerConfig) {
        const tokenToResult = {};
        const addressesWithoutBaseToken = addresses.filter((address) => address.toLowerCase() !== this.BASE_TOKEN.toLowerCase());
        const functionParams = addressesWithoutBaseToken.map((address) => [
            address,
            this.BASE_TOKEN,
            this.amountToFlashBorrow,
        ]);
        const results = await Promise.all(functionParams.map(async ([address, baseToken, amountToBorrow]) => {
            try {
                // We use the validate function instead of batchValidate to avoid poison pill problem.
                // One token that consumes too much gas could cause the entire batch to fail.
                const feeResult = await this.contract.callStatic.validate(address, baseToken, amountToBorrow, {
                    gasLimit: this.gasLimitPerCall,
                    blockTag: providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber,
                });
                metric.putMetric('TokenFeeFetcherFetchFeesSuccess', 1, MetricLoggerUnit.Count);
                return { address, ...feeResult };
            }
            catch (err) {
                log.error({ err }, `Error calling validate on-chain for token ${address}`);
                metric.putMetric('TokenFeeFetcherFetchFeesFailure', 1, MetricLoggerUnit.Count);
                // in case of FOT token fee fetch failure, we return null
                // so that they won't get returned from the token-fee-fetcher
                // and thus no fee will be applied, and the cache won't cache on FOT tokens with failed fee fetching
                return { address, buyFeeBps: undefined, sellFeeBps: undefined };
            }
        }));
        results.forEach(({ address, buyFeeBps, sellFeeBps }) => {
            if (buyFeeBps || sellFeeBps) {
                tokenToResult[address] = { buyFeeBps, sellFeeBps };
            }
        });
        return tokenToResult;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tZmVlLWZldGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rva2VuLWZlZS1mZXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVyRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFHckQsT0FBTyxFQUNMLHlCQUF5QixFQUMxQixNQUFNLG9EQUFvRCxDQUFDO0FBQzVELE9BQU8sRUFDTCxHQUFHLEVBQ0gsTUFBTSxFQUNOLGdCQUFnQixFQUNoQix1QkFBdUIsRUFDeEIsTUFBTSxTQUFTLENBQUM7QUFJakIsTUFBTSx5QkFBeUIsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sMEJBQTBCLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVyRCxxQ0FBcUM7QUFDckMsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUc7SUFDdEMsU0FBUyxFQUFFLHlCQUF5QjtJQUNwQyxVQUFVLEVBQUUsMEJBQTBCO0NBQ3ZDLENBQUM7QUFVRixvREFBb0Q7QUFDcEQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtJQUNoRCxRQUFRLE9BQU8sRUFBRTtRQUNmLEtBQUssT0FBTyxDQUFDLE9BQU87WUFDbEIsT0FBTyw0Q0FBNEMsQ0FBQztRQUN0RCxLQUFLLE9BQU8sQ0FBQyxRQUFRO1lBQ25CLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxPQUFPLENBQUMsR0FBRztZQUNkLE9BQU8sNENBQTRDLENBQUM7UUFDdEQsS0FBSyxPQUFPLENBQUMsT0FBTztZQUNsQixPQUFPLDRDQUE0QyxDQUFDO1FBQ3RELEtBQUssT0FBTyxDQUFDLElBQUk7WUFDZixPQUFPLDRDQUE0QyxDQUFDO1FBQ3RELEtBQUssT0FB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