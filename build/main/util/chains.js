"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeOnChain = exports.ExtendedEther = exports.WRAPPED_NATIVE_CURRENCY = exports.ID_TO_PROVIDER = exports.CHAIN_IDS_LIST = exports.ID_TO_NETWORK_NAME = exports.NATIVE_CURRENCY = exports.NATIVE_NAMES_BY_ID = exports.NativeCurrencyName = exports.ChainName = exports.ID_TO_CHAIN_ID = exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = exports.HAS_L1_FEE = exports.V2_SUPPORTED = exports.SUPPORTED_CHAINS = void 0;
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
// WIP: Gnosis, Moonbeam
exports.SUPPORTED_CHAINS = [
    dswap_sdk_core_1.ChainId.MAINNET,
    dswap_sdk_core_1.ChainId.OPTIMISM,
    dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI,
    dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA,
    dswap_sdk_core_1.ChainId.ARBITRUM_ONE,
    dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI,
    dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA,
    dswap_sdk_core_1.ChainId.POLYGON,
    dswap_sdk_core_1.ChainId.POLYGON_MUMBAI,
    dswap_sdk_core_1.ChainId.SEPOLIA,
    dswap_sdk_core_1.ChainId.CELO_ALFAJORES,
    dswap_sdk_core_1.ChainId.CELO,
    dswap_sdk_core_1.ChainId.BNB,
    dswap_sdk_core_1.ChainId.AVALANCHE,
    dswap_sdk_core_1.ChainId.BASE,
    dswap_sdk_core_1.ChainId.BLAST,
    dswap_sdk_core_1.ChainId.ZORA,
    dswap_sdk_core_1.ChainId.SEI_MAINNET
    // Gnosis and Moonbeam don't yet have contracts deployed yet
];
exports.V2_SUPPORTED = [
    dswap_sdk_core_1.ChainId.MAINNET,
    dswap_sdk_core_1.ChainId.SEPOLIA,
    dswap_sdk_core_1.ChainId.ARBITRUM_ONE,
    dswap_sdk_core_1.ChainId.OPTIMISM,
    dswap_sdk_core_1.ChainId.POLYGON,
    dswap_sdk_core_1.ChainId.BASE,
    dswap_sdk_core_1.ChainId.BNB,
    dswap_sdk_core_1.ChainId.AVALANCHE,
    dswap_sdk_core_1.ChainId.SEI_MAINNET
];
exports.HAS_L1_FEE = [
    dswap_sdk_core_1.ChainId.OPTIMISM,
    dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI,
    dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA,
    dswap_sdk_core_1.ChainId.ARBITRUM_ONE,
    dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI,
    dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA,
    dswap_sdk_core_1.ChainId.BASE,
    dswap_sdk_core_1.ChainId.BASE_GOERLI,
    dswap_sdk_core_1.ChainId.BLAST,
    dswap_sdk_core_1.ChainId.ZORA,
];
exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
    dswap_sdk_core_1.ChainId.MAINNET,
    dswap_sdk_core_1.ChainId.GOERLI,
    dswap_sdk_core_1.ChainId.OPTIMISM,
    dswap_sdk_core_1.ChainId.ARBITRUM_ONE,
    dswap_sdk_core_1.ChainId.POLYGON,
    dswap_sdk_core_1.ChainId.POLYGON_MUMBAI,
];
const ID_TO_CHAIN_ID = (id) => {
    switch (id) {
        case 1:
            return dswap_sdk_core_1.ChainId.MAINNET;
        case 5:
            return dswap_sdk_core_1.ChainId.GOERLI;
        case 11155111:
            return dswap_sdk_core_1.ChainId.SEPOLIA;
        case 56:
            return dswap_sdk_core_1.ChainId.BNB;
        case 10:
            return dswap_sdk_core_1.ChainId.OPTIMISM;
        case 420:
            return dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI;
        case 11155420:
            return dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA;
        case 42161:
            return dswap_sdk_core_1.ChainId.ARBITRUM_ONE;
        case 421613:
            return dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI;
        case 421614:
            return dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA;
        case 137:
            return dswap_sdk_core_1.ChainId.POLYGON;
        case 80001:
            return dswap_sdk_core_1.ChainId.POLYGON_MUMBAI;
        case 42220:
            return dswap_sdk_core_1.ChainId.CELO;
        case 44787:
            return dswap_sdk_core_1.ChainId.CELO_ALFAJORES;
        case 100:
            return dswap_sdk_core_1.ChainId.GNOSIS;
        case 1284:
            return dswap_sdk_core_1.ChainId.MOONBEAM;
        case 43114:
            return dswap_sdk_core_1.ChainId.AVALANCHE;
        case 8453:
            return dswap_sdk_core_1.ChainId.BASE;
        case 84531:
            return dswap_sdk_core_1.ChainId.BASE_GOERLI;
        case 81457:
            return dswap_sdk_core_1.ChainId.BLAST;
        case 7777777:
            return dswap_sdk_core_1.ChainId.ZORA;
        case 1329:
            return dswap_sdk_core_1.ChainId.SEI_MAINNET;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
exports.ID_TO_CHAIN_ID = ID_TO_CHAIN_ID;
var ChainName;
(function (ChainName) {
    ChainName["MAINNET"] = "mainnet";
    ChainName["GOERLI"] = "goerli";
    ChainName["SEPOLIA"] = "sepolia";
    ChainName["OPTIMISM"] = "optimism-mainnet";
    ChainName["OPTIMISM_GOERLI"] = "optimism-goerli";
    ChainName["OPTIMISM_SEPOLIA"] = "optimism-sepolia";
    ChainName["ARBITRUM_ONE"] = "arbitrum-mainnet";
    ChainName["ARBITRUM_GOERLI"] = "arbitrum-goerli";
    ChainName["ARBITRUM_SEPOLIA"] = "arbitrum-sepolia";
    ChainName["POLYGON"] = "polygon-mainnet";
    ChainName["POLYGON_MUMBAI"] = "polygon-mumbai";
    ChainName["CELO"] = "celo-mainnet";
    ChainName["CELO_ALFAJORES"] = "celo-alfajores";
    ChainName["GNOSIS"] = "gnosis-mainnet";
    ChainName["MOONBEAM"] = "moonbeam-mainnet";
    ChainName["BNB"] = "bnb-mainnet";
    ChainName["AVALANCHE"] = "avalanche-mainnet";
    ChainName["BASE"] = "base-mainnet";
    ChainName["BASE_GOERLI"] = "base-goerli";
    ChainName["BLAST"] = "blast-mainnet";
    ChainName["ZORA"] = "zora-mainnet";
    ChainName["SEI_MAINNET"] = "sei";
})(ChainName = exports.ChainName || (exports.ChainName = {}));
var NativeCurrencyName;
(function (NativeCurrencyName) {
    // Strings match input for CLI
    NativeCurrencyName["ETHER"] = "ETH";
    NativeCurrencyName["MATIC"] = "MATIC";
    NativeCurrencyName["CELO"] = "CELO";
    NativeCurrencyName["GNOSIS"] = "XDAI";
    NativeCurrencyName["MOONBEAM"] = "GLMR";
    NativeCurrencyName["BNB"] = "BNB";
    NativeCurrencyName["AVALANCHE"] = "AVAX";
    NativeCurrencyName["SEI"] = "SEI";
})(NativeCurrencyName = exports.NativeCurrencyName || (exports.NativeCurrencyName = {}));
exports.NATIVE_NAMES_BY_ID = {
    [dswap_sdk_core_1.ChainId.MAINNET]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.POLYGON]: ['MATIC', '0x0000000000000000000000000000000000001010'],
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: [
        'MATIC',
        '0x0000000000000000000000000000000000001010',
    ],
    [dswap_sdk_core_1.ChainId.CELO]: ['CELO'],
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: ['CELO'],
    [dswap_sdk_core_1.ChainId.GNOSIS]: ['XDAI'],
    [dswap_sdk_core_1.ChainId.MOONBEAM]: ['GLMR'],
    [dswap_sdk_core_1.ChainId.BNB]: ['BNB', 'BNB', '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
    [dswap_sdk_core_1.ChainId.AVALANCHE]: [
        'AVAX',
        'AVALANCHE',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.BASE]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.BLAST]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.ZORA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: [
        'SEI',
        'sei',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
};
exports.NATIVE_CURRENCY = {
    [dswap_sdk_core_1.ChainId.MAINNET]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.GOERLI]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.SEPOLIA]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.OPTIMISM]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.POLYGON]: NativeCurrencyName.MATIC,
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: NativeCurrencyName.MATIC,
    [dswap_sdk_core_1.ChainId.CELO]: NativeCurrencyName.CELO,
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: NativeCurrencyName.CELO,
    [dswap_sdk_core_1.ChainId.GNOSIS]: NativeCurrencyName.GNOSIS,
    [dswap_sdk_core_1.ChainId.MOONBEAM]: NativeCurrencyName.MOONBEAM,
    [dswap_sdk_core_1.ChainId.BNB]: NativeCurrencyName.BNB,
    [dswap_sdk_core_1.ChainId.AVALANCHE]: NativeCurrencyName.AVALANCHE,
    [dswap_sdk_core_1.ChainId.BASE]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.BLAST]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.ZORA]: NativeCurrencyName.ETHER,
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: NativeCurrencyName.SEI
};
const ID_TO_NETWORK_NAME = (id) => {
    switch (id) {
        case 1:
            return ChainName.MAINNET;
        case 5:
            return ChainName.GOERLI;
        case 11155111:
            return ChainName.SEPOLIA;
        case 56:
            return ChainName.BNB;
        case 10:
            return ChainName.OPTIMISM;
        case 420:
            return ChainName.OPTIMISM_GOERLI;
        case 11155420:
            return ChainName.OPTIMISM_SEPOLIA;
        case 42161:
            return ChainName.ARBITRUM_ONE;
        case 421613:
            return ChainName.ARBITRUM_GOERLI;
        case 421614:
            return ChainName.ARBITRUM_SEPOLIA;
        case 137:
            return ChainName.POLYGON;
        case 80001:
            return ChainName.POLYGON_MUMBAI;
        case 42220:
            return ChainName.CELO;
        case 44787:
            return ChainName.CELO_ALFAJORES;
        case 100:
            return ChainName.GNOSIS;
        case 1284:
            return ChainName.MOONBEAM;
        case 43114:
            return ChainName.AVALANCHE;
        case 8453:
            return ChainName.BASE;
        case 84531:
            return ChainName.BASE_GOERLI;
        case 81457:
            return ChainName.BLAST;
        case 7777777:
            return ChainName.ZORA;
        case 1329:
            return ChainName.SEI_MAINNET;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
exports.ID_TO_NETWORK_NAME = ID_TO_NETWORK_NAME;
exports.CHAIN_IDS_LIST = Object.values(dswap_sdk_core_1.ChainId).map((c) => c.toString());
const ID_TO_PROVIDER = (id) => {
    switch (id) {
        case dswap_sdk_core_1.ChainId.MAINNET:
            return process.env.JSON_RPC_PROVIDER;
        case dswap_sdk_core_1.ChainId.GOERLI:
            return process.env.JSON_RPC_PROVIDER_GORLI;
        case dswap_sdk_core_1.ChainId.SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_SEPOLIA;
        case dswap_sdk_core_1.ChainId.OPTIMISM:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM;
        case dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM_GOERLI;
        case dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_OPTIMISM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.ARBITRUM_ONE:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_ONE;
        case dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_GOERLI;
        case dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_ARBITRUM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.POLYGON:
            return process.env.JSON_RPC_PROVIDER_POLYGON;
        case dswap_sdk_core_1.ChainId.POLYGON_MUMBAI:
            return process.env.JSON_RPC_PROVIDER_POLYGON_MUMBAI;
        case dswap_sdk_core_1.ChainId.CELO:
            return process.env.JSON_RPC_PROVIDER_CELO;
        case dswap_sdk_core_1.ChainId.CELO_ALFAJORES:
            return process.env.JSON_RPC_PROVIDER_CELO_ALFAJORES;
        case dswap_sdk_core_1.ChainId.BNB:
            return process.env.JSON_RPC_PROVIDER_BNB;
        case dswap_sdk_core_1.ChainId.AVALANCHE:
            return process.env.JSON_RPC_PROVIDER_AVALANCHE;
        case dswap_sdk_core_1.ChainId.BASE:
            return process.env.JSON_RPC_PROVIDER_BASE;
        case dswap_sdk_core_1.ChainId.BLAST:
            return process.env.JSON_RPC_PROVIDER_BLAST;
        case dswap_sdk_core_1.ChainId.ZORA:
            return process.env.JSON_RPC_PROVIDER_ZORA;
        case dswap_sdk_core_1.ChainId.SEI_MAINNET:
            return process.env.JSON_RPC_PROVIDER_SEI_MAINNET;
        default:
            throw new Error(`Chain id: ${id} not supported`);
    }
};
exports.ID_TO_PROVIDER = ID_TO_PROVIDER;
exports.WRAPPED_NATIVE_CURRENCY = {
    [dswap_sdk_core_1.ChainId.MAINNET]: new dswap_sdk_core_1.Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.GOERLI]: new dswap_sdk_core_1.Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.SEPOLIA]: new dswap_sdk_core_1.Token(11155111, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.BNB]: new dswap_sdk_core_1.Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    [dswap_sdk_core_1.ChainId.OPTIMISM]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.ARBITRUM_ONE]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI, '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA, '0xc556bAe1e86B2aE9c22eA5E036b07E55E7596074', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.POLYGON]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped MATIC'),
    [dswap_sdk_core_1.ChainId.POLYGON_MUMBAI]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON_MUMBAI, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC'),
    // The Celo native currency 'CELO' implements the erc-20 token standard
    [dswap_sdk_core_1.ChainId.CELO]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0x471EcE3750Da237f93B8E339c536989b8978a438', 18, 'CELO', 'Celo native asset'),
    [dswap_sdk_core_1.ChainId.CELO_ALFAJORES]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO_ALFAJORES, '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', 18, 'CELO', 'Celo native asset'),
    [dswap_sdk_core_1.ChainId.GNOSIS]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GNOSIS, '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', 18, 'WXDAI', 'Wrapped XDAI on Gnosis'),
    [dswap_sdk_core_1.ChainId.MOONBEAM]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MOONBEAM, '0xAcc15dC74880C9944775448304B263D191c6077F', 18, 'WGLMR', 'Wrapped GLMR'),
    [dswap_sdk_core_1.ChainId.AVALANCHE]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX'),
    [dswap_sdk_core_1.ChainId.BASE]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.BASE_GOERLI]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BASE_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.ROOTSTOCK]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ROOTSTOCK, '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d', 18, 'WRBTC', 'Wrapped BTC'),
    [dswap_sdk_core_1.ChainId.ZORA]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ZORA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.ZORA_SEPOLIA]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ZORA_SEPOLIA, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.BLAST]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BLAST, '0x4300000000000000000000000000000000000004', 18, 'WETH', 'Wrapped Ether'),
    [dswap_sdk_core_1.ChainId.SEI_MAINNET]: new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.SEI_MAINNET, '0x027D2E627209f1cebA52ADc8A5aFE9318459b44B', 18, 'WSEI', 'Wrapped Sei'),
};
function isMatic(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.POLYGON_MUMBAI || chainId === dswap_sdk_core_1.ChainId.POLYGON;
}
class MaticNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isMatic(this.chainId))
            throw new Error('Not matic');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isMatic(chainId))
            throw new Error('Not matic');
        super(chainId, 18, 'MATIC', 'Polygon Matic');
    }
}
function isCelo(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.CELO_ALFAJORES || chainId === dswap_sdk_core_1.ChainId.CELO;
}
function isSeiMainnet(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.SEI_MAINNET || chainId === dswap_sdk_core_1.ChainId.SEI_MAINNET;
}
class CeloNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isCelo(this.chainId))
            throw new Error('Not celo');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isCelo(chainId))
            throw new Error('Not celo');
        super(chainId, 18, 'CELO', 'Celo');
    }
}
function isGnosis(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.GNOSIS;
}
class GnosisNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isGnosis(this.chainId))
            throw new Error('Not gnosis');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isGnosis(chainId))
            throw new Error('Not gnosis');
        super(chainId, 18, 'XDAI', 'xDai');
    }
}
function isBnb(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.BNB;
}
class BnbNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isBnb(this.chainId))
            throw new Error('Not bnb');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isBnb(chainId))
            throw new Error('Not bnb');
        super(chainId, 18, 'BNB', 'BNB');
    }
}
function isMoonbeam(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.MOONBEAM;
}
class MoonbeamNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isMoonbeam(this.chainId))
            throw new Error('Not moonbeam');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isMoonbeam(chainId))
            throw new Error('Not moonbeam');
        super(chainId, 18, 'GLMR', 'Glimmer');
    }
}
function isAvax(chainId) {
    return chainId === dswap_sdk_core_1.ChainId.AVALANCHE;
}
class AvalancheNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isAvax(this.chainId))
            throw new Error('Not avalanche');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    constructor(chainId) {
        if (!isAvax(chainId))
            throw new Error('Not avalanche');
        super(chainId, 18, 'AVAX', 'Avalanche');
    }
}
class SeiMainnetNativeCurrency extends dswap_sdk_core_1.NativeCurrency {
    constructor(chainId) {
        if (!isSeiMainnet(chainId))
            throw new Error('Not sei');
        super(chainId, 18, 'SEI', 'Sei');
    }
    get wrapped() {
        if (!isSeiMainnet(this.chainId))
            throw new Error('Not avalanche');
        const nativeCurrency = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (nativeCurrency) {
            return nativeCurrency;
        }
        throw new Error(`Does not support this chain ${this.chainId}`);
    }
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
}
class ExtendedEther extends dswap_sdk_core_1.Ether {
    get wrapped() {
        if (this.chainId in exports.WRAPPED_NATIVE_CURRENCY) {
            return exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        }
        throw new Error('Unsupported chain ID');
    }
    static onChain(chainId) {
        var _a;
        return ((_a = this._cachedExtendedEther[chainId]) !== null && _a !== void 0 ? _a : (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)));
    }
}
exports.ExtendedEther = ExtendedEther;
ExtendedEther._cachedExtendedEther = {};
const cachedNativeCurrency = {};
function nativeOnChain(chainId) {
    if (cachedNativeCurrency[chainId] != undefined) {
        return cachedNativeCurrency[chainId];
    }
    if (isMatic(chainId)) {
        cachedNativeCurrency[chainId] = new MaticNativeCurrency(chainId);
    }
    else if (isCelo(chainId)) {
        cachedNativeCurrency[chainId] = new CeloNativeCurrency(chainId);
    }
    else if (isGnosis(chainId)) {
        cachedNativeCurrency[chainId] = new GnosisNativeCurrency(chainId);
    }
    else if (isMoonbeam(chainId)) {
        cachedNativeCurrency[chainId] = new MoonbeamNativeCurrency(chainId);
    }
    else if (isBnb(chainId)) {
        cachedNativeCurrency[chainId] = new BnbNativeCurrency(chainId);
    }
    else if (isAvax(chainId)) {
        cachedNativeCurrency[chainId] = new AvalancheNativeCurrency(chainId);
    }
    else if (isSeiMainnet(chainId)) {
        cachedNativeCurrency[chainId] = new SeiMainnetNativeCurrency(chainId);
    }
    else {
        cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId);
    }
    return cachedNativeCurrency[chainId];
}
exports.nativeOnChain = nativeOnChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvY2hhaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtEQU1vQztBQUVwQyx3QkFBd0I7QUFDWCxRQUFBLGdCQUFnQixHQUFjO0lBQ3pDLHdCQUFPLENBQUMsT0FBTztJQUNmLHdCQUFPLENBQUMsUUFBUTtJQUNoQix3QkFBTyxDQUFDLGVBQWU7SUFDdkIsd0JBQU8sQ0FBQyxnQkFBZ0I7SUFDeEIsd0JBQU8sQ0FBQyxZQUFZO0lBQ3BCLHdCQUFPLENBQUMsZUFBZTtJQUN2Qix3QkFBTyxDQUFDLGdCQUFnQjtJQUN4Qix3QkFBTyxDQUFDLE9BQU87SUFDZix3QkFBTyxDQUFDLGNBQWM7SUFDdEIsd0JBQU8sQ0FBQyxPQUFPO0lBQ2Ysd0JBQU8sQ0FBQyxjQUFjO0lBQ3RCLHdCQUFPLENBQUMsSUFBSTtJQUNaLHdCQUFPLENBQUMsR0FBRztJQUNYLHdCQUFPLENBQUMsU0FBUztJQUNqQix3QkFBTyxDQUFDLElBQUk7SUFDWix3QkFBTyxDQUFDLEtBQUs7SUFDYix3QkFBTyxDQUFDLElBQUk7SUFDWix3QkFBTyxDQUFDLFdBQVc7SUFDbkIsNERBQTREO0NBQzdELENBQUM7QUFFVyxRQUFBLFlBQVksR0FBRztJQUMxQix3QkFBTyxDQUFDLE9BQU87SUFDZix3QkFBTyxDQUFDLE9BQU87SUFDZix3QkFBTyxDQUFDLFlBQVk7SUFDcEIsd0JBQU8sQ0FBQyxRQUFRO0lBQ2hCLHdCQUFPLENBQUMsT0FBTztJQUNmLHdCQUFPLENBQUMsSUFBSTtJQUNaLHdCQUFPLENBQUMsR0FBRztJQUNYLHdCQUFPLENBQUMsU0FBUztJQUNqQix3QkFBTyxDQUFDLFdBQVc7Q0FDcEIsQ0FBQztBQUVXLFFBQUEsVUFBVSxHQUFHO0lBQ3hCLHdCQUFPLENBQUMsUUFBUTtJQUNoQix3QkFBTyxDQUFDLGVBQWU7SUFDdkIsd0JBQU8sQ0FBQyxnQkFBZ0I7SUFDeEIsd0JB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