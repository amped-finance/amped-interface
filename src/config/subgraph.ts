import { ARBITRUM, PEGASUS, PHOENIX } from "./chains";

export const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
  },

  [PEGASUS]: {
    stats: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/stats",
    referrals: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/referrals",
    trades:"https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    raw:"https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/raw2",  
    price: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/pricesz"
  },
  
  [PHOENIX]: {
    stats: "https://info.amped.finance/subgraphs/name/amped/stats",
    referrals: "https://info.amped.finance/subgraphs/name/amped/referrals",
    trades:"https://info.amped.finance/subgraphs/name/amped/trades",  
    raw:"https://info.amped.finance/subgraphs/name/amped/raw",  
    price: "http://info3.amped.finance/subgraphs/name/amped/prices"
  },
  
  common: {
    chainLink: "http://info3.amped.finance/subgraphs/name/amped/pricesz"
  },
};
