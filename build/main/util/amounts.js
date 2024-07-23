"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparseFeeAmount = exports.parseFeeAmount = exports.parseAmount = exports.MAX_UINT160 = exports.CurrencyAmount = void 0;
const units_1 = require("@ethersproject/units");
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const dswap_v3_sdk_1 = require("@miljan9602/dswap-v3-sdk");
const jsbi_1 = __importDefault(require("jsbi"));
class CurrencyAmount extends dswap_sdk_core_1.CurrencyAmount {
}
exports.CurrencyAmount = CurrencyAmount;
exports.MAX_UINT160 = '0xffffffffffffffffffffffffffffffffffffffff';
// Try to parse a user entered amount for a given token
function parseAmount(value, currency) {
    const typedValueParsed = (0, units_1.parseUnits)(value, currency.decimals).toString();
    return CurrencyAmount.fromRawAmount(currency, jsbi_1.default.BigInt(typedValueParsed));
}
exports.parseAmount = parseAmount;
function parseFeeAmount(feeAmountStr) {
    switch (feeAmountStr) {
        case '10000':
            return dswap_v3_sdk_1.FeeAmount.HIGH;
        case '3000':
            return dswap_v3_sdk_1.FeeAmount.MEDIUM;
        case '500':
            return dswap_v3_sdk_1.FeeAmount.LOW;
        case '100':
            return dswap_v3_sdk_1.FeeAmount.LOWEST;
        default:
            throw new Error(`Fee amount ${feeAmountStr} not supported.`);
    }
}
exports.parseFeeAmount = parseFeeAmount;
function unparseFeeAmount(feeAmount) {
    switch (feeAmount) {
        case dswap_v3_sdk_1.FeeAmount.HIGH:
            return '10000';
        case dswap_v3_sdk_1.FeeAmount.MEDIUM:
            return '3000';
        case dswap_v3_sdk_1.FeeAmount.LOW:
            return '500';
        case dswap_v3_sdk_1.FeeAmount.LOWEST:
            return '100';
        default:
            throw new Error(`Fee amount ${feeAmount} not supported.`);
    }
}
exports.unparseFeeAmount = unparseFeeAmount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1vdW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL2Ftb3VudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQWtEO0FBQ2xELCtEQUdvQztBQUNwQywyREFBcUQ7QUFDckQsZ0RBQXdCO0FBRXhCLE1BQWEsY0FBZSxTQUFRLCtCQUEyQjtDQUFHO0FBQWxFLHdDQUFrRTtBQUVyRCxRQUFBLFdBQVcsR0FBRyw0Q0FBNEMsQ0FBQztBQUV4RSx1REFBdUQ7QUFDdkQsU0FBZ0IsV0FBVyxDQUFDLEtBQWEsRUFBRSxRQUFrQjtJQUMzRCxNQUFNLGdCQUFnQixHQUFHLElBQUEsa0JBQVUsRUFBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pFLE9BQU8sY0FBYyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUhELGtDQUdDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFlBQW9CO0lBQ2pELFFBQVEsWUFBWSxFQUFFO1FBQ3BCLEtBQUssT0FBTztZQUNWLE9BQU8sd0JBQVMsQ0FBQyxJQUFJLENBQUM7UUFDeEIsS0FBSyxNQUFNO1lBQ1QsT0FBTyx3QkFBUyxDQUFDLE1BQU0sQ0FBQztRQUMxQixLQUFLLEtBQUs7WUFDUixPQUFPLHdCQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLEtBQUssS0FBSztZQUNSLE9BQU8sd0JBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUI7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsWUFBWSxpQkFBaUIsQ0FBQyxDQUFDO0tBQ2hFO0FBQ0gsQ0FBQztBQWJELHdDQWFDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsU0FBb0I7SUFDbkQsUUFBUSxTQUFTLEVBQUU7UUFDakIsS0FBSyx3QkFBUyxDQUFDLElBQUk7WUFDakIsT0FBTyxPQUFPLENBQUM7UUFDakIsS0FBSyx3QkFBUyxDQUFDLE1BQU07WUFDbkIsT0FBTyxNQUFNLENBQUM7UUFDaEIsS0FBSyx3QkFBUyxDQUFDLEdBQUc7WUFDaEIsT0FBTyxLQUFLLENBQUM7UUFDZixLQUFLLHdCQUFTLENBQUMsTUFBTTtZQUNuQixPQUFPLEtBQUssQ0FBQztRQUNmO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLFNBQVMsaUJBQWlCLENBQUMsQ0FBQztLQUM3RDtBQUNILENBQUM7QUFiRCw0Q0FhQyJ9