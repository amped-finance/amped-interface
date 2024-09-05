// OverallLeaderboard.js
import React from "react";
import { FaTrophy } from "react-icons/fa";
import { Trans } from "@lingui/macro";
import "./Leaderboard.css";

const LiquidityLeaderboard = ({ leaderboardData }) => (
  <div>
    <div className="leaderboard-card section-center mt-medium">
      <h2 className="title font-kufam">
        <Trans>Liquidity Leaderboard</Trans>
      </h2>
      <div className="leaderboard-table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trader</th>
              <th className="masked-column">Trading Volume USDT</th>
              <th>Liquidity Added</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={index}>
                <td className="glass-effect">
                  {index+1 <= 3 ? <FaTrophy className={`trophy rank-${index + 1}`} /> : index + 1}
                </td>
                <td className="glass-effect">{entry[0]}</td>
                <td className="glass-effect masked-column">
                  {parseFloat(entry[1]).toFixed(2)}
                </td>
                <td className="glass-effect reward">{parseFloat(entry[1]).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default LiquidityLeaderboard;