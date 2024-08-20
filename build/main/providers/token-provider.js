"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETH_POLYGON_MUMBAI = exports.DAI_POLYGON_MUMBAI = exports.USDC_POLYGON_MUMBAI = exports.WMATIC_POLYGON_MUMBAI = exports.DAI_POLYGON = exports.USDC_NATIVE_POLYGON = exports.USDC_POLYGON = exports.WETH_POLYGON = exports.WMATIC_POLYGON = exports.USDC_ARBITRUM_SEPOLIA = exports.USDC_ARBITRUM_GOERLI = exports.DAI_ARBITRUM_SEPOLIA = exports.DAI_ARBITRUM_GOERLI = exports.ARB_ARBITRUM = exports.DAI_ARBITRUM = exports.WBTC_ARBITRUM = exports.USDT_ARBITRUM = exports.USDC_NATIVE_ARBITRUM = exports.USDC_ARBITRUM = exports.DAI_OPTIMISM_SEPOLIA = exports.WBTC_OPTIMISM_SEPOLIA = exports.USDT_OPTIMISM_SEPOLIA = exports.USDC_OPTIMISM_SEPOLIA = exports.DAI_OPTIMISM_GOERLI = exports.WBTC_OPTIMISM_GOERLI = exports.USDT_OPTIMISM_GOERLI = exports.USDC_OPTIMISM_GOERLI = exports.OP_OPTIMISM = exports.DAI_OPTIMISM = exports.WBTC_OPTIMISM = exports.USDT_OPTIMISM = exports.USDC_NATIVE_OPTIMISM = exports.USDC_OPTIMISM = exports.UNI_GOERLI = exports.DAI_GOERLI = exports.WBTC_GOERLI = exports.USDT_GOERLI = exports.USDC_GOERLI = exports.DAI_SEPOLIA = exports.USDC_SEPOLIA = exports.LIDO_MAINNET = exports.AAVE_MAINNET = exports.UNI_MAINNET = exports.FEI_MAINNET = exports.DAI_MAINNET = exports.WBTC_MAINNET = exports.USDT_MAINNET = exports.USDC_MAINNET = exports.USDC_SEI_MAINNET = exports.USDT_SEI_MAINNET = void 0;
exports.WNATIVE_ON = exports.USDC_ON = exports.USDT_ON = exports.DAI_ON = exports.TokenProvider = exports.USDC_ZORA = exports.USDB_BLAST = exports.WBTC_MOONBEAM = exports.DAI_MOONBEAM = exports.WGLMR_MOONBEAM = exports.USDC_MOONBEAM = exports.WBTC_GNOSIS = exports.WXDAI_GNOSIS = exports.USDC_ETHEREUM_GNOSIS = exports.USDC_BASE_GOERLI = exports.USDC_NATIVE_BASE = exports.USDC_BASE = exports.USDC_NATIVE_AVAX = exports.USDC_BRIDGED_AVAX = exports.USDC_AVAX = exports.DAI_AVAX = exports.CEUR_CELO_ALFAJORES = exports.CUSD_CELO_ALFAJORES = exports.DAI_CELO_ALFAJORES = exports.CELO_ALFAJORES = exports.CEUR_CELO = exports.USDC_NATIVE_CELO = exports.USDC_WORMHOLE_CELO = exports.USDC_CELO = exports.CUSD_CELO = exports.DAI_CELO = exports.CELO = exports.USDT_BNB = exports.USDC_BNB = exports.ETH_BNB = exports.DAI_BNB = exports.BUSD_BNB = exports.BTC_BNB = void 0;
const abi_1 = require("@ethersproject/abi");
const strings_1 = require("@ethersproject/strings");
const dswap_sdk_core_1 = require("@miljan9602/dswap-sdk-core");
const lodash_1 = __importDefault(require("lodash"));
// @ts-ignore
const IERC20Metadata__factory_1 = require("../types/v3/factories/IERC20Metadata__factory");
const util_1 = require("../util");
exports.USDT_SEI_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.SEI_MAINNET, '0xb75d0b03c06a926e488e2659df1a861f860bd3d1', 6, 'USDT', 'Tether USD');
exports.USDC_SEI_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.SEI_MAINNET, '0x3894085ef7ff0f0aedf52e2a2704928d1ec074f1', 6, 'USDC', 'USD//C');
// Some well known tokens on each chain for seeding cache / testing.
exports.USDC_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C');
exports.USDT_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD');
exports.WBTC_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin');
exports.FEI_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD');
exports.UNI_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 18, 'UNI', 'Uniswap');
exports.AAVE_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', 18, 'AAVE', 'Aave Token');
exports.LIDO_MAINNET = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MAINNET, '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', 18, 'LDO', 'Lido DAO Token');
exports.USDC_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.SEPOLIA, '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5', 18, 'USDC', 'USDC Token');
exports.DAI_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.SEPOLIA, '0x7AF17A48a6336F7dc1beF9D485139f7B6f4FB5C8', 18, 'DAI', 'DAI Token');
exports.USDC_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GOERLI, '0x07865c6e87b9f70255377e024ace6630c1eaa37f', 6, 'USDC', 'USD//C');
exports.USDT_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GOERLI, '0xe583769738b6dd4e7caf8451050d1948be717679', 18, 'USDT', 'Tether USD');
exports.WBTC_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GOERLI, '0xa0a5ad2296b38bd3e3eb59aaeaf1589e8d9a29a9', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GOERLI, '0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844', 18, 'DAI', 'Dai Stablecoin');
exports.UNI_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GOERLI, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI', 'Uni token');
exports.USDC_OPTIMISM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', 6, 'USDC', 'USD//C.e');
exports.USDC_NATIVE_OPTIMISM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', 6, 'USDC', 'USD//C');
exports.USDT_OPTIMISM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', 6, 'USDT', 'Tether USD');
exports.WBTC_OPTIMISM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0x68f180fcCe6836688e9084f035309E29Bf0A2095', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_OPTIMISM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin');
exports.OP_OPTIMISM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000042', 18, 'OP', 'Optimism');
exports.USDC_OPTIMISM_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E', 6, 'USDC', 'USD//C');
exports.USDT_OPTIMISM_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x853eb4bA5D0Ba2B77a0A5329Fd2110d5CE149ECE', 6, 'USDT', 'Tether USD');
exports.WBTC_OPTIMISM_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI, '0xe0a592353e81a94Db6E3226fD4A99F881751776a', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_OPTIMISM_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin');
exports.USDC_OPTIMISM_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E', 6, 'USDC', 'USD//C');
exports.USDT_OPTIMISM_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0x853eb4bA5D0Ba2B77a0A5329Fd2110d5CE149ECE', 6, 'USDT', 'Tether USD');
exports.WBTC_OPTIMISM_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0xe0a592353e81a94Db6E3226fD4A99F881751776a', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_OPTIMISM_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin');
exports.USDC_ARBITRUM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', 6, 'USDC', 'USD//C.e');
exports.USDC_NATIVE_ARBITRUM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, 'USDC', 'USD//C');
exports.USDT_ARBITRUM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 6, 'USDT', 'Tether USD');
exports.WBTC_ARBITRUM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_ARBITRUM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai Stablecoin');
exports.ARB_ARBITRUM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_ONE, '0x912CE59144191C1204E64559FE8253a0e49E6548', 18, 'ARB', 'Arbitrum');
exports.DAI_ARBITRUM_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI, '0x0000000000000000000000000000000000000000', // TODO: add address
18, 'DAI', 'Dai Stablecoin');
exports.DAI_ARBITRUM_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA, '0xc3826E277485c33F3D99C9e0CBbf8449513210EE', 18, 'DAI', 'Dai Stablecoin');
// Bridged version of official Goerli USDC
exports.USDC_ARBITRUM_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI, '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892', 6, 'USDC', 'USD//C');
// Bridged version of official Sepolia USDC
exports.USDC_ARBITRUM_SEPOLIA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA, '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', 6, 'USDC', 'USD//C');
//polygon tokens
exports.WMATIC_POLYGON = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped MATIC');
exports.WETH_POLYGON = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON, '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 18, 'WETH', 'Wrapped Ether');
exports.USDC_POLYGON = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 'USDC', 'USD//C.e');
exports.USDC_NATIVE_POLYGON = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON, '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', 6, 'USDC', 'USD//C');
exports.DAI_POLYGON = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin');
//polygon mumbai tokens
exports.WMATIC_POLYGON_MUMBAI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON_MUMBAI, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC');
exports.USDC_POLYGON_MUMBAI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON_MUMBAI, '0xe11a86849d99f524cac3e7a0ec1241828e332c62', 6, 'USDC', 'USD//C');
exports.DAI_POLYGON_MUMBAI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON_MUMBAI, '0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f', 18, 'DAI', 'Dai Stablecoin');
exports.WETH_POLYGON_MUMBAI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.POLYGON_MUMBAI, '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa', 18, 'WETH', 'Wrapped Ether');
// BNB chain Tokens
exports.BTC_BNB = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BNB, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance BTC');
exports.BUSD_BNB = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BNB, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD');
exports.DAI_BNB = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BNB, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'DAI');
exports.ETH_BNB = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BNB, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'ETH');
exports.USDC_BNB = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BNB, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USDC');
exports.USDT_BNB = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BNB, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'USDT');
// Celo Tokens
exports.CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0x471EcE3750Da237f93B8E339c536989b8978a438', 18, 'CELO', 'Celo native asset');
exports.DAI_CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0xE4fE50cdD716522A56204352f00AA110F731932d', 18, 'DAI', 'Dai Stablecoin');
exports.CUSD_CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'CUSD', 'Celo Dollar Stablecoin');
exports.USDC_CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', 18, 'USDC', 'USD//C.e');
exports.USDC_WORMHOLE_CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0x37f750B7cC259A2f741AF45294f6a16572CF5cAd', 18, 'USDC', 'USD//C.e');
exports.USDC_NATIVE_CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'USDC', 'USD//C');
exports.CEUR_CELO = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO, '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', 18, 'CEUR', 'Celo Euro Stablecoin');
// Celo Alfajores Tokens
exports.CELO_ALFAJORES = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO_ALFAJORES, '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', 18, 'CELO', 'Celo native asset');
exports.DAI_CELO_ALFAJORES = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO_ALFAJORES, '0x7d91E51C8F218f7140188A155f5C75388630B6a8', 18, 'DAI', 'Dai Stablecoin');
exports.CUSD_CELO_ALFAJORES = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO_ALFAJORES, '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', 18, 'CUSD', 'Celo Dollar Stablecoin');
exports.CEUR_CELO_ALFAJORES = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.CELO_ALFAJORES, '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F', 18, 'CEUR', 'Celo Euro Stablecoin');
// Avalanche Tokens
exports.DAI_AVAX = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI.e', 'DAI.e Token');
exports.USDC_AVAX = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.AVALANCHE, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USDC Token');
exports.USDC_BRIDGED_AVAX = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.AVALANCHE, '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', 6, 'USDC', 'USDC Token');
exports.USDC_NATIVE_AVAX = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.AVALANCHE, '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', 6, 'USDC', 'USDC Token');
// Base Tokens
exports.USDC_BASE = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BASE, '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', 6, 'USDbC', 'USD Base Coin');
exports.USDC_NATIVE_BASE = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BASE, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDbC', 'USD Base Coin');
// Base Goerli Tokens
exports.USDC_BASE_GOERLI = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BASE_GOERLI, '0x853154e2A5604E5C74a2546E2871Ad44932eB92C', 6, 'USDbC', 'USD Base Coin');
// Gnosis Tokens
exports.USDC_ETHEREUM_GNOSIS = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GNOSIS, '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', 6, 'USDC', 'USDC from Ethereum on Gnosis');
exports.WXDAI_GNOSIS = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GNOSIS, '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', 18, 'WXDAI', 'Wrapped XDAI on Gnosis');
exports.WBTC_GNOSIS = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.GNOSIS, '0x8e5bbbb09ed1ebde8674cda39a0c169401db4252', 8, 'WBTC', 'Wrapped BTC from Ethereum on Gnosis');
// Moonbeam Tokens
exports.USDC_MOONBEAM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MOONBEAM, '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', 6, 'USDC', 'USD Coin bridged using Multichain');
exports.WGLMR_MOONBEAM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MOONBEAM, '0xAcc15dC74880C9944775448304B263D191c6077F', 18, 'WGLMR', 'Wrapped GLMR');
exports.DAI_MOONBEAM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MOONBEAM, '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', 6, 'DAI', 'Dai on moonbeam bridged using Multichain');
exports.WBTC_MOONBEAM = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.MOONBEAM, '0x922D641a426DcFFaeF11680e5358F34d97d112E1', 8, 'WBTC', 'Wrapped BTC bridged using Multichain');
// Blast Tokens
exports.USDB_BLAST = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.BLAST, '0x4300000000000000000000000000000000000003', 18, 'USDB', 'USD Blast');
exports.USDC_ZORA = new dswap_sdk_core_1.Token(dswap_sdk_core_1.ChainId.ZORA, '0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4', 6, 'USDzC', 'USD Coin (Bridged from Ethereum)');
class TokenProvider {
    constructor(chainId, multicall2Provider) {
        this.chainId = chainId;
        this.multicall2Provider = multicall2Provider;
    }
    async getTokenSymbol(addresses, providerConfig) {
        let result;
        let isBytes32 = false;
        try {
            result =
                await this.multicall2Provider.callSameFunctionOnMultipleContracts({
                    addresses,
                    contractInterface: IERC20Metadata__factory_1.IERC20Metadata__factory.createInterface(),
                    functionName: 'symbol',
                    providerConfig,
                });
        }
        catch (error) {
            util_1.log.error({ addresses }, `TokenProvider.getTokenSymbol[string] failed with error ${error}. Trying with bytes32.`);
            const bytes32Interface = new abi_1.Interface([
                {
                    inputs: [],
                    name: 'symbol',
                    outputs: [
                        {
                            internalType: 'bytes32',
                            name: '',
                            type: 'bytes32',
                        },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                },
            ]);
            try {
                result =
                    await this.multicall2Provider.callSameFunctionOnMultipleContracts({
                        addresses,
                        contractInterface: bytes32Interface,
                        functionName: 'symbol',
                        providerConfig,
                    });
                isBytes32 = true;
            }
            catch (error) {
                util_1.log.fatal({ addresses }, `TokenProvider.getTokenSymbol[bytes32] failed with error ${error}.`);
                throw new Error('[TokenProvider.getTokenSymbol] Impossible to fetch token symbol.');
            }
        }
        return { result, isBytes32 };
    }
    async getTokenDecimals(addresses, providerConfig) {
        return this.multicall2Provider.callSameFunctionOnMultipleContracts({
            addresses,
            contractInterface: IERC20Metadata__factory_1.IERC20Metadata__factory.createInterface(),
            functionName: 'decimals',
            providerConfig,
        });
    }
    async getTokens(_addresses, providerConfig) {
        const addressToToken = {};
        const symbolToToken = {};
        const addresses = (0, lodash_1.default)(_addresses)
            .map((address) => address.toLowerCase())
            .uniq()
            .value();
        if (addresses.length > 0) {
            const [symbolsResult, decimalsResult] = await Promise.all([
                this.getTokenSymbol(addresses, providerConfig),
                this.getTokenDecimals(addresses, providerConfig),
            ]);
            const isBytes32 = symbolsResult.isBytes32;
            const { results: symbols } = symbolsResult.result;
            const { results: decimals } = decimalsResult;
            for (let i = 0; i < addresses.length; i++) {
                const address = addresses[i];
                const symbolResult = symbols[i];
                const decimalResult = decimals[i];
                if (!(symbolResult === null || symbolResult === void 0 ? void 0 : symbolResult.success) || !(decimalResult === null || decimalResult === void 0 ? void 0 : decimalResult.success)) {
                    util_1.log.info({
                        symbolResult,
                        decimalResult,
                    }, `Dropping token with address ${address} as symbol or decimal are invalid`);
                    continue;
                }
                const symbol = isBytes32
                    ? (0, strings_1.parseBytes32String)(symbolResult.result[0])
                    : symbolResult.result[0];
                const decimal = decimalResult.result[0];
                addressToToken[address.toLowerCase()] = new dswap_sdk_core_1.Token(this.chainId, address, decimal, symbol);
                symbolToToken[symbol.toLowerCase()] =
                    addressToToken[address.toLowerCase()];
            }
            util_1.log.info(`Got token symbol and decimals for ${Object.values(addressToToken).length} out of ${addresses.length} tokens on-chain ${providerConfig ? `as of: ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}` : ''}`);
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
exports.TokenProvider = TokenProvider;
const DAI_ON = (chainId) => {
    switch (chainId) {
        case dswap_sdk_core_1.ChainId.MAINNET:
            return exports.DAI_MAINNET;
        case dswap_sdk_core_1.ChainId.GOERLI:
            return exports.DAI_GOERLI;
        case dswap_sdk_core_1.ChainId.SEPOLIA:
            return exports.DAI_SEPOLIA;
        case dswap_sdk_core_1.ChainId.OPTIMISM:
            return exports.DAI_OPTIMISM;
        case dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return exports.DAI_OPTIMISM_GOERLI;
        case dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
            return exports.DAI_OPTIMISM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.ARBITRUM_ONE:
            return exports.DAI_ARBITRUM;
        case dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI:
            return exports.DAI_ARBITRUM_GOERLI;
        case dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return exports.DAI_ARBITRUM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.POLYGON:
            return exports.DAI_POLYGON;
        case dswap_sdk_core_1.ChainId.POLYGON_MUMBAI:
            return exports.DAI_POLYGON_MUMBAI;
        case dswap_sdk_core_1.ChainId.CELO:
            return exports.DAI_CELO;
        case dswap_sdk_core_1.ChainId.CELO_ALFAJORES:
            return exports.DAI_CELO_ALFAJORES;
        case dswap_sdk_core_1.ChainId.MOONBEAM:
            return exports.DAI_MOONBEAM;
        case dswap_sdk_core_1.ChainId.BNB:
            return exports.DAI_BNB;
        case dswap_sdk_core_1.ChainId.AVALANCHE:
            return exports.DAI_AVAX;
        default:
            throw new Error(`Chain id: ${chainId} not supported`);
    }
};
exports.DAI_ON = DAI_ON;
const USDT_ON = (chainId) => {
    switch (chainId) {
        case dswap_sdk_core_1.ChainId.MAINNET:
            return exports.USDT_MAINNET;
        case dswap_sdk_core_1.ChainId.GOERLI:
            return exports.USDT_GOERLI;
        case dswap_sdk_core_1.ChainId.OPTIMISM:
            return exports.USDT_OPTIMISM;
        case dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return exports.USDT_OPTIMISM_GOERLI;
        case dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
            return exports.USDT_OPTIMISM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.ARBITRUM_ONE:
            return exports.USDT_ARBITRUM;
        case dswap_sdk_core_1.ChainId.BNB:
            return exports.USDT_BNB;
        case dswap_sdk_core_1.ChainId.SEI_MAINNET:
            return exports.USDT_SEI_MAINNET;
        default:
            throw new Error(`Chain id: ${chainId} not supported`);
    }
};
exports.USDT_ON = USDT_ON;
const USDC_ON = (chainId) => {
    switch (chainId) {
        case dswap_sdk_core_1.ChainId.MAINNET:
            return exports.USDC_MAINNET;
        case dswap_sdk_core_1.ChainId.GOERLI:
            return exports.USDC_GOERLI;
        case dswap_sdk_core_1.ChainId.SEPOLIA:
            return exports.USDC_SEPOLIA;
        case dswap_sdk_core_1.ChainId.OPTIMISM:
            return exports.USDC_OPTIMISM;
        case dswap_sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return exports.USDC_OPTIMISM_GOERLI;
        case dswap_sdk_core_1.ChainId.OPTIMISM_SEPOLIA:
            return exports.USDC_OPTIMISM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.ARBITRUM_ONE:
            return exports.USDC_ARBITRUM;
        case dswap_sdk_core_1.ChainId.ARBITRUM_GOERLI:
            return exports.USDC_ARBITRUM_GOERLI;
        case dswap_sdk_core_1.ChainId.ARBITRUM_SEPOLIA:
            return exports.USDC_ARBITRUM_SEPOLIA;
        case dswap_sdk_core_1.ChainId.POLYGON:
            return exports.USDC_POLYGON;
        case dswap_sdk_core_1.ChainId.POLYGON_MUMBAI:
            return exports.USDC_POLYGON_MUMBAI;
        case dswap_sdk_core_1.ChainId.GNOSIS:
            return exports.USDC_ETHEREUM_GNOSIS;
        case dswap_sdk_core_1.ChainId.MOONBEAM:
            return exports.USDC_MOONBEAM;
        case dswap_sdk_core_1.ChainId.BNB:
            return exports.USDC_BNB;
        case dswap_sdk_core_1.ChainId.AVALANCHE:
            return exports.USDC_AVAX;
        case dswap_sdk_core_1.ChainId.BASE:
            return exports.USDC_BASE;
        case dswap_sdk_core_1.ChainId.BASE_GOERLI:
            return exports.USDC_BASE_GOERLI;
        case dswap_sdk_core_1.ChainId.ZORA:
            return exports.USDC_ZORA;
        case dswap_sdk_core_1.ChainId.SEI_MAINNET:
            return exports.USDC_SEI_MAINNET;
        default:
            throw new Error(`Chain id: ${chainId} not supported`);
    }
};
exports.USDC_ON = USDC_ON;
const WNATIVE_ON = (chainId) => {
    return util_1.WRAPPED_NATIVE_CURRENCY[chainId];
};
exports.WNATIVE_ON = WNATIVE_ON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rva2VuLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSw0Q0FBK0M7QUFFL0Msb0RBQTREO0FBQzVELCtEQUE0RDtBQUM1RCxvREFBdUI7QUFFdkIsYUFBYTtBQUNiLDJGQUV1RDtBQUN2RCxrQ0FBdUQ7QUErQjFDLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxzQkFBSyxDQUN2Qyx3QkFBTyxDQUFDLFdBQVcsRUFDbkIsNENBQTRDLEVBQzVDLENBQUMsRUFDRCxNQUFNLEVBQ04sWUFBWSxDQUNiLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHLElBQUksc0JBQUssQ0FDdkMsd0JBQU8sQ0FBQyxXQUFXLEVBQ25CLDRDQUE0QyxFQUM1QyxDQUFDLEVBQ0QsTUFBTSxFQUNOLFFBQVEsQ0FDVCxDQUFDO0FBRUYsb0VBQW9FO0FBQ3ZELFFBQUEsWUFBWSxHQUFHLElBQUksc0JBQUssQ0FDbkMsd0JBQU8sQ0FBQyxPQUFPLEVBQ2YsNENBQTRDLEVBQzVDLENBQUMsRUFDRCxNQUFNLEVBQ04sUUFBUSxDQUNULENBQUM7QUFFVyxRQUFBLFlBQVksR0FBRyxJQUFJLHNCQUFLLENBQ25DLHdCQUFPLENBQUMsT0FBTyxFQUNmLDRDQUE0QyxFQUM1QyxDQUFDLEVBQ0QsTUFBTSxFQUNOLFlBQVksQ0FDYixDQUFDO0FBQ1csUUFBQSxZQUFZLEdBQUcsSUFBSSxzQkFBSyxDQUNuQyx3QkFBTyxDQUFDLE9BQU8sRUFDZiw0Q0FBNEMsRUFDNUMsQ0FBQyxFQUNELE1BQU0sRUFDTixhQUFhLENBQ2QsQ0FBQztBQUNXLFFBQUEsV0FBVyxHQUFHLElBQUksc0JBQUssQ0FDbEMsd0JBQU8sQ0FBQyxPQUFPLEVBQ2YsNENBQTRDLEVBQzVDLEVBQUUsRUFDRixLQUFLLEVBQ0wsZ0JBQWdCLENBQ2pCLENBQUM7QUFDVyxRQUFBLFdB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