export const PRODUCTION_ENVIRONMENTS = {
  ADDRESS_AMP_LL: "0xca7F14F14d975bEFfEe190Cd3cD232a3a988Ab9C",
  ADDRESS_AMP_BSC: "0x16df3d8978d17fe725dc307ad14fde3b12e6da75",
  CONTRACT_ADAPTER_AMP_LL: "0xD61cfDBa73891c0C6C3a3116C552ca4A94911b0d",
  EXPLORER_SCAN_BSC: "https://bscscan.com/",
  EXPLORER_SCAN_LL: "https://phoenix.lightlink.io/",
  EXPLORER_LAYERZERO_SCAN: "https://layerzeroscan.com/",
  DROPDOWN_CHAINS: [
    { value: 30309, label: "Lightlink Phoenix Mainnet", chain: "lightlink", chainId: 1890 },
    { value: 30102, label: "BNB Smart Chain Mainnet", chain: "bnb", chainId: 56 },
  ],
  API_LAYERZERO: 'https://scan.layerzero-api.com',
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
        WRONG_NETWORK: "Please connect to Lightlink Phoenix Mainnet",
      },
    },
  },
};
