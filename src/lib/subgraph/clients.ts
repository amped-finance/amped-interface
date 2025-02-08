import { createClient } from "./utils";
import { SUBGRAPH_URLS } from "config/subgraph";
import { ARBITRUM, PEGASUS, PHOENIX, BSCTESTNET, UNICHAINTESTNET, BSC, SONIC, BERACHAIN } from "config/chains";

export const chainlinkClient = createClient(SUBGRAPH_URLS.common.chainLink);

export const arbitrumGraphClient = createClient(SUBGRAPH_URLS[ARBITRUM].stats);
export const arbitrumReferralsGraphClient = createClient(SUBGRAPH_URLS[ARBITRUM].referrals);
export const nissohGraphClient = createClient(SUBGRAPH_URLS[ARBITRUM].nissohVault);

export const pegasusGraphClient = createClient(SUBGRAPH_URLS[PEGASUS].stats);
export const pegasusReferralsGraphClient = createClient(SUBGRAPH_URLS[PEGASUS].referrals);
export const pegasusGraphClientForTrades = createClient(SUBGRAPH_URLS[PEGASUS].trades);
export const pegasusGraphClientForRaw = createClient(SUBGRAPH_URLS[PEGASUS].raw);
export const pegasusGraphClientForPoints = createClient(SUBGRAPH_URLS[PEGASUS].points);

export const phoenixGraphClient = createClient(SUBGRAPH_URLS[PHOENIX].stats);
export const phoenixReferralsGraphClient = createClient(SUBGRAPH_URLS[PHOENIX].referrals);
export const phoenixGraphClientForTrades = createClient(SUBGRAPH_URLS[PHOENIX].trades);
export const phoenixGraphClientForRaw = createClient(SUBGRAPH_URLS[PHOENIX].raw);
export const phoenixGraphClientForPoints = createClient(SUBGRAPH_URLS[PHOENIX].points);

export const bsctestnetGraphClient = createClient(SUBGRAPH_URLS[BSCTESTNET].stats);
export const bsctestnetReferralsGraphClient = createClient(SUBGRAPH_URLS[BSCTESTNET].referrals);
export const bsctestnetGraphClientForTrades = createClient(SUBGRAPH_URLS[BSCTESTNET].trades);
export const bsctestnetGraphClientForRaw = createClient(SUBGRAPH_URLS[BSCTESTNET].raw);
export const bsctestnetGraphClientForPoints = createClient(SUBGRAPH_URLS[BSCTESTNET].points);

export const unichaintestnetGraphClient = createClient(SUBGRAPH_URLS[UNICHAINTESTNET].stats);
export const unichaintestnetReferralsGraphClient = createClient(SUBGRAPH_URLS[UNICHAINTESTNET].referrals);
export const unichaintestnetGraphClientForTrades = createClient(SUBGRAPH_URLS[UNICHAINTESTNET].trades);
export const unichaintestnetGraphClientForRaw = createClient(SUBGRAPH_URLS[UNICHAINTESTNET].raw);
export const unichaintestnetGraphClientForPoints = createClient(SUBGRAPH_URLS[UNICHAINTESTNET].points);

export const bscGraphClient = createClient(SUBGRAPH_URLS[BSC].stats);
export const bscReferralsGraphClient = createClient(SUBGRAPH_URLS[BSC].referrals);
export const bscGraphClientForTrades = createClient(SUBGRAPH_URLS[BSC].trades);
export const bscGraphClientForRaw = createClient(SUBGRAPH_URLS[BSC].raw);
export const bscGraphClientForPoints = createClient(SUBGRAPH_URLS[BSC].points);

export const sonicGraphClient = createClient(SUBGRAPH_URLS[SONIC].stats);
export const sonicReferralsGraphClient = createClient(SUBGRAPH_URLS[SONIC].referrals);
export const sonicGraphClientForTrades = createClient(SUBGRAPH_URLS[SONIC].trades);
export const sonicGraphClientForRaw = createClient(SUBGRAPH_URLS[SONIC].raw);
export const sonicGraphClientForPoints = createClient(SUBGRAPH_URLS[SONIC].points);

export const berachainGraphClient = createClient(SUBGRAPH_URLS[BERACHAIN].stats);
export const berachainReferralsGraphClient = createClient(SUBGRAPH_URLS[BERACHAIN].referrals);
export const berachainGraphClientForTrades = createClient(SUBGRAPH_URLS[BERACHAIN].trades);
export const berachainGraphClientForRaw = createClient(SUBGRAPH_URLS[BERACHAIN].raw);
export const berachainGraphClientForPoints = createClient(SUBGRAPH_URLS[BERACHAIN].points);

export function getAmpGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === PEGASUS) {
    return pegasusGraphClient;
  } else if (chainId === PHOENIX) {
    return phoenixGraphClient;
  } else if (chainId === BSCTESTNET) {
    return bsctestnetGraphClient
  } else if (chainId === UNICHAINTESTNET) {
    return unichaintestnetGraphClient
  } else if (chainId === BSC) {
    return bscGraphClient
  } else if (chainId === SONIC) {
    return sonicGraphClient
  } else if (chainId === BERACHAIN) {
    return berachainGraphClient
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getTradesGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return nissohGraphClient;
  } else if (chainId === PEGASUS) {
    return pegasusGraphClientForTrades;
  } else if (chainId === PHOENIX) {
    return phoenixGraphClientForTrades;
  } else if (chainId === BSCTESTNET) {
    return bsctestnetGraphClientForTrades
  } else if (chainId === UNICHAINTESTNET) {
    return unichaintestnetGraphClientForTrades
  } else if (chainId === BSC) {
    return bscGraphClientForTrades
  } else if (chainId === SONIC) {
    return sonicGraphClientForTrades
  } else if (chainId === BERACHAIN) {
    return berachainGraphClientForTrades
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getPointsGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return nissohGraphClient;
  } else if (chainId === PEGASUS) {
    return pegasusGraphClientForPoints;
  } else if (chainId === PHOENIX) {
    return phoenixGraphClientForPoints;
  } else if (chainId === BSCTESTNET) {
    return bsctestnetGraphClientForPoints;
  } else if (chainId === UNICHAINTESTNET) {
    return unichaintestnetGraphClientForPoints
  } else if (chainId === BSC) {
    return bscGraphClientForPoints
  } else if (chainId === SONIC) {
    return sonicGraphClientForPoints
  } else if (chainId === BERACHAIN) {
    return berachainGraphClientForPoints
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getRawGraphClient(chainId: number) {
  if (chainId === PEGASUS) {
    return pegasusGraphClientForRaw;
  } else if (chainId === PHOENIX) {
    return phoenixGraphClientForRaw;
  } else if (chainId === BSCTESTNET) {
    return bsctestnetGraphClientForRaw
  } else if (chainId === UNICHAINTESTNET) {
    return unichaintestnetGraphClientForRaw
  } else if (chainId === BSC) {
    return bscGraphClientForRaw
  } else if (chainId === SONIC) {
    return sonicGraphClientForRaw
  } else if (chainId === BERACHAIN) {
    return berachainGraphClientForRaw
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getAmpGraphClientByNewCreate(chainId: number) {
  if (chainId === ARBITRUM) {
    return createClient(SUBGRAPH_URLS[ARBITRUM].stats);
  } else if (chainId === PEGASUS) {
    return createClient(SUBGRAPH_URLS[PEGASUS].stats);
  } else if (chainId === PHOENIX) {
    return createClient(SUBGRAPH_URLS[PHOENIX].stats);
  } else if (chainId === BSCTESTNET) {
    return createClient(SUBGRAPH_URLS[BSCTESTNET].stats)
  } else if (chainId === UNICHAINTESTNET) {
    return createClient(SUBGRAPH_URLS[UNICHAINTESTNET].stats)
  } else if (chainId === BSC) {
    return createClient(SUBGRAPH_URLS[BSC].stats)
  } else if (chainId === SONIC) {
    return createClient(SUBGRAPH_URLS[SONIC].stats)
  } else if (chainId === BERACHAIN) {
    return createClient(SUBGRAPH_URLS[BERACHAIN].stats)
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getAmpGraphClientByNewCreateOrder(chainId: number) {
  if (chainId === ARBITRUM) {
    return createClient(SUBGRAPH_URLS[ARBITRUM].stats);
  } else if (chainId === PEGASUS) {
    return createClient(SUBGRAPH_URLS[PEGASUS].ordernew);
  } else if (chainId === PHOENIX) {
    return createClient(SUBGRAPH_URLS[PHOENIX].ordernew);
  } else if (chainId === BSCTESTNET) {
    return createClient(SUBGRAPH_URLS[BSCTESTNET].ordernew);
  } else if (chainId === UNICHAINTESTNET) {
    return createClient(SUBGRAPH_URLS[UNICHAINTESTNET].ordernew)
  } else if (chainId === BSC) {
    return createClient(SUBGRAPH_URLS[BSC].ordernew)
  } else if (chainId === SONIC) {
    return createClient(SUBGRAPH_URLS[SONIC].ordernew)
  } else if (chainId === BERACHAIN) {
    return createClient(SUBGRAPH_URLS[BERACHAIN].ordernew)
  }

  throw new Error(`Unsupported chain ${chainId}`);
}