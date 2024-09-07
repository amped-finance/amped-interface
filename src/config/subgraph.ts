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
    ordernew: "https://graph.pegasus.lightlink.io/query/subgraphs/name/amped-finance/orders",
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/tradespointsnew"

  },
  
  [PHOENIX]: {
    stats: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",
    referrals: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/referrals",
    trades:"https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    raw:"https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    price: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",
    ordernew: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/orders",
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/tradespointsnew"
  },
  
  common: {
    chainLink: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades"
  },
};
