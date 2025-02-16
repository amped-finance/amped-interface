import { ARBITRUM, PEGASUS, PHOENIX, BSCTESTNET, UNICHAINTESTNET, BSC, SONIC, BERACHAIN } from "./chains";

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
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/leaderboard"

  },
  
  [PHOENIX]: {
    stats: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",
    referrals: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/referrals",
    trades:"https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    raw:"https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",  
    price: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades",
    ordernew: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/orders",
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/leaderboard"
  },

  [BSCTESTNET]: {
    stats: "https://api.studio.thegraph.com/query/90987/amped-finance-trades/version/latest",
    referrals: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/referrals",
    trades:"https://api.studio.thegraph.com/query/90987/amped-finance-trades/version/latest",  
    raw:"https://api.studio.thegraph.com/query/90987/amped-finance-trades/version/latest",  
    price: "https://api.studio.thegraph.com/query/90987/amped-finance-trades/version/latest",
    ordernew: "https://api.studio.thegraph.com/query/90987/amped-finance-orders/version/latest",
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/leaderboard"
  },

  [BSC]: {
    stats: "https://api.studio.thegraph.com/query/91379/amped-trades-bsc/version/latest",
    referrals: "https://api.studio.thegraph.com/query/91379/amped-referrals-bsc/version/latest",
    trades:"https://api.studio.thegraph.com/query/91379/amped-trades-bsc/version/latest",  
    raw:"https://api.studio.thegraph.com/query/91379/amped-trades-bsc/version/latest",  
    price: "https://api.studio.thegraph.com/query/91379/amped-trades-bsc/version/latest",
    ordernew: "https://api.studio.thegraph.com/query/91379/amped-orders-bsc/version/latest",
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/leaderboard"
  },

  [UNICHAINTESTNET]: {
    stats: "https://api.studio.thegraph.com/query/91379/amped-trades/version/latest",
    referrals: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/referrals",
    trades:"https://api.studio.thegraph.com/query/91379/amped-trades/version/latest",  
    raw:"https://api.studio.thegraph.com/query/91379/amped-trades/version/latest",  
    price: "https://api.studio.thegraph.com/query/91379/amped-trades/version/latest",
    ordernew: "https://api.studio.thegraph.com/query/91379/amped-orders/version/latest",
    points: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/leaderboard"
  },

  [SONIC]: {
    stats: "https://api.studio.thegraph.com/query/91379/trades-sonic/version/latest",
    referrals: "https://api.studio.thegraph.com/query/91379/referrals-sonic/version/latest",
    trades:"https://api.studio.thegraph.com/query/91379/trades-sonic/version/latest",  
    raw:"https://api.studio.thegraph.com/query/91379/trades-sonic/version/latest",  
    price: "https://api.studio.thegraph.com/query/91379/trades-sonic/version/latest",
    ordernew: "https://api.studio.thegraph.com/query/91379/orders-sonic/version/latest",
    points: "https://api.studio.thegraph.com/query/91379/leaderboard-sonic/version/latest"
  },

  [BERACHAIN]: {
    stats: "https://api.studio.thegraph.com/query/91379/amped-trades-bera/version/latest",
    referrals: "https://api.studio.thegraph.com/query/91379/amped-referrals-bera/version/latest",
    trades:"https://api.studio.thegraph.com/query/91379/amped-trades-bera/version/latest",  
    raw:"https://api.studio.thegraph.com/query/91379/amped-trades-bera/version/latest",  
    price: "https://api.studio.thegraph.com/query/91379/amped-trades-bera/version/latest",
    ordernew: "https://api.studio.thegraph.com/query/91379/amped-orders-bera/version/latest",
    points: "https://api.studio.thegraph.com/query/91379/amped-leaderboard-bera/version/latest"
  },
  
  common: {
    chainLink: "https://graph.phoenix.lightlink.io/query/subgraphs/name/amped-finance/trades"
  },
};
