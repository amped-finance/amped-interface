import { createClient } from "./utils";
import { SUBGRAPH_URLS } from "config/subgraph";
import { ARBITRUM, PEGASUS, PHOENIX } from "config/chains";

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

export function getAmpGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === PEGASUS) {
    return pegasusGraphClient;
  } else if (chainId === PHOENIX) {
    return phoenixGraphClient;
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
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getRawGraphClient(chainId: number) {
  if (chainId === PEGASUS) {
    return pegasusGraphClientForRaw;
  } else if (chainId === PHOENIX) {
    return phoenixGraphClientForRaw;
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
  }

  throw new Error(`Unsupported chain ${chainId}`);
}