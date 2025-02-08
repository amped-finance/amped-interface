import { COMPOSER_MIF_ABI } from "config/contracts/composer.mif.abi";
import { ERC20_ABI } from "config/contracts/erc20.abi";
import { OFT_ABI } from "config/contracts/oft.abi";
import { QUERIER_ABI } from "config/contracts/querier.abi";

export const PRODUCTION_ENVIRONMENTS = {
  ADDRESS_AMP_LL: "0xca7F14F14d975bEFfEe190Cd3cD232a3a988Ab9C",
  ADDRESS_AMP_BSC: "0x16df3d8978d17fe725dc307ad14fde3b12e6da75",
  ADDRESS_AMP_SONIC: "0xAc611438AE5F3953DeDB47c2ea8d6650D601C1B4",
  ADDRESS_AMP_BERACHAIN: "0xAc611438AE5F3953DeDB47c2ea8d6650D601C1B4",
  CONTRACT_ADAPTER_AMP_LL: "0xD61cfDBa73891c0C6C3a3116C552ca4A94911b0d",
  EXPLORER_SCAN_BSC: "https://bscscan.com/",
  EXPLORER_SCAN_LL: "https://phoenix.lightlink.io/",
  EXPLORER_LAYERZERO_SCAN: "https://layerzeroscan.com/",
  DROPDOWN_CHAINS: [
    { value: 30309, label: "Lightlink ", chain: "LIGHTLINK", chainId: 1890 },
    { value: 30102, label: "BNB Smart Chain Mainnet", chain: "BSC", chainId: 56 },
    { value: 30310, label: "Berachain", chain: "BERACHAIN", chainId: 80094 },
    { value: 30311, label: "Sonic", chain: "SONIC", chainId: 146 },
  ],
  API_LAYERZERO: "https://scan.layerzero-api.com",
  API: {
    ROOT_URL: "https://services.pellar.io/api/v1/mif",
    API_KEY: "28f60562-699e-4886-bb29-0693c92035c8",
  },
  URL_BRIDGE_USDT_TO_LL:
    "https://stargate.finance/bridge?dstChain=lightlink&dstToken=0x808d7c71ad2ba3FA531b068a2417C63106BC0949",
  CHAINS: {
    BSC: {
      SHORT_NAME: "BSC",
      NAME: "BNB Smart Chain Mainnet",
      RPC: "https://bsc-dataseed.bnbchain.org",
      CHAIN_ID: "0x38",
      EXPLORER_URL: "https://bscscan.com",
      NATIVE_CURRENCY: {
        NAME: "BNB",
        SYMBOL: "BNB",
        DECIMALS: 18,
      },
      NOTIFICATION_MESSAGE: {
        WRONG_NETWORK: "Please connect to Binance Smart Chain Mainnet",
      },
    },
    LIGHTLINK: {
      SHORT_NAME: "Lightlink",
      NAME: "Lightlink Phoenix Mainnet",
      RPC: "https://replicator.phoenix.lightlink.io/rpc/v1",
      CHAIN_ID: "0x762",
      EXPLORER_URL: "https://phoenix.lightlink.io",
      NATIVE_CURRENCY: {
        NAME: "ETH",
        SYMBOL: "ETH",
        DECIMALS: 18,
      },
      NOTIFICATION_MESSAGE: {
        WRONG_NETWORK: "Please connect to Lightlink",
      },
    },
    BERACHAIN: {
      SHORT_NAME: "Berachain",
      NAME: "Berachain Mainnet",
      RPC: "https://rpc.berachain.com",
      CHAIN_ID: "0x13894",
      EXPLORER_URL: "https://berascan.com",
      NATIVE_CURRENCY: {
        NAME: "BERA",
        SYMBOL: "BERA",
        DECIMALS: 18,
      },
      NOTIFICATION_MESSAGE: {
        WRONG_NETWORK: "Please connect to Berachain",
      },
    },
    SONIC: {
      SHORT_NAME: "Sonic",
      NAME: "Sonic Mainnet",
      RPC: "https://rpc.soniclabs.com",
      CHAIN_ID: "0x92",
      EXPLORER_URL: "https://sonicscan.org",
      NATIVE_CURRENCY: {
        NAME: "S",
        SYMBOL: "S",
        DECIMALS: 18,
      },
      NOTIFICATION_MESSAGE: {
        WRONG_NETWORK: "Please connect to Sonic",
      },
    },
  },
  LAYERZERO: {
    SCAN: "https://layerzeroscan.com",
    API: "https://scan.layerzero-api.com",
  },

  CHAINS_MIF: {
    BSC: {
      KEY: "BSC",

      SCAN: "https://bscscan.com",

      EID: 30102,

      ID: 56,

      LZ: {
        USDT: {
          LZ_CONTRACT: {
            ADDRESS: "0x138EB30f73BC423c6455C53df6D89CB01d9eBc63",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x55d398326f99059fF775485246999027B3197955",
            ABI: ERC20_ABI,
          },
        },

        MIF: {
          LZ_CONTRACT: {
            ADDRESS: "0x0feAAc7534446C159438775a295F9c41E4c5B7Ed",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x0feAAc7534446C159438775a295F9c41E4c5B7Ed",
            ABI: ERC20_ABI,
          },
        },
      },

      INDEX_FUND: {
        REGISTRY: {
          ADDRESS: "0x53789CD7c06452C158eBe929Fa8c84eE87e0FeFA",
        },
        COMPOSER_CONTRACT: {
          ADDRESS: "0x3A5fFB8a28669AbA68B5Af8075FeDD800D5f1a84",
          ABI: COMPOSER_MIF_ABI,
        },
        QUERIER_CONTRACT: {
          ADDRESS: "0xcB7f526f55BeE3c31A2fe24ee6471ECEd0158520",
          ABI: QUERIER_ABI,
        },
      },
    },

    LIGHTLINK: {
      KEY: "LIGHTLINK",

      SCAN: "https://phoenix.lightlink.io",

      EID: 30309,

      ID: 1890,

      LZ: {
        USDT: {
          LZ_CONTRACT: {
            ADDRESS: "0x06D538690AF257Da524f25D0CD52fD85b1c2173E",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x808d7c71ad2ba3FA531b068a2417C63106BC0949",
            ABI: ERC20_ABI,
          },
        },

        MIF: {
          LZ_CONTRACT: {
            ADDRESS: "0x53789CD7c06452C158eBe929Fa8c84eE87e0FeFA",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x53789CD7c06452C158eBe929Fa8c84eE87e0FeFA",
            ABI: ERC20_ABI,
          },
        },
      },
    },
  },
};
