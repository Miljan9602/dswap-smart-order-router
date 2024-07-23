/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface V1SwapRouterInterface extends ethers.utils.Interface {
  functions: {
    "WSEI()": FunctionFragment;
    "factory()": FunctionFragment;
    "factoryV1()": FunctionFragment;
    "positionManager()": FunctionFragment;
    "pull(address,uint256)": FunctionFragment;
    "refundSEI()": FunctionFragment;
    "swapExactTokensForTokens(uint256,uint256,address[],address)": FunctionFragment;
    "swapTokensForExactTokens(uint256,uint256,address[],address)": FunctionFragment;
    "sweepToken(address,uint256,address)": FunctionFragment;
    "sweepTokenWithFee(address,uint256,uint256,address)": FunctionFragment;
    "unwrapWSEI(uint256)": FunctionFragment;
    "unwrapWSEIWithFee(uint256,uint256,address)": FunctionFragment;
    "wrapSEI(uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "WSEI", values?: undefined): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(functionFragment: "factoryV1", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "positionManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pull",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "refundSEI", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "swapExactTokensForTokens",
    values: [BigNumberish, BigNumberish, string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "swapTokensForExactTokens",
    values: [BigNumberish, BigNumberish, string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "sweepToken",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "sweepTokenWithFee",
    values: [string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "unwrapWSEI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "unwrapWSEIWithFee",
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "wrapSEI",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "WSEI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "factoryV1", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "positionManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pull", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refundSEI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "swapExactTokensForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapTokensForExactTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sweepToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sweepTokenWithFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unwrapWSEI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unwrapWSEIWithFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "wrapSEI", data: BytesLike): Result;

  events: {};
}

export class V1SwapRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: V1SwapRouterInterface;

  functions: {
    WSEI(overrides?: CallOverrides): Promise<[string]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    factoryV1(overrides?: CallOverrides): Promise<[string]>;

    positionManager(overrides?: CallOverrides): Promise<[string]>;

    pull(
      token: string,
      value: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    refundSEI(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "sweepToken(address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "sweepToken(address,uint256)"(
      token: string,
      amountMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "sweepTokenWithFee(address,uint256,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "sweepTokenWithFee(address,uint256,address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "unwrapWSEI(uint256)"(
      amountMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "unwrapWSEI(uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "unwrapWSEIWithFee(uint256,uint256,address)"(
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "unwrapWSEIWithFee(uint256,address,uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    wrapSEI(
      value: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  WSEI(overrides?: CallOverrides): Promise<string>;

  factory(overrides?: CallOverrides): Promise<string>;

  factoryV1(overrides?: CallOverrides): Promise<string>;

  positionManager(overrides?: CallOverrides): Promise<string>;

  pull(
    token: string,
    value: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  refundSEI(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapExactTokensForTokens(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapTokensForExactTokens(
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    path: string[],
    to: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "sweepToken(address,uint256,address)"(
    token: string,
    amountMinimum: BigNumberish,
    recipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "sweepToken(address,uint256)"(
    token: string,
    amountMinimum: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "sweepTokenWithFee(address,uint256,uint256,address)"(
    token: string,
    amountMinimum: BigNumberish,
    feeBips: BigNumberish,
    feeRecipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "sweepTokenWithFee(address,uint256,address,uint256,address)"(
    token: string,
    amountMinimum: BigNumberish,
    recipient: string,
    feeBips: BigNumberish,
    feeRecipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "unwrapWSEI(uint256)"(
    amountMinimum: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "unwrapWSEI(uint256,address)"(
    amountMinimum: BigNumberish,
    recipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "unwrapWSEIWithFee(uint256,uint256,address)"(
    amountMinimum: BigNumberish,
    feeBips: BigNumberish,
    feeRecipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "unwrapWSEIWithFee(uint256,address,uint256,address)"(
    amountMinimum: BigNumberish,
    recipient: string,
    feeBips: BigNumberish,
    feeRecipient: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  wrapSEI(
    value: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    WSEI(overrides?: CallOverrides): Promise<string>;

    factory(overrides?: CallOverrides): Promise<string>;

    factoryV1(overrides?: CallOverrides): Promise<string>;

    positionManager(overrides?: CallOverrides): Promise<string>;

    pull(
      token: string,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    refundSEI(overrides?: CallOverrides): Promise<void>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "sweepToken(address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "sweepToken(address,uint256)"(
      token: string,
      amountMinimum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "sweepTokenWithFee(address,uint256,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "sweepTokenWithFee(address,uint256,address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "unwrapWSEI(uint256)"(
      amountMinimum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "unwrapWSEI(uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "unwrapWSEIWithFee(uint256,uint256,address)"(
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "unwrapWSEIWithFee(uint256,address,uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    wrapSEI(value: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    WSEI(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    factoryV1(overrides?: CallOverrides): Promise<BigNumber>;

    positionManager(overrides?: CallOverrides): Promise<BigNumber>;

    pull(
      token: string,
      value: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    refundSEI(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "sweepToken(address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "sweepToken(address,uint256)"(
      token: string,
      amountMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "sweepTokenWithFee(address,uint256,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "sweepTokenWithFee(address,uint256,address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "unwrapWSEI(uint256)"(
      amountMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "unwrapWSEI(uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "unwrapWSEIWithFee(uint256,uint256,address)"(
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "unwrapWSEIWithFee(uint256,address,uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    wrapSEI(
      value: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    WSEI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factoryV1(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    positionManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pull(
      token: string,
      value: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    refundSEI(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "sweepToken(address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "sweepToken(address,uint256)"(
      token: string,
      amountMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "sweepTokenWithFee(address,uint256,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "sweepTokenWithFee(address,uint256,address,uint256,address)"(
      token: string,
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "unwrapWSEI(uint256)"(
      amountMinimum: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "unwrapWSEI(uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "unwrapWSEIWithFee(uint256,uint256,address)"(
      amountMinimum: BigNumberish,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "unwrapWSEIWithFee(uint256,address,uint256,address)"(
      amountMinimum: BigNumberish,
      recipient: string,
      feeBips: BigNumberish,
      feeRecipient: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    wrapSEI(
      value: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
