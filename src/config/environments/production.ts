export const PRODUCTION_ENVIRONMENTS = {
  IS_PRODUCTION: true,
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
  DROPDOWN_CHAINS_INDEX: [
    { label: "COINBASE", chain: "base" },
    // { label: "BNB Smart Chain Mainnet", chain: "bsc" },
  ],
  API_LAYERZERO: "https://scan.layerzero-api.com",
  LL_SCAN: "https://phoenix.lightlink.io",
  API: {
    ROOT_URL: "https://services.pellar.io/api/v1/index-fund",
    API_KEY: "08835380-ceba-490e-a72c-9f083191220a",
  },
  LL_RPC: "https://replicator.phoenix.lightlink.io/rpc/v1",
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
};
