/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IDragonswapV2FlashCallback,
  IDragonswapV2FlashCallbackInterface,
} from "../IDragonswapV2FlashCallback";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fee1",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "dragonswapV2FlashCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IDragonswapV2FlashCallback__factory {
  static readonly abi = _abi;
  static createInterface(): IDragonswapV2FlashCallbackInterface {
    return new utils.Interface(_abi) as IDragonswapV2FlashCallbackInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDragonswapV2FlashCallback {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IDragonswapV2FlashCallback;
  }
}
