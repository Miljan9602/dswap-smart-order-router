"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingTokenProviderWithFallback = exports.CACHE_SEED_TOKENS = void 0;
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("../util");
const token_provider_1 = require("./token-provider");
// These tokens will added to the Token cache on initialization.
exports.CACHE_SEED_TOKENS = {
    [dswap_sdk_core_1.ChainId.MAINNET]: {
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.MAINNET],
        USDC: token_provider_1.USDC_MAINNET,
        USDT: token_provider_1.USDT_MAINNET,
        WBTC: token_provider_1.WBTC_MAINNET,
        DAI: token_provider_1.DAI_MAINNET,
        // This token stores its symbol as bytes32, therefore can not be fetched on-chain using
        // our token providers.
        // This workaround adds it to the cache, so we won't try to fetch it on-chain.
        RING: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x9469D013805bFfB7D3DEBe5E7839237e535ec483', 18, 'RING', 'RING'),
    },
    [dswap_sdk_core_1.ChainId.SEPOLIA]: {
        USDC: token_provider_1.USDC_SEPOLIA,
    },
    [dswap_sdk_core_1.ChainId.OPTIMISM]: {
        USDC: token_provider_1.USDC_OPTIMISM,
        USDT: token_provider_1.USDT_OPTIMISM,
        WBTC: token_provider_1.WBTC_OPTIMISM,
        DAI: token_provider_1.DAI_OPTIMISM,
    },
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: {
        USDC: token_provider_1.USDC_OPTIMISM_GOERLI,
        USDT: token_provider_1.USDT_OPTIMISM_GOERLI,
        WBTC: token_provider_1.WBTC_OPTIMISM_GOERLI,
        DAI: token_provider_1.DAI_OPTIMISM_GOERLI,
    },
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: {
        USDC: token_provider_1.USDC_OPTIMISM_SEPOLIA,
        USDT: token_provider_1.USDT_OPTIMISM_SEPOLIA,
        WBTC: token_provider_1.WBTC_OPTIMISM_SEPOLIA,
        DAI: token_provider_1.DAI_OPTIMISM_SEPOLIA,
    },
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: {
        USDC: token_provider_1.USDC_ARBITRUM,
        USDT: token_provider_1.USDT_ARBITRUM,
        WBTC: token_provider_1.WBTC_ARBITRUM,
        DAI: token_provider_1.DAI_ARBITRUM,
    },
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: {
        USDC: token_provider_1.USDC_ARBITRUM_GOERLI,
    },
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: {
        USDC: token_provider_1.USDC_ARBITRUM_SEPOLIA,
        DAI: token_provider_1.DAI_ARBITRUM_SEPOLIA,
    },
    [dswap_sdk_core_1.ChainId.POLYGON]: {
        WMATIC: token_provider_1.WMATIC_POLYGON,
        USDC: token_provider_1.USDC_POLYGON,
    },
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: {
        WMATIC: token_provider_1.WMATIC_POLYGON_MUMBAI,
        DAI: token_provider_1.DAI_POLYGON_MUMBAI,
    },
    [dswap_sdk_core_1.ChainId.CELO]: {
        CELO: token_provider_1.CELO,
        CUSD: token_provider_1.CUSD_CELO,
        CEUR: token_provider_1.CEUR_CELO,
        DAI: token_provider_1.DAI_CELO,
    },
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: {
        CELO: token_provider_1.CELO_ALFAJORES,
        CUSD: token_provider_1.CUSD_CELO_ALFAJORES,
        CEUR: token_provider_1.CUSD_CELO_ALFAJORES,
        DAI: token_provider_1.DAI_CELO_ALFAJORES,
    },
    [dswap_sdk_core_1.ChainId.GNOSIS]: {
        WXDAI: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.GNOSIS],
        USDC_ETHEREUM_GNOSIS: token_provider_1.USDC_ETHEREUM_GNOSIS,
    },
    [dswap_sdk_core_1.ChainId.MOONBEAM]: {
        USDC: token_provider_1.USDC_MOONBEAM,
        DAI: token_provider_1.DAI_MOONBEAM,
        WBTC: token_provider_1.WBTC_MOONBEAM,
        WGLMR: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.MOONBEAM],
    },
    [dswap_sdk_core_1.ChainId.BNB]: {
        USDC: token_provider_1.USDC_BNB,
        USDT: token_provider_1.USDT_BNB,
        BUSD: token_provider_1.BUSD_BNB,
        ETH: token_provider_1.ETH_BNB,
        DAI: token_provider_1.DAI_BNB,
        BTC: token_provider_1.BTC_BNB,
        WBNB: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BNB],
    },
    [dswap_sdk_core_1.ChainId.AVALANCHE]: {
        USDC: token_provider_1.USDC_AVAX,
        DAI: token_provider_1.DAI_AVAX,
        WAVAX: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.AVALANCHE],
    },
    [dswap_sdk_core_1.ChainId.BASE]: {
        USDC: token_provider_1.USDC_BASE,
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BASE],
    },
    [dswap_sdk_core_1.ChainId.BLAST]: {
        USDB: token_provider_1.USDB_BLAST,
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.BLAST],
    },
    [dswap_sdk_core_1.ChainId.ZORA]: {
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.ZORA],
    },
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: {
        USDC: token_provider_1.USDC_SEI_MAINNET,
        USDT: token_provider_1.USDT_SEI_MAINNET,
        WETH: util_1.WRAPPED_NATIVE_CURRENCY[dswap_sdk_core_1.ChainId.SEI_MAINNET],
    },
    // Currently we do not have providers for Moonbeam mainnet or Gnosis testnet
};
/**
 * Provider for getting token metadata that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class CachingTokenProviderWithFallback
 */
class CachingTokenProviderWithFallback {
    constructor(chainId, 
    // Token metadata (e.g. symbol and decimals) don't change so can be cached indefinitely.
    // Constructing a new token object is slow as sdk-core does checksumming.
    tokenCache, primaryTokenProvider, fallbackTokenProvider) {
        this.chainId = chainId;
        this.tokenCache = tokenCache;
        this.primaryTokenProvider = primaryTokenProvider;
        this.fallbackTokenProvider = fallbackTokenProvider;
        this.CACHE_KEY = (chainId, address) => `token-${chainId}-${address}`;
    }
    async getTokens(_addresses) {
        const seedTokens = exports.CACHE_SEED_TOKENS[this.chainId];
        if (seedTokens) {
            for (const token of Object.values(seedTokens)) {
                await this.tokenCache.set(this.CACHE_KEY(this.chainId, token.address.toLowerCase()), token);
            }
        }
        const addressToToken = {};
        const symbolToToken = {};
        const addresses = (0, lodash_1.default)(_addresses)
            .map((address) => address.toLowerCase())
            .uniq()
            .value();
        const addressesToFindInPrimary = [];
        const addressesToFindInSecondary = [];
        for (const address of addresses) {
            if (await this.tokenCache.has(this.CACHE_KEY(this.chainId, address))) {
                addressToToken[address.toLowerCase()] = (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)));
                symbolToToken[addressToToken[address].symbol] =
                    (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)));
            }
            else {
                addressesToFindInPrimary.push(address);
            }
        }
        util_1.log.info({ addressesToFindInPrimary }, `Found ${addresses.length - addressesToFindInPrimary.length} out of ${addresses.length} tokens in local cache. ${addressesToFindInPrimary.length > 0
            ? `Checking primary token provider for ${addressesToFindInPrimary.length} tokens`
            : ``}
      `);
        if (addressesToFindInPrimary.length > 0) {
            const primaryTokenAccessor = await this.primaryTokenProvider.getTokens(addressesToFindInPrimary);
            for (const address of addressesToFindInPrimary) {
                const token = primaryTokenAccessor.getTokenByAddress(address);
                if (token) {
                    addressToToken[address.toLowerCase()] = token;
                    symbolToToken[addressToToken[address].symbol] = token;
                    await this.tokenCache.set(this.CACHE_KEY(this.chainId, address.toLowerCase()), addressToToken[address]);
                }
                else {
                    addressesToFindInSecondary.push(address);
                }
            }
            util_1.log.info({ addressesToFindInSecondary }, `Found ${addressesToFindInPrimary.length - addressesToFindInSecondary.length} tokens in primary. ${this.fallbackTokenProvider
                ? `Checking secondary token provider for ${addressesToFindInSecondary.length} tokens`
                : `No fallback token provider specified. About to return.`}`);
        }
        if (this.fallbackTokenProvider && addressesToFindInSecondary.length > 0) {
            const secondaryTokenAccessor = await this.fallbackTokenProvider.getTokens(addressesToFindInSecondary);
            for (const address of addressesToFindInSecondary) {
                const token = secondaryTokenAccessor.getTokenByAddress(address);
                if (token) {
                    addressToToken[address.toLowerCase()] = token;
                    symbolToToken[addressToToken[address].symbol] = token;
                    await this.tokenCache.set(this.CACHE_KEY(this.chainId, address.toLowerCase()), addressToToken[address]);
                }
            }
        }
        return {
            getTokenByAddress: (address) => {
                return addressToToken[address.toLowerCase()];
            },
            getTokenBySymbol: (symbol) => {
                return symbolToToken[symbol.toLowerCase()];
            },
            getAllTokens: () => {
                return Object.values(addressToToken);
            },
        };
    }
}
exports.CachingTokenProviderWithFallback = CachingTokenProviderWithFallback;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy10b2tlbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvY2FjaGluZy10b2tlbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrREFBNEQ7QUFDNUQsb0RBQXVCO0FBRXZCLGtDQUF1RDtBQUd2RCxxREFvRDBCO0FBRTFCLGdFQUFnRTtBQUNuRCxRQUFBLGlCQUFpQixHQUUxQjtJQUNGLENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQixJQUFJLEVBQUUsOEJBQXVCLENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUU7UUFDL0MsSUFBSSxFQUFFLDZCQUFZO1FBQ2xCLElBQUksRUFBRSw2QkFBWTtRQUNsQixJQUFJLEVBQUUsNkJBQVk7UUFDbEIsR0FBRyxFQUFFLDRCQUFXO1FBQ2hCLHVGQUF1RjtRQUN2Rix1QkFBdUI7UUFDdkIsOEVBQThFO1FBQzlFLElBQUksRUFBRSxJQUFJLHNCQUFLLENBQ2Isd0JBQU8sQ0FBQyxPQUFPLEVBQ2YsNENBQTRDLEVBQzVDLEVBQUUsRUFDRixNQUFNLEVBQ04sTUFBTSxDQUNQO0tBQ0Y7SUFDRCxDQUFDLHdCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDakIsSUFBSSxFQUFFLDZCQUFZO0tBQ25CO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2xCLElBQUksRUFBRSw4QkFBYTtRQUNuQixJQUFJLEVBQUUsOEJBQWE7UUFDbkIsSUFBSSxFQUFFLDhCQUFhO1FBQ25CLEdBQUcsRUFBRSw2QkFBWTtLQUNsQjtJQUNELENBQUMsd0JBQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtRQUN6QixJQUFJLEVBQUUscUNBQW9CO1FBQzFCLElBQUksRUFBRSxxQ0FBb0I7UUFDMUIsSUFBSSxFQUFFLHFDQUFvQjtRQUMxQixHQUFHLEVBQUUsb0NBQW1CO0tBQ3pCO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7UUFDMUIsSUFBSSxFQUFFLHNDQUFxQjtRQUMzQixJQUFJLEVBQUUsc0NBQXFCO1FBQzNCLElBQUksRUFBRSxzQ0FBcUI7UUFDM0IsR0FBRyxFQUFFLHFDQUFvQjtLQUMxQjtJQUNELENBQUMsd0JBQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUN0QixJQUFJLEVBQUUsOEJBQWE7UUFDbkIsSUFBSSxFQUFFLDhCQUFhO1FBQ25CLElBQUksRUFBRSw4QkFBYTtRQUNuQixHQUFHLEVBQUUsNkJBQVk7S0FDbEI7SUFDRCxDQUFDLHdCQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDekIsSUFBSSxFQUFFLHFDQUFvQjtLQUMzQjtJQUNELENBQUMsd0JBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1FBQzFCLElBQUksRUFBRSxzQ0FBcUI7UUFDM0IsR0FBRyxFQUFFLHFDQUFvQjtLQUMxQjtJQUNELENBQUMsd0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQixNQUFNLEVBQUUsK0JBQWM7UUFDdEIsSUFBSSxFQUFFLDZCQUFZO0tBQ25CO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sRUFBRSxzQ0FBcUI7UUFDN0IsR0FBRyxFQUFFLG1DQUFrQjtLQUN4QjtJQUNELENBQUMsd0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNkLElBQUksRUFBRSxxQkFBSTtRQUNWLElBQUksRUFBRSwwQkFBUztRQUNmLElBQUksRUFBRSwwQkFBUztRQUNmLEdBQUcsRUFBRSx5QkFBUTtLQUNkO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1FBQ3hCLElBQUksRUFBRSwrQkFBYztRQUNwQixJQUFJLEVBQUUsb0NBQW1CO1FBQ3pCLElBQUksRUFBRSxvQ0FBbUI7UUFDekIsR0FBRyxFQUFFLG1DQUFrQjtLQUN4QjtJQUNELENBQUMsd0JBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNoQixLQUFLLEVBQUUsOEJBQXVCLENBQUMsd0JBQU8sQ0FBQyxNQUFNLENBQUM7UUFDOUMsb0JBQW9CLEVBQUUscUNBQW9CO0tBQzNDO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2xCLElBQUksRUFBRSw4QkFBYTtRQUNuQixHQUFHLEVBQUUsNkJBQVk7UUFDakIsSUFBSSxFQUFFLDhCQUFhO1FBQ25CLEtBQUssRUFBRSw4QkFBdUIsQ0FBQyx3QkFBTyxDQUFDLFFBQVEsQ0FBQztLQUNqRDtJQUNELENBQUMsd0JBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNiLElBQUksRUFBRSx5QkFBUTtRQUNkLElBQUksRUFBRSx5QkFBUTtRQUNkLElBQUksRUFBRSx5QkFBUTtRQUNkLEdBQUcsRUFBRSx3QkFBTztRQUNaLEdBQUcsRUFBRSx3QkFBTztRQUNaLEdBQUcsRUFBRSx3QkFBTztRQUNaLElBQUksRUFBRSw4QkFBdUIsQ0FBQyx3QkFBTyxDQUFDLEdBQUcsQ0FBQztLQUMzQztJQUNELENBQUMsd0JBQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNuQixJQUFJLEVBQUUsMEJBQVM7UUFDZixHQUFHLEVBQUUseUJBQVE7UUFDYixLQUFLLEVBQUUsOEJBQXVCLENBQUMsd0JBQU8sQ0FBQyxTQUFTLENBQUM7S0FDbEQ7SUFDRCxDQUFDLHdCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZCxJQUFJLEVBQUUsMEJBQVM7UUFDZixJQUFJLEVBQUUsOEJBQXVCLENBQUMsd0JBQU8sQ0FBQyxJQUFJLENBQUM7S0FDNUM7SUFDRCxDQUFDLHdCQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsMkJBQVU7UUFDaEIsSUFBSSxFQUFFLDhCQUF1QixDQUFDLHdCQUFPLENBQUMsS0FBSyxDQUFDO0tBQzdDO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2QsSUFBSSxFQUFFLDhCQUF1QixDQUFDLHdCQUFPLENBQUMsSUFBSSxDQUFDO0tBQzVDO0lBQ0QsQ0FBQyx3QkFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFHO1FBQ3RCLElBQUksRUFBRSxpQ0FBZ0I7UUFDdEIsSUFBSSxFQUFFLGlDQUFnQjtRQUN0QixJQUFJLEVBQUUsOEJBQXVCLENBQUMsd0JBQU8sQ0FBQyxXQUFXLENBQUM7S0FDbkQ7SUFDRCw0RUFBNEU7Q0FDN0UsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUNILE1BQWEsZ0NBQWdDO0lBSTNDLFlBQ1ksT0FBZ0I7SUFDMUIsd0ZBQXdGO0lBQ3hGLHlFQUF5RTtJQUNqRSxVQUF5QixFQUN2QixvQkFBb0MsRUFDcEMscUJBQXNDO1FBTHRDLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFHbEIsZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUN2Qix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWdCO1FBQ3BDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBaUI7UUFUMUMsY0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBRSxPQUFlLEVBQUUsRUFBRSxDQUN4RCxTQUFTLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztJQVM3QixDQUFDO0lBRUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFvQjtRQUN6QyxNQUFNLFVBQVUsR0FBRyx5QkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkQsSUFBSSxVQUFVLEVBQUU7WUFDZCxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzdDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQ3pELEtBQUssQ0FDTixDQUFDO2FBQ0g7U0FDRjtRQUVELE1BQU0sY0FBYyxHQUFpQyxFQUFFLENBQUM7UUFDeEQsTUFBTSxhQUFhLEdBQWdDLEVBQUUsQ0FBQztRQUV0RCxNQUFNLFNBQVMsR0FBRyxJQUFBLGdCQUFDLEVBQUMsVUFBVSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3ZDLElBQUksRUFBRTthQUNOLEtBQUssRUFBRSxDQUFDO1FBRVgsTUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFDcEMsTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUM7UUFFdEMsS0FBSyxNQUFNLE9BQU8sSUFBSSxTQUFTLEVBQUU7WUFDL0IsSUFBSSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFO2dCQUNwRSxjQUFjLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQ3RDLENBQUUsQ0FBQztnQkFDSixhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBRSxDQUFDLE1BQU8sQ0FBQztvQkFDN0MsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7YUFDdkU7aUJBQU07Z0JBQ0wsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Y7UUFFRCxVQUFHLENBQUMsSUFBSSxDQUNOLEVBQUUsd0JBQXdCLEVBQUUsRUFDNUIsU0FBUyxTQUFTLENBQUMsTUFBTSxHQUFHLHdCQUF3QixDQUFDLE1BQU0sV0FDekQsU0FBUyxDQUFDLE1BQ1osMkJBQ0Usd0JBQXdCLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDakMsQ0FBQyxDQUFDLHVDQUF1Qyx3QkFBd0IsQ0FBQyxNQUFNLFNBQVM7WUFDakYsQ0FBQyxDQUFDLEVBQ047T0FDQyxDQUNGLENBQUM7UUFFRixJQUFJLHdCQUF3QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQ3BFLHdCQUF3QixDQUN6QixDQUFDO1lBRUYsS0FBSyxNQUFNLE9BQU8sSUFBSSx3QkFBd0IsRUFBRTtnQkFDOUMsTUFBTSxLQUFLLEdBQUcsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTlELElBQUksS0FBSyxFQUFFO29CQUNULGNBQWMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBQzlDLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFFLENBQUMsTUFBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUN4RCxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQ25ELGNBQWMsQ0FBQyxPQUFPLENBQUUsQ0FDekIsQ0FBQztpQkFDSDtxQkFBTTtvQkFDTCwwQkFBMEIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzFDO2FBQ0Y7WUFFRCxVQUFHLENBQUMsSUFBSSxDQUNOLEVBQUUsMEJBQTBCLEVBQUUsRUFDOUIsU0FDRSx3QkFBd0IsQ0FBQyxNQUFNLEdBQUcsMEJBQTBCLENBQUMsTUFDL0QsdUJBQ0UsSUFBSSxDQUFDLHFCQUFxQjtnQkFDeEIsQ0FBQyxDQUFDLHlDQUF5QywwQkFBMEIsQ0FBQyxNQUFNLFNBQVM7Z0JBQ3JGLENBQUMsQ0FBQyx3REFDTixFQUFFLENBQ0gsQ0FBQztTQUNIO1FBRUQsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksMEJBQTBCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2RSxNQUFNLHNCQUFzQixHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FDdkUsMEJBQTBCLENBQzNCLENBQUM7WUFFRixLQUFLLE1BQU0sT0FBTyxJQUFJLDBCQUEwQixFQUFFO2dCQUNoRCxNQUFNLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDaEUsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDOUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUUsQ0FBQyxNQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7b0JBQ3hELE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsRUFDbkQsY0FBYyxDQUFDLE9BQU8sQ0FBRSxDQUN6QixDQUFDO2lCQUNIO2FBQ0Y7U0FDRjtRQUVELE9BQU87WUFDTCxpQkFBaUIsRUFBRSxDQUFDLE9BQWUsRUFBcUIsRUFBRTtnQkFDeEQsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUNELGdCQUFnQixFQUFFLENBQUMsTUFBYyxFQUFxQixFQUFFO2dCQUN0RCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUM3QyxDQUFDO1lBQ0QsWUFBWSxFQUFFLEdBQVksRUFBRTtnQkFDMUIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBMUhELDRFQTBIQyJ9