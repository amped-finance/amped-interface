import { COMPOSER_MIF_ABI } from "config/contracts/composer.mif.abi";
import { ERC20_ABI } from "config/contracts/erc20.abi";
import { OFT_ABI } from "config/contracts/oft.abi";
import { QUERIER_ABI } from "config/contracts/querier.abi";

export const STAGE_ENVIRONMENTS = {
  ADDRESS_AMP_LL: "0xBC9ACD369C2b5997622818946192b02Ff26a3B5d",
  ADDRESS_AMP_BSC: "0x713995e41f9687c015d5dd7e542a5354759c8800",
  CONTRACT_ADAPTER_AMP_LL: "0x9dD06101b15B365F66091716b7c658FE0D620c38",
  EXPLORER_SCAN_BSC: "https://testnet.bscscan.com/",
  EXPLORER_SCAN_LL: "https://pegasus.lightlink.io/",
  EXPLORER_LAYERZERO_SCAN: "https://testnet.layerzeroscan.com/",
  DROPDOWN_CHAINS: [
    { value: 40309, label: "Lightlink Pegasus Testnet", chain: "LIGHTLINK", chainId: 1891 },
    { value: 40102, label: "BNB Smart Chain Testnet", chain: "BSC", chainId: 97 },
  ],
  API_LAYERZERO: "https://scan-testnet.layerzero-api.com",
  API: {
    ROOT_URL: "https://services-stage.pellar.io/api/v1/index-fund",
    API_KEY: "08835380-ceba-490e-a72c-9f083191220a",
  },
  URL_BRIDGE_USDT_TO_LL:
    "https://stargate.finance/bridge?dstChain=lightlink&dstToken=0x808d7c71ad2ba3FA531b068a2417C63106BC0949",
  CHAINS: {
    BSC: {
      SHORT_NAME: "BSC Testnet",
      NAME: "BNB Smart Chain Testnet",
      RPC: "https://bsc-testnet.publicnode.com",
      CHAIN_ID: "0x61",
      EXPLORER_URL: "https://testnet.bscscan.com",
      NATIVE_CURRENCY: {
        NAME: "BNB",
        SYMBOL: "BNB",
        DECIMALS: 18,
      },
      NOTIFICATION_MESSAGE: {
        WRONG_NETWORK: "Please connect to Binance Smart Chain Testnet",
      },
    },
    LIGHTLINK: {
      SHORT_NAME: "Lightlink Testnet",
      NAME: "Lightlink Pegasus Testnet",
      RPC: "https://replicator.pegasus.lightlink.io/rpc/v1",
      CHAIN_ID: "0x763",
      EXPLORER_URL: "https://pegasus.lightlink.io",
      NATIVE_CURRENCY: {
        NAME: "ETH",
        SYMBOL: "ETH",
        DECIMALS: 18,
      },
      TOKENS: {},
      NOTIFICATION_MESSAGE: {
        WRONG_NETWORK: "Please connect to Lightlink Pegasus Testnet",
      },
    },
  },
  LAYERZERO: {
    SCAN: "https://testnet.layerzeroscan.com",
    API: "https://scan-testnet.layerzero-api.com",
  },

  CHAINS_MIF: {
    BSC: {
      KEY: "BSC",
      SCAN: "https://testnet.bscscan.com",

      EID: 40102,

      ID: 97,

      LZ: {
        USDT: {
          LZ_CONTRACT: {
            ADDRESS: "0xf057608f3Edb3B44be266324fd56aD5197e229d5",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0xf057608f3Edb3B44be266324fd56aD5197e229d5",
            ABI: ERC20_ABI,
          },
        },

        MIF: {
          LZ_CONTRACT: {
            ADDRESS: "0x4d0bD1D8DC9678994A2Fb955C2F6E0C52aCA6F4b",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x4d0bD1D8DC9678994A2Fb955C2F6E0C52aCA6F4b",
            ABI: ERC20_ABI,
          },
        },
      },

      INDEX_FUND: {
        REGISTRY: {
          ADDRESS: "0xf7902bCF39a3C9bd69d942CE02bf19D950791CFB",
        },
        COMPOSER_CONTRACT: {
          ADDRESS: "0xF4A4071378096Fe65aebB4e97954A0784f1B9171",
          ABI: COMPOSER_MIF_ABI,
        },
        QUERIER_CONTRACT: {
          ADDRESS: "0x17706B4A2C5c31b59c4D1F44C77867e8cAc975d1",
          ABI: QUERIER_ABI,
        },
      },
    },

    LIGHTLINK: {
      KEY: "LIGHTLINK",
      SCAN: "https://pegasus.lightlink.io",

      EID: 40309,

      ID: 1891,

      LZ: {
        USDT: {
          LZ_CONTRACT: {
            ADDRESS: "0x484C62BaC16cD45680A7a8A0000354728efbd42a",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x484C62BaC16cD45680A7a8A0000354728efbd42a",
            ABI: ERC20_ABI,
          },
        },

        MIF: {
          LZ_CONTRACT: {
            ADDRESS: "0x47fDe4d7013b1bd249A968aD7Ca51eFb545161C0",
            ABI: OFT_ABI,
          },
          TOKEN_CONTRACT: {
            ADDRESS: "0x47fDe4d7013b1bd249A968aD7Ca51eFb545161C0",
            ABI: ERC20_ABI,
          },
        },
      },
    },
  },
};
