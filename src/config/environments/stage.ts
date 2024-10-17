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
};
