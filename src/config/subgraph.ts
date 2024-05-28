import { ARBITRUM, PEGASUS, PHOENIX } from "./chains";

export const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },

  [PEGASUS]: {
    stats: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/trades",
    referrals: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/referrals",
    trades:"https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    raw:"https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    price: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/trades",
    ordernew: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/orders"
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
    chainLink: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/trades"
  },
};
