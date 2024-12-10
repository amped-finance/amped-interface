import { useMemo, useState } from "react";
import { ethers } from "ethers";
import { map, reduce } from "lodash";
import { APP_ENVIRONMENTS } from "config/env";
import { convertSqrtPriceX96PairToTokenPrice } from "config/helper";

export const getIndexFundMasterData = async (chain, refetchSeed = 1, library) => {
  const defaultMasterData = {
    totalToken: "0",
    pools: [],
    totalValue: 0,
    poolSize: 0,
  };
  try {
    const providerPublic = new ethers.providers.JsonRpcProvider(APP_ENVIRONMENTS.CHAINS[chain].RPC);
    const querierContract = APP_ENVIRONMENTS.CHAINS_MIF[chain].INDEX_FUND.QUERIER_CONTRACT;
    const contractIns = new ethers.Contract(querierContract.ADDRESS, querierContract.ABI, providerPublic);

    const res = await contractIns.getPoolTokenInfos(APP_ENVIRONMENTS.CHAINS_MIF[chain].INDEX_FUND.REGISTRY.ADDRESS, 1);

    let decoded = {
      totalToken: res.masterData.totalMI?.toString() ?? "0",
      pools: map(res.poolInfos, (poolState) => {
        const poolInfo = poolState.poolInfo;
        return {
          address: poolInfo.token,
          name: poolState.name,
          symbol: poolState.symbol,
          decimals: Number(poolState.decimals),
          poolInfo,
          totalHolding: poolState.tokenInfo.totalHolding?.toString() ?? "0",
          exchangePairs: poolState.exchangePairs,
          price: convertSqrtPriceX96PairToTokenPrice(poolInfo.token, poolState.exchangePairs, {
            token: Number(poolState.decimals),
            usd: 18,
          }).price,
        };
      }),
    };

    decoded.totalValue = reduce(
      decoded.pools,
      (acc, pool) => {
        return acc + Number(ethers.utils.formatUnits(pool.totalHolding, pool.decimals)) * pool.price;
      },
      0
    );

    decoded.poolSize = decoded.pools.length;
    return decoded;
  } catch (e) {
    return defaultMasterData;
  }
};