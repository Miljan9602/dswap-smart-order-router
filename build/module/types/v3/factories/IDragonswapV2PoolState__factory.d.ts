import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IDragonswapV2PoolState, IDragonswapV2PoolStateInterface } from "../IDragonswapV2PoolState";
export declare class IDragonswapV2PoolState__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IDragonswapV2PoolStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IDragonswapV2PoolState;
}
