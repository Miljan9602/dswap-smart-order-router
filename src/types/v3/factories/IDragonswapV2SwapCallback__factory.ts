/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IDragonswapV2SwapCallback,
  IDragonswapV2SwapCallbackInterface,
} from "../IDragonswapV2SwapCallback";

const _abi = [
  {
    inputs: [
      {
        internalType: "int256",
        name: "amount0Delta",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "amount1Delta",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "dragonswapV2SwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IDragonswapV2SwapCallback__factory {
  static readonly abi = _abi;
  static createInterface(): IDragonswapV2SwapCallbackInterface {
    return new utils.Interface(_abi) as IDragonswapV2SwapCallbackInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDragonswapV2SwapCallback {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IDragonswapV2SwapCallback;
  }
}
