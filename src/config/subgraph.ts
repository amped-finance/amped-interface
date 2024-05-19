import { ARBITRUM, PEGASUS, PHOENIX } from "./chains";

export const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },

  [PEGASUS]: {
    stats: "https://info3.amped.finance/subgraphs/name/amped/amped-trades/",
    referrals: "https://info3.amped.finance/subgraphs/name/amped/amped-referrals",
    trades:"https://info3.amped.finance/subgraphs/name/amped/amped-trades/",  
    raw:"https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/raw2",  
    price: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/pricesz",
    ordernew: "https://info3.amped.finance/subgraphs/name/amped/amped-orders1"
  },
  
  [PHOENIX]: {
    stats: "https://info.amped.finance/subgraphs/name/amped/stats",
    referrals: "https://info3.amped.finance/subgraphs/name/amped/amped-referrals",
    trades:"https://info.amped.finance/subgraphs/name/amped/trades",  
    raw:"https://info.amped.finance/subgraphs/name/amped/raw",  
    price: "http://info3.amped.finance/subgraphs/name/amped/prices",
    ordernew: "http://178.215.224.9:8000/subgraphs/name/amped/amped-orders1"
  },
  
  common: {
    chainLink: "http://info3.amped.finance/subgraphs/name/amped/pricesz"
  },
};
