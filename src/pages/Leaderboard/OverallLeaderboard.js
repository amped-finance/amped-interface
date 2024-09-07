// OverallLeaderboard.js
import React from 'react';
import { FaTrophy } from "react-icons/fa";
import { Trans } from "@lingui/macro";
import {
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";

const OverallLeaderboard = ({ leaderboardData, tradePoints, alpPoints }) => {
  const { isConnected: active, address: walletAccount } = useWeb3ModalAccount();

  return (
    <div>
      <div className="leaderboard-card section-center mt-medium">
        <h2 className="title font-kufam">
          <Trans>Overall Leaderboard</Trans>
        </h2>
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Trader</th>
                <th>Total Points</th>
                <th>Trading Volume USDT</th>
                <th>Liquidity Added</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td className="glass-effect">
                    {index + 1 <= 3 ? <FaTrophy className={`trophy rank-${index + 1}`} /> : index + 1}
                  </td>
                  <td className="glass-effect">{entry[0]}</td>
                  <td className="glass-effect reward">
                    {parseFloat(entry[1]).toFixed(2)}
                  </td>
                  <td className="glass-effect reward">
                    {tradePoints?.find(([address]) => address === entry[0]) ? parseFloat(tradePoints.find(([address]) => address === entry[0])[1]).toFixed(2) : 0}
                  </td>
                  <td className="glass-effect reward">
                    {alpPoints?.find(([address]) => address === entry[0]) ? parseFloat(alpPoints.find(([address]) => address === entry[0])[1]).toFixed(2) : 0}
                  </td>
                </tr>
              ))}
              {active && (
                <tr className='ownrecord'>
                  <td className="glass-effect">{(leaderboardData.findIndex(([address]) => address.toLowerCase() === walletAccount.toLowerCase()) != -1) ? leaderboardData.findIndex(([address]) =>  address.toLowerCase() === walletAccount.toLowerCase()) + 1 : '-'}</td>
                  <td className="glass-effect">{walletAccount}</td>
                  <td className="glass-effect">{leaderboardData?.find(([address]) => address.toLowerCase() === walletAccount.toLowerCase()) ? parseFloat(tradePoints.find(([address]) => address.toLowerCase() === walletAccount.toLowerCase())[1]).toFixed(2) : 0}</td>
                  <td className="glass-effect">{tradePoints?.find(([address]) => address.toLowerCase() === walletAccount.toLowerCase()) ? parseFloat(tradePoints.find(([address]) => address.toLowerCase() === walletAccount.toLowerCase())[1]).toFixed(2) : 0}</td>
                  <td className="glass-effect">{alpPoints?.find(([address]) => address.toLowerCase() === walletAccount.toLowerCase()) ? parseFloat(alpPoints.find(([address]) => address.toLowerCase() === walletAccount.toLowerCase())[1]).toFixed(2) : 0}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverallLeaderboard;
