/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  DragonswapFactory,
  DragonswapFactoryInterface,
} from "../DragonswapFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeToSetter",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feeTo",
        type: "address",
      },
    ],
    name: "FeeToSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feeToSetter",
        type: "address",
      },
    ],
    name: "FeeToSetterSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pair",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "PairCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allPairs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "allPairsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
    ],
    name: "createPair",
    outputs: [
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeTo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "feeToSetter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getPair",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_feeTo",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_feeToSetter",
        type: "address",
      },
    ],
    name: "setFeeToSetter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516137333803806137338339818101604052602081101561003357600080fd5b50516001600160a01b03811661004857600080fd5b600180546001600160a01b0319166001600160a01b03929092169190911790556136bc806100776000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063a2e74af61161005b578063a2e74af6146100fd578063c9c6539614610132578063e6a439051461016d578063f46901ed146101a857610088565b8063017e7e581461008d578063094b7415146100be5780631e3dd18b146100c6578063574f2ba3146100e3575b600080fd5b6100956101db565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6100956101f7565b610095600480360360208110156100dc57600080fd5b5035610213565b6100eb610247565b60408051918252519081900360200190f35b6101306004803603602081101561011357600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661024d565b005b6100956004803603604081101561014857600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610342565b6100956004803603604081101561018357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610795565b610130600480360360208110156101be57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166107c8565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b60015473ffffffffffffffffffffffffffffffffffffffff1681565b6003818154811061022057fe5b60009182526020909120015473ffffffffffffffffffffffffffffffffffffffff16905081565b60035490565b60015473ffffffffffffffffffffffffffffffffffffffff1633146102d357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f447261676f6e737761703a20464f5242494444454e0000000000000000000000604482015290519081900360640190fd5b600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040517f8008d425488ae0d33c41ff5a8b69005015ef67d5d450003935eb06ab91e0679c90600090a250565b60008173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156103df57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f447261676f6e737761703a204944454e544943414c5f41444452455353455300604482015290519081900360640190fd5b6000808373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161061041c57838561041f565b84845b909250905073ffffffffffffffffffffffffffffffffffffffff82166104a657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f447261676f6e737761703a205a45524f5f414444524553530000000000000000604482015290519081900360640190fd5b73ffffffffffffffffffffffffffffffffffffffff82811660009081526002602090815260408083208585168452909152902054161561054757604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f447261676f6e737761703a20504149525f455849535453000000000000000000604482015290519081900360640190fd5b606060405180602001610559906108bb565b6020820181038252601f19601f82011660405250905060008383604051602001808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660601b81526014018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660601b815260140192505050604051602081830303815290604052805190602001209050808251602084016000f5604080517f485cc95500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8781166004830152868116602483015291519297509087169163485cc9559160448082019260009290919082900301818387803b15801561068657600080fd5b505af115801561069a573d6000803e3d6000fd5b5050505073ffffffffffffffffffffffffffffffffffffffff84811660008181526002602081815260408084208987168086529083528185208054978d167fffffffffffffffffffffffff000000000000000000000000000000000000000098891681179091559383528185208686528352818520805488168517905560038054600181018255958190527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b90950180549097168417909655925483519283529082015281517f0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9929181900390910190a35050505092915050565b600260209081526000928352604080842090915290825290205473ffffffffffffffffffffffffffffffffffffffff1681565b60015473ffffffffffffffffffffffffffffffffffffffff16331461084e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f447261676f6e737761703a20464f5242494444454e0000000000000000000000604482015290519081900360640190fd5b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8316908117825560405190917fe7ba424f407983edfb652af33e51f926d1d41a22bb4850c65eb21c02e378957c91a250565b612dbf806108c98339019056fe60806040526001600c5534801561001557600080fd5b506040514690806052612d6d8239604080519182900360520182208282018252600a8352690447261676f6e737761760b41b6020938401528151808301835260018152603160f81b908401528151808401919091527f5d0d86544e6bbf20a164147d5b9b8844cc0a7f34cbf5b6e2ee2ca5c190e99458818301527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015260808101949094523060a0808601919091528151808603909101815260c09094019052825192019190912060035550600580546001600160a01b03191633179055612c68806101056000396000f3fe608060405234801561001057600080fd5b50600436106101b95760003560e01c80636a627842116100f9578063ba9a7a5611610097578063d21220a711610071578063d21220a7146105da578063d505accf146105e2578063dd62ed3e14610640578063fff6cae91461067b576101b9565b8063ba9a7a5614610597578063bc25cf771461059f578063c45a0155146105d2576101b9565b80637ecebe00116100d35780637ecebe00146104d757806389afcb441461050a57806395d89b4114610556578063a9059cbb1461055e576101b9565b80636a6278421461046957806370a082311461049c5780637464fc3d146104cf576101b9565b806323b872dd116101665780633644e515116101405780633644e51514610416578063485cc9551461041e5780635909c0d5146104595780635a3d549314610461576101b9565b806323b872dd146103ad57806330adf81f146103f0578063313ce567146103f8576101b9565b8063095ea7b311610197578063095ea7b3146103155780630dfe16811461036257806318160ddd14610393576101b9565b8063022c0d9f146101be57806306fdde03146102595780630902f1ac146102d6575b600080fd5b610257600480360360808110156101d457600080fd5b81359160208101359173ffffffffffffffffffffffffffffffffffffffff604083013516919081019060808101606082013564010000000081111561021857600080fd5b82018360208201111561022a57600080fd5b8035906020019184600183028401116401000000008311171561024c57600080fd5b509092509050610683565b005b610261610d57565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561029b578181015183820152602001610283565b50505050905090810190601f1680156102c85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102de610d90565b604080516dffffffffffffffffffffffffffff948516815292909316602083015263ffffffff168183015290519081900360600190f35b61034e6004803603604081101561032b57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610de5565b604080519115158252519081900360200190f35b61036a610dfc565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b61039b610e18565b60408051918252519081900360200190f35b61034e600480360360608110156103c357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160208101359091169060400135610e1e565b61039b610f39565b610400610f5d565b6040805160ff9092168252519081900360200190f35b61039b610f62565b6102576004803603604081101561043457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610f68565b61039b611041565b61039b611047565b61039b6004803603602081101561047f57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661104d565b61039b600480360360208110156104b257600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16611407565b61039b611419565b61039b600480360360208110156104ed57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661141f565b61053d6004803603602081101561052057600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16611431565b6040805192835260208301919091528051918290030190f35b6102616118ce565b61034e6004803603604081101561057457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135611907565b61039b611914565b610257600480360360208110156105b557600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661191a565b61036a611b10565b61036a611b2c565b610257600480360360e08110156105f857600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160208101359091169060408101359060608101359060ff6080820135169060a08101359060c00135611b48565b61039b6004803603604081101561065657600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516611e14565b610257611e31565b600c546001146106f457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f447261676f6e737761703a204c4f434b45440000000000000000000000000000604482015290519081900360640190fd5b6000600c55841515806107075750600084115b61075c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526026815260200180612be56026913960400191505060405180910390fd5b600080610767610d90565b5091509150816dffffffffffffffffffffffffffff168710801561079a5750806dffffffffffffffffffffffffffff1686105b6107ef576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180612b9a6022913960400191505060405180910390fd5b600654600754600091829173ffffffffffffffffffffffffffffffffffffffff91821691908116908916821480159061085457508073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff1614155b6108bf57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f447261676f6e737761703a20494e56414c49445f544f00000000000000000000604482015290519081900360640190fd5b8a156108d0576108d0828a8d612017565b89156108e1576108e1818a8c612017565b86156109c3578873ffffffffffffffffffffffffffffffffffffffff166399cfb2a4338d8d8c8c6040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001806020018281038252848482818152602001925080828437600081840152601f19601f8201169050808301925050509650505050505050600060405180830381600087803b1580156109aa57600080fd5b505af11580156109be573d6000803e3d6000fd5b505050505b604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905173ffffffffffffffffffffffffffffffffffffffff8416916370a08231916024808301926020929190829003018186803b158015610a2f57600080fd5b505afa158015610a43573d6000803e3d6000fd5b505050506040513d6020811015610a5957600080fd5b5051604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905191955073ffffffffffffffffffffffffffffffffffffffff8316916370a0823191602480820192602092909190829003018186803b158015610acb57600080fd5b505afa158015610adf573d6000803e3d6000fd5b505050506040513d6020811015610af557600080fd5b5051925060009150506dffffffffffffffffffffffffffff85168a90038311610b1f576000610b35565b89856dffffffffffffffffffffffffffff160383035b9050600089856dffffffffffffffffffffffffffff16038311610b59576000610b6f565b89856dffffffffffffffffffffffffffff160383035b90506000821180610b805750600081115b610bd5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526025815260200180612b756025913960400191505060405180910390fd5b6000610c09610beb84600363ffffffff61222416565b610bfd876103e863ffffffff61222416565b9063ffffffff6122aa16565b90506000610c21610beb84600363ffffffff61222416565b9050610c59620f4240610c4d6dffffffffffffffffffffffffffff8b8116908b1663ffffffff61222416565b9063ffffffff61222416565b610c69838363ffffffff61222416565b1015610cd657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f447261676f6e737761703a204b00000000000000000000000000000000000000604482015290519081900360640190fd5b5050610ce48484888861231c565b60408051838152602081018390528082018d9052606081018c9052905173ffffffffffffffffffffffffffffffffffffffff8b169133917fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229181900360800190a350506001600c55505050505050505050565b6040518060400160405280600a81526020017f447261676f6e737761700000000000000000000000000000000000000000000081525081565b6008546dffffffffffffffffffffffffffff808216926e0100000000000000000000000000008304909116917c0100000000000000000000000000000000000000000000000000000000900463ffffffff1690565b6000610df23384846125d8565b5060015b92915050565b60065473ffffffffffffffffffffffffffffffffffffffff1681565b60005481565b73ffffffffffffffffffffffffffffffffffffffff831660009081526002602090815260408083203384529091528120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14610f245773ffffffffffffffffffffffffffffffffffffffff84166000908152600260209081526040808320338452909152812054610eb6908463ffffffff6122aa16565b73ffffffffffffffffffffffffffffffffffffffff8616600081815260026020908152604080832033808552908352928190208590558051858152905194955091937f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505b610f2f848484612647565b5060019392505050565b7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b601281565b60035481565b60055473ffffffffffffffffffffffffffffffffffffffff163314610fee57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f447261676f6e737761703a20464f5242494444454e0000000000000000000000604482015290519081900360640190fd5b6006805473ffffffffffffffffffffffffffffffffffffffff9384167fffffffffffffffffffffffff00000000000000000000000000000000000000009182161790915560078054929093169116179055565b60095481565b600a5481565b6000600c546001146110c057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f447261676f6e737761703a204c4f434b45440000000000000000000000000000604482015290519081900360640190fd5b6000600c819055806110d0610d90565b50600654604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905193955091935060009273ffffffffffffffffffffffffffffffffffffffff909116916370a08231916024808301926020929190829003018186803b15801561114a57600080fd5b505afa15801561115e573d6000803e3d6000fd5b505050506040513d602081101561117457600080fd5b5051600754604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905192935060009273ffffffffffffffffffffffffffffffffffffffff909216916370a0823191602480820192602092909190829003018186803b1580156111ed57600080fd5b505afa158015611201573d6000803e3d6000fd5b505050506040513d602081101561121757600080fd5b50519050600061123d836dffffffffffffffffffffffffffff871663ffffffff6122aa16565b90506000611261836dffffffffffffffffffffffffffff871663ffffffff6122aa16565b9050600061126f8787612728565b600054909150806112ac576112986103e8610bfd611293878763ffffffff61222416565b6128be565b98506112a760006103e8612910565b611309565b6113066dffffffffffffffffffffffffffff89166112d0868463ffffffff61222416565b816112d757fe5b046dffffffffffffffffffffffffffff89166112f9868563ffffffff61222416565b8161130057fe5b046129c0565b98505b60008911611362576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526029815260200180612c0b6029913960400191505060405180910390fd5b61136c8a8a612910565b61137886868a8a61231c565b81156113ba576008546113b6906dffffffffffffffffffffffffffff808216916e01000000000000000000000000000090041663ffffffff61222416565b600b555b6040805185815260208101859052815133927f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f928290030190a250506001600c5550949695505050505050565b60016020526000908152604090205481565b600b5481565b60046020526000908152604090205481565b600080600c546001146114a557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f447261676f6e737761703a204c4f434b45440000000000000000000000000000604482015290519081900360640190fd5b6000600c819055806114b5610d90565b50600654600754604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905194965092945073ffffffffffffffffffffffffffffffffffffffff9182169391169160009184916370a08231916024808301926020929190829003018186803b15801561153757600080fd5b505afa15801561154b573d6000803e3d6000fd5b505050506040513d602081101561156157600080fd5b5051604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905191925060009173ffffffffffffffffffffffffffffffffffffffff8516916370a08231916024808301926020929190829003018186803b1580156115d557600080fd5b505afa1580156115e9573d6000803e3d6000fd5b505050506040513d60208110156115ff57600080fd5b50513060009081526001602052604081205491925061161e8888612728565b60005490915080611635848763ffffffff61222416565b8161163c57fe5b049a5080611650848663ffffffff61222416565b8161165757fe5b04995060008b11801561166a575060008a115b6116bf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526029815260200180612bbc6029913960400191505060405180910390fd5b6116c930846129d8565b6116d4878d8d612017565b6116df868d8c612017565b604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905173ffffffffffffffffffffffffffffffffffffffff8916916370a08231916024808301926020929190829003018186803b15801561174b57600080fd5b505afa15801561175f573d6000803e3d6000fd5b505050506040513d602081101561177557600080fd5b5051604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905191965073ffffffffffffffffffffffffffffffffffffffff8816916370a0823191602480820192602092909190829003018186803b1580156117e757600080fd5b505afa1580156117fb573d6000803e3d6000fd5b505050506040513d602081101561181157600080fd5b5051935061182185858b8b61231c565b81156118635760085461185f906dffffffffffffffffffffffffffff808216916e01000000000000000000000000000090041663ffffffff61222416565b600b555b604080518c8152602081018c9052815173ffffffffffffffffffffffffffffffffffffffff8f169233927fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496929081900390910190a35050505050505050506001600c81905550915091565b6040518060400160405280600281526020017f445300000000000000000000000000000000000000000000000000000000000081525081565b6000610df2338484612647565b6103e881565b600c5460011461198b57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f447261676f6e737761703a204c4f434b45440000000000000000000000000000604482015290519081900360640190fd5b6000600c55600654600754600854604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905173ffffffffffffffffffffffffffffffffffffffff9485169490931692611a679285928792611a62926dffffffffffffffffffffffffffff169185916370a0823191602480820192602092909190829003018186803b158015611a2a57600080fd5b505afa158015611a3e573d6000803e3d6000fd5b505050506040513d6020811015611a5457600080fd5b50519063ffffffff6122aa16565b612017565b600854604080517f70a082310000000000000000000000000000000000000000000000000000000081523060048201529051611b069284928792611a62926e01000000000000000000000000000090046dffffffffffffffffffffffffffff169173ffffffffffffffffffffffffffffffffffffffff8616916370a0823191602480820192602092909190829003018186803b158015611a2a57600080fd5b50506001600c5550565b60055473ffffffffffffffffffffffffffffffffffffffff1681565b60075473ffffffffffffffffffffffffffffffffffffffff1681565b42841015611bb757604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f447261676f6e737761703a204558504952454400000000000000000000000000604482015290519081900360640190fd5b60035473ffffffffffffffffffffffffffffffffffffffff80891660008181526004602090815260408083208054600180820190925582517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98186015280840196909652958d166060860152608085018c905260a085019590955260c08085018b90528151808603909101815260e0850182528051908301207f19010000000000000000000000000000000000000000000000000000000000006101008601526101028501969096526101228085019690965280518085039096018652610142840180825286519683019690962095839052610162840180825286905260ff89166101828501526101a284018890526101c28401879052519193926101e2808201937fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081019281900390910190855afa158015611d18573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811615801590611d9357508873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b611dfe57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f447261676f6e737761703a20494e56414c49445f5349474e4154555245000000604482015290519081900360640190fd5b611e098989896125d8565b505050505050505050565b600260209081526000928352604080842090915290825290205481565b600c54600114611ea257604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f447261676f6e737761703a204c4f434b45440000000000000000000000000000604482015290519081900360640190fd5b6000600c55600654604080517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015290516120109273ffffffffffffffffffffffffffffffffffffffff16916370a08231916024808301926020929190829003018186803b158015611f1957600080fd5b505afa158015611f2d573d6000803e3d6000fd5b505050506040513d6020811015611f4357600080fd5b5051600754604080517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152905173ffffffffffffffffffffffffffffffffffffffff909216916370a0823191602480820192602092909190829003018186803b158015611fb657600080fd5b505afa158015611fca573d6000803e3d6000fd5b505050506040513d6020811015611fe057600080fd5b50516008546dffffffffffffffffffffffffffff808216916e01000000000000000000000000000090041661231c565b6001600c55565b604080518082018252601981527f7472616e7366657228616464726573732c75696e743235362900000000000000602091820152815173ffffffffffffffffffffffffffffffffffffffff85811660248301526044808301869052845180840390910181526064909201845291810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb000000000000000000000000000000000000000000000000000000001781529251815160009460609489169392918291908083835b6020831061211d57805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090920191602091820191016120e0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d806000811461217f576040519150601f19603f3d011682016040523d82523d6000602084013e612184565b606091505b50915091508180156121b25750805115806121b257508080602001905160208110156121af57600080fd5b50515b61221d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f447261676f6e737761703a205452414e534645525f4641494c45440000000000604482015290519081900360640190fd5b5050505050565b600081158061223f5750508082028282828161223c57fe5b04145b610df657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f64732d6d6174682d6d756c2d6f766572666c6f77000000000000000000000000604482015290519081900360640190fd5b80820382811115610df657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f64732d6d6174682d7375622d756e646572666c6f770000000000000000000000604482015290519081900360640190fd5b6dffffffffffffffffffffffffffff841180159061234857506dffffffffffffffffffffffffffff8311155b6123b357604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f447261676f6e737761703a204f564552464c4f57000000000000000000000000604482015290519081900360640190fd5b60085463ffffffff428116917c01000000000000000000000000000000000000000000000000000000009004811682039081161580159061240357506dffffffffffffffffffffffffffff841615155b801561241e57506dffffffffffffffffffffffffffff831615155b156124ce578063ffffffff166124618561243786612a9d565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff169063ffffffff612ac116565b600980547bffffffffffffffffffffffffffffffffffffffffffffffffffffffff929092169290920201905563ffffffff81166124a18461243787612a9d565b600a80547bffffffffffffffffffffffffffffffffffffffffffffffffffffffff92909216929092020190555b600880547fffffffffffffffffffffffffffffffffffff0000000000000000000000000000166dffffffffffffffffffffffffffff888116919091177fffffffff0000000000000000000000000000ffffffffffffffffffffffffffff166e0100000000000000000000000000008883168102919091177bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167c010000000000000000000000000000000000000000000000000000000063ffffffff871602179283905560408051848416815291909304909116602082015281517f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1929181900390910190a1505050505050565b73ffffffffffffffffffffffffffffffffffffffff808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526001602052604090205461267d908263ffffffff6122aa16565b73ffffffffffffffffffffffffffffffffffffffff80851660009081526001602052604080822093909355908416815220546126bf908263ffffffff612b0216565b73ffffffffffffffffffffffffffffffffffffffff80841660008181526001602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663017e7e586040518163ffffffff1660e01b815260040160206040518083038186803b15801561279357600080fd5b505afa1580156127a7573d6000803e3d6000fd5b505050506040513d60208110156127bd57600080fd5b5051600b5473ffffffffffffffffffffffffffffffffffffffff82161580159450919250906128aa5780156128a55760006128146112936dffffffffffffffffffffffffffff88811690881663ffffffff61222416565b90506000612821836128be565b9050808211156128a257600061284f612840848463ffffffff6122aa16565b6000549063ffffffff61222416565b9050600061287e83600361286a87600763ffffffff61222416565b8161287157fe5b049063ffffffff612b0216565b9050600081838161288b57fe5b049050801561289e5761289e8782612910565b5050505b50505b6128b6565b80156128b6576000600b555b505092915050565b60006003821115612901575080600160028204015b818110156128fb578091506002818285816128ea57fe5b0401816128f357fe5b0490506128d3565b5061290b565b811561290b575060015b919050565b600054612923908263ffffffff612b0216565b600090815573ffffffffffffffffffffffffffffffffffffffff831681526001602052604090205461295b908263ffffffff612b0216565b73ffffffffffffffffffffffffffffffffffffffff831660008181526001602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b60008183106129cf57816129d1565b825b9392505050565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260016020526040902054612a0e908263ffffffff6122aa16565b73ffffffffffffffffffffffffffffffffffffffff831660009081526001602052604081209190915554612a48908263ffffffff6122aa16565b600090815560408051838152905173ffffffffffffffffffffffffffffffffffffffff8516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef919081900360200190a35050565b6dffffffffffffffffffffffffffff166e0100000000000000000000000000000290565b60006dffffffffffffffffffffffffffff82167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff841681612afa57fe5b049392505050565b80820182811015610df657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f64732d6d6174682d6164642d6f766572666c6f77000000000000000000000000604482015290519081900360640190fdfe447261676f6e737761703a20494e53554646494349454e545f494e5055545f414d4f554e54447261676f6e737761703a20494e53554646494349454e545f4c4951554944495459447261676f6e737761703a20494e53554646494349454e545f4c49515549444954595f4255524e4544447261676f6e737761703a20494e53554646494349454e545f4f55545055545f414d4f554e54447261676f6e737761703a20494e53554646494349454e545f4c49515549444954595f4d494e544544a265627a7a72315820d482107e231083e2507fe0ec0f1db9e81ea248b2dbeda2faf78bfa935ecc6f6464736f6c63430005100032454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e747261637429a265627a7a72315820247d7b3040fc91038fff09b43d339977ebcb3a38ea69495f22118cabb51d6e6364736f6c63430005100032";

export class DragonswapFactory__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _feeToSetter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DragonswapFactory> {
    return super.deploy(
      _feeToSetter,
      overrides || {}
    ) as Promise<DragonswapFactory>;
  }
  getDeployTransaction(
    _feeToSetter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_feeToSetter, overrides || {});
  }
  attach(address: string): DragonswapFactory {
    return super.attach(address) as DragonswapFactory;
  }
  connect(signer: Signer): DragonswapFactory__factory {
    return super.connect(signer) as DragonswapFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DragonswapFactoryInterface {
    return new utils.Interface(_abi) as DragonswapFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DragonswapFactory {
    return new Contract(address, _abi, signerOrProvider) as DragonswapFactory;
  }
}
