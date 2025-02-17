import { ethers } from "ethers";

const { parseEther } = ethers.utils;

export const ARBITRUM = 42161;
export const PEGASUS = 1891
export const PHOENIX = 1890
export const BSC = 56
export const BSCTESTNET = 97
export const UNICHAINTESTNET = 1301
export const SONIC = 146
export const BERACHAIN = 80094
// TODO take it from web3
export const DEFAULT_CHAIN_ID = PHOENIX;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [PHOENIX, SONIC, BERACHAIN];

export const ACTIVE_CHAIN_IDS = [PHOENIX, SONIC, BERACHAIN]

export const IS_NETWORK_DISABLED = {
  [ARBITRUM]: true,
  [PEGASUS]: true,
  [PHOENIX]: false,
  [BSCTESTNET]: true,
  [UNICHAINTESTNET]: true,
  [BSC]: true,
  [SONIC]: false,
  [BERACHAIN]: false
};

export const CHAIN_NAMES_MAP = {
  [ARBITRUM]: "Arbitrum",
  [PHOENIX]: "LightLink",
  [PEGASUS]: "LightLink Testnet",
  [BSCTESTNET]: "BSC Testnet",
  [UNICHAINTESTNET]: "Unichain Testnet",
  [BSC]: "BNB Smart Chain",
  [SONIC]: "Sonic",
  [BERACHAIN]: "Berachain"
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [ARBITRUM]: "0",
  [PEGASUS]: "2000000000000", // 3 times
  [PHOENIX]: "2000000", // 3 times
  [BSCTESTNET]: "0", // Changed to "0" to use network gas price
  [UNICHAINTESTNET]: "1000000", // 3 times
  [BSC]: "1000000", // 3 times
  [SONIC]: "1000000",
  [BERACHAIN]: "1000000"
};

export const MAX_GAS_PRICE_MAP = {
  [PEGASUS]: "2000000000000000",
  [PHOENIX]: "200000000000",
  [BSCTESTNET]: "20000000",
  [UNICHAINTESTNET]: "0",
  [BSC]: "0",
  [SONIC]: "1000000",
  [BERACHAIN]: "1000000"
};

export const HIGH_EXECUTION_FEES_MAP = {
  [ARBITRUM]: 3, // 3 USD
  [PEGASUS]: 10,
  [PHOENIX]: 10,
  [BSCTESTNET]: 10,
  [UNICHAINTESTNET]: 10,
  [BSC]: 10,
  [SONIC]: 10,
  [BERACHAIN]: 10
};

const constants = {
  [ARBITRUM]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },
  [PEGASUS]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDT",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.011"),
  },
  [PHOENIX]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC.SG",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.00011"),
  },

  [BSCTESTNET]: {
    nativeTokenSymbol: "BNB",
    wrappedTokenSymbol: "WBNB",
    defaultCollateralSymbol: "USDT",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.00011"),
  },

  [BSC]: {
    nativeTokenSymbol: "BNB",
    wrappedTokenSymbol: "WBNB",
    defaultCollateralSymbol: "USDT",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0011"),
  },

  [UNICHAINTESTNET]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0011"),
  },
  [SONIC]: {
    nativeTokenSymbol: "S",
    wrappedTokenSymbol: "wS",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0011"),
  },
  [BERACHAIN]: {
    nativeTokenSymbol: "BERA",
    wrappedTokenSymbol: "WBERA",
    defaultCollateralSymbol: "HONEY",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0011"),
  }
};

const ALCHEMY_WHITELISTED_DOMAINS = ["amp.io", "app.amp.io"];

export const ARBITRUM_RPC_PROVIDERS = [getDefaultArbitrumRpcUrl()];
export const AVALANCHE_RPC_PROVIDERS = ["https://api.avax.network/ext/bc/C/rpc"]; // Avalanche MAINNET
export const GOERLI_RPC_PROVIDERS = ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"]; // Goerli Test Network
export const BASE_RPC_PROVIDERS = [
  "https://base.publicnode.com",
  "https://base.llamarpc.com",
  "https://base.blockpi.network/v1/rpc/public",
  "https://endpoints.omniatech.io/v1/base/mainnet/public",
];
export const BSC_RPC_PROVIDERS = [
  "https://bsc-dataseed.binance.org",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc-dataseed2.defibit.io",
  "https://bsc-dataseed3.defibit.io",
  "https://bsc-dataseed4.defibit.io",
  "https://bsc-dataseed2.ninicoin.io",
  "https://bsc-dataseed3.ninicoin.io",
  "https://bsc-dataseed4.ninicoin.io",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed2.binance.org",
  "https://bsc-dataseed3.binance.org",
  "https://bsc-dataseed4.binance.org",
];
export const PEGASUS_RPC_PROVIDERS = [
  "https://replicator.pegasus.lightlink.io/rpc/v1",  
];
export const PHOENIX_RPC_PROVIDERS = [
  "https://replicator.phoenix.lightlink.io/rpc/v1",
  "https://endpoints.omniatech.io/v1/lightlink/phoenix/public"
];

export const BSC_TESTNET_RPC_PROVIDER = [
  "https://bsc-testnet.blastapi.io/c9643dfa-4f00-4b9f-82e3-039e3068afa0",  
];
export const UNICHAIN_TESTNET_RPC_PROVIDER = [
  "https://sepolia.unichain.org",
];

export const SONIC_RPC_PROVIDER = [
  "https://rpc.soniclabs.com",
];

export const BERACHAIN_RPC_PROVIDER = [
  "https://rpc.berachain.com",
];


export const RPC_PROVIDERS = {
  [ARBITRUM]: ARBITRUM_RPC_PROVIDERS,
  [PEGASUS]: PEGASUS_RPC_PROVIDERS,
  [PHOENIX]: PHOENIX_RPC_PROVIDERS,
  [BSCTESTNET]: BSC_TESTNET_RPC_PROVIDER,
  [UNICHAINTESTNET]: UNICHAIN_TESTNET_RPC_PROVIDER,
  [BSC]: BSC_RPC_PROVIDERS,
  [SONIC]: SONIC_RPC_PROVIDER,
  [BERACHAIN]: BERACHAIN_RPC_PROVIDER
};

export const FALLBACK_PROVIDERS = {
  [ARBITRUM]: [getAlchemyHttpUrl()],
  [PEGASUS]: [PEGASUS_RPC_PROVIDERS[0]],
  [PHOENIX]: [PHOENIX_RPC_PROVIDERS[0]],
  [BSCTESTNET]: [BSC_TESTNET_RPC_PROVIDER[0]],
  [UNICHAINTESTNET]: [UNICHAIN_TESTNET_RPC_PROVIDER[0]],
  [BSC]: [BSC_RPC_PROVIDERS[0]],
  [SONIC]: [SONIC_RPC_PROVIDER[0]],
  [BERACHAIN]: [BERACHAIN_RPC_PROVIDER[0]]
};

export const NETWORK_METADATA = {
  [PEGASUS]: {
    chainId: "0x" + PEGASUS.toString(16),
    chainName: "Pegasus",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: PEGASUS_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(PEGASUS)],
  },
   [PHOENIX]: {
    chainId: "0x" + PHOENIX.toString(16),
    chainName: "LightLink",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: PHOENIX_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(PHOENIX)],
  },
  [BSCTESTNET]: {
    chainId: "0x" + BSCTESTNET.toString(16),
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: BSC_TESTNET_RPC_PROVIDER,
    blockExplorerUrls: [getExplorerUrl(PHOENIX)],
  },
  [BSC]: {
    chainId: "0x" + BSC.toString(16),
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: BSC_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(BSC)],
  },
  [UNICHAINTESTNET]: {
    chainId: "0x" + UNICHAINTESTNET.toString(16),
    chainName: "Unichain Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: UNICHAIN_TESTNET_RPC_PROVIDER,
    blockExplorerUrls: [getExplorerUrl(UNICHAINTESTNET)],
  },
  [SONIC]: {
    chainId: "0x" + SONIC.toString(16),
    chainName: "Sonic",
    nativeCurrency: {
      name: "S",
      symbol: "S",
      decimals: 18,
    },
    rpcUrls: SONIC_RPC_PROVIDER,
    blockExplorerUrls: [getExplorerUrl(SONIC)],
  },
  [BERACHAIN]: {
    chainId: "0x" + BERACHAIN.toString(16),
    chainName: "Berachain",
    nativeCurrency: {
      name: "BERA",
      symbol: "BERA",
      decimals: 18,
    },
    rpcUrls: BERACHAIN_RPC_PROVIDER,
    blockExplorerUrls: [getExplorerUrl(BERACHAIN)],
  }
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getDefaultArbitrumRpcUrl() {
  return "https://arb1.arbitrum.io/rpc";
}

export function getAlchemyHttpUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "https://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
  }
  return "https://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2";
}

export function getAlchemyWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
  }
  return "wss://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2";
}

export function getExplorerUrl(chainId) {
  if (chainId === ARBITRUM) {
    return "https://arbiscan.io/";
  } else if (chainId === PEGASUS) {
    return "https://pegasus.lightlink.io/"
  } else if (chainId === PHOENIX) {
    return "https://phoenix.lightlink.io/"
  } else if (chainId === BSCTESTNET) {
    return "https://testnet.bscscan.com/"
  } else if (chainId === UNICHAINTESTNET) {
    return "https://sepolia.uniscan.xyz/"
  } else if (chainId === BSC) {
    return "https://bscscan.com/"
  } else if (chainId === SONIC) {
    return "https://sonicscan.org/"
  } else if (chainId === BERACHAIN) {
    return "https://berascan.com/"
  }
  return "https://phoenix.lightlink.io/";
}

export function getHighExecutionFee(chainId: number) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

export const getGasPrice = async (chainId: number) => {
  if (chainId === BSCTESTNET || chainId === BSC) {
    const provider = new ethers.providers.JsonRpcProvider(BSC_TESTNET_RPC_PROVIDER[0]);
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  }
  // For other networks, you can add similar logic or return a default value
  return ethers.BigNumber.from(GAS_PRICE_ADJUSTMENT_MAP[chainId] || "0");
};
