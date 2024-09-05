import React from "react";
import "./Leaderboard.css";
import { FaTrophy } from "react-icons/fa";
import { BsFillDiamondFill } from "react-icons/bs";
import { useLocalStorage } from "react-use";
import { Trans, t } from "@lingui/macro";
import SEO from "components/Common/SEO";
import { getPageTitle, isHashZero } from "lib/legacy";
import ExternalLink from "components/ExternalLink/ExternalLink";
import Footer from "components/Footer/Footer";
import Tab from "components/Tab/Tab";
import { LEADERBOARD_SELECTED_TAB_KEY } from "config/localStorage";
import OverallLeaderboard from "./OverallLeaderboard";
import TradersLeaderboard from "./Trader";
import AffiliatesLeaderboard from "./Affiliates";
import LiquidityLeaderboard from "./Liquidity";
import { useAlpPoints, useAlpPointsRemoval, useOrderPoints, useTradePoints } from "domain/legacy";
import { useChainId } from "lib/chains";

const leaderboardData = [
  { date: "07-09", rank: 1, trader: "0xacf3...236F", volume: 39364949.42, reward: 810.0 },
  { date: "07-08", rank: 2, trader: "0xCF9D...1BDC", volume: 21857180.14, reward: 540.0 },
  { date: "07-07", rank: 3, trader: "0xd8B5...b448", volume: 13330642.9, reward: 360.0 },
  { date: "07-06", rank: 4, trader: "0xE690...6987", volume: 12768965.4, reward: 300.0 },
  { date: "07-05", rank: 5, trader: "0x8510...5061", volume: 10047080.0, reward: 240.0 },
  { date: "07-04", rank: 6, trader: "0x6f73...3f37", volume: 10018000.0, reward: 120.0 },
  { date: "07-03", rank: 7, trader: "0x8C82...1D86", volume: 9960552.81, reward: 105.0 },
  { date: "07-02", rank: 8, trader: "0x9816...5213", volume: 8287160.0, reward: 90.0 },
  { date: "07-01", rank: 9, trader: "0x25F9...b3E0", volume: 8287080.0, reward: 75.0 },
  { date: "06-30", rank: 10, trader: "0x276E...24D3", volume: 7528600.0, reward: 60.0 },
];

const TOTAL = "Total";
const TRADERS = "Traders";
const AFFILIATES = "Affiliates";
const ALP = "ALP";
// const TAB_OPTIONS = [TOTAL, TRADERS, AFFILIATES, ALP];
const TAB_OPTIONS = [TOTAL, TRADERS, ALP];

function Leaderboard() {
  const { chainId } = useChainId();
  const alpPoints = useAlpPoints(chainId);
  const alpPointsRemoval = useAlpPointsRemoval(chainId);
  const orderPoints = useOrderPoints(chainId);
  const tradePoints = useTradePoints(chainId);

  // const accountPoints = {};
  // alpPoints?.forEach((item) => {
  //   const points = BigInt(item.points);
  //   if (!accountPoints[item.account]) {
  //     accountPoints[item.account] = BigInt(0);
  //   }
  //   if (item.type === 1) {
  //     accountPoints[item.account] += points;
  //   } else if (item.type === 2) {
  //     accountPoints[item.account] -= points;
  //   }
  // });
  // const accountPointsArray = Object.entries(accountPoints);
  // accountPointsArray.sort((a, b) => b.points - a.points);
  // const top10Accounts = accountPointsArray.slice(0, 10);
  // const formattedData = top10Accounts.map((entry, index) => ({
  //   rank: index + 1,
  //   trader: entry[0],
  //   volume: 100000, // Placeholder value for volume
  //   reward: (Number(entry[1]) / 10 ** 30) * 5, // Convert BigInt to Number for reward
  // }));
  // console.log(top10Accounts);

  // console.log("Alp Points Addition", alpPoints);
  // console.log("Alp Points Removal", alpPointsRemoval);
  // console.log("Order Points", orderPoints);
  // console.log("Trade Points", tradePoints);

  const allALpPoints = alpPoints?.concat(alpPointsRemoval);
  const groupedALpPoints = {};
  allALpPoints?.forEach((item) => {
    if(item) {
    if (!groupedALpPoints[item.account]) {
      groupedALpPoints[item.account] = 0;
    }
    groupedALpPoints[item.account] += Number(item.points) / 10 ** 30 * 5;
  }
  });
  const groupedALpPointsArray = Object.entries(groupedALpPoints);
  groupedALpPointsArray.sort((a, b) => b[1] - a[1]);
  const top10ALpAccounts = groupedALpPointsArray.slice(0, 10);

  const allTradePoints = tradePoints?.concat(orderPoints);
  const groupedTradePoints = {};
  allTradePoints?.forEach((item) => {
    if(item) {
    if (!groupedTradePoints[item.account]) {
      groupedTradePoints[item.account] = 0;
    }
    groupedTradePoints[item.account] += Number(item.points) / 10 ** 30 * 2.5;
  }
  });
  const groupedTradePointsArray = Object.entries(groupedTradePoints);
  groupedTradePointsArray.sort((a, b) => b[1] - a[1]);
  const top10Traders = groupedTradePointsArray.slice(0, 10);

  const overallLeaderboardData = groupedTradePointsArray.concat(groupedALpPointsArray);
  const groupedOverallLeaderboardData = overallLeaderboardData.reduce((acc, [address, value]) => {
    // If the address already exists in the accumulator, add the value
    if (acc[address]) {
      acc[address] += value;
    } else {
      // Otherwise, initialize it with the value
      acc[address] = value;
    }
    return acc;
  }, {});
  const overallLeadetboardDataArray = Object.entries(groupedOverallLeaderboardData);
  overallLeadetboardDataArray.sort((a, b) => b[1] - a[1]);
  const top10OverallAccounts = overallLeadetboardDataArray.slice(0, 10);
  console.log("Overall Leaderboard Data", overallLeadetboardDataArray);

  const [activeTab, setActiveTab] = useLocalStorage(LEADERBOARD_SELECTED_TAB_KEY, TOTAL);
  const TAB_OPTION_LABELS = {
    [TOTAL]: t`Overall`,
    [TRADERS]: t`Traders`,
    [AFFILIATES]: t`Affiliates`,
    [ALP]: t`Liquidity`,
  };

  const renderOverallTab = () => <OverallLeaderboard leaderboardData={top10OverallAccounts} tradePoints={groupedTradePointsArray} alpPoints={groupedALpPointsArray} />;

  const renderTradersTab = () => <TradersLeaderboard leaderboardData={top10Traders} />;

  const renderAffiliatesTab = () => <AffiliatesLeaderboard leaderboardData={leaderboardData} />;

  const renderLiquidityTab = () => <LiquidityLeaderboard leaderboardData={top10ALpAccounts} />;

  const renderContent = () => {
    switch (activeTab) {
      case TOTAL:
        return renderOverallTab();
      case TRADERS:
        return renderTradersTab();
      case AFFILIATES:
        return renderAffiliatesTab();
      case ALP:
        return renderLiquidityTab();
      default:
        return null;
    }
  };

  return (
    <SEO title={getPageTitle("Leaderboard")}>
      <div className="default-container page-layout Leaderboard">
        <div className="section-title-block">
          <div className="section-title-icon" />
          <div className="section-title-content">
            <div className="Page-title font-kufam">
              <FaTrophy className="trophy-icon" />
              <Trans>Leaderboard</Trans>
            </div>
            <div className="Page-description">
              <Trans>
                Compete in Amped Finance season and earn exciting rewards. For more information, please read the{" "}
                <ExternalLink href="https://amped.gitbook.io/amped/referrals">referral program details</ExternalLink>.
              </Trans>
            </div>
          </div>
        </div>
        <div className="leaderboard-tab-container">
          <Tab
            options={TAB_OPTIONS}
            optionLabels={TAB_OPTION_LABELS}
            option={activeTab}
            setOption={setActiveTab}
            onChange={setActiveTab}
          />
        </div>
        {renderContent()}
      </div>
      <Footer />
    </SEO>
  );
}

export default Leaderboard;
