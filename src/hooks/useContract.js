import { useMemo } from "react";
import { ethers } from "ethers";
import { APP_ENVIRONMENTS } from "config/env";

export const useUsdtContract = (chain, client) => {
  const usdtContract = APP_ENVIRONMENTS.CHAINS_MIF[chain].LZ.USDT.TOKEN_CONTRACT;
  return useMemo(() => new ethers.Contract(usdtContract.ADDRESS, usdtContract.ABI, client), [client]);
};

export const useUsdtLzContract = (chain, client) => {
  const lzContract = APP_ENVIRONMENTS.CHAINS_MIF[chain].LZ.USDT.LZ_CONTRACT;
  return useMemo(() => new ethers.Contract(lzContract.ADDRESS, lzContract.ABI, client), [client]);
};

export const useMILzContract = (chain, client) => {
  const lzContract = APP_ENVIRONMENTS.CHAINS_MIF[chain].LZ.MIF.LZ_CONTRACT;
  return useMemo(() => new ethers.Contract(lzContract.ADDRESS, lzContract.ABI, client), [client]);
};

export const useMIContract = (chain, client) => {
  const tokenContract = APP_ENVIRONMENTS.CHAINS_MIF[chain].LZ.MIF.TOKEN_CONTRACT;
  return useMemo(() => new ethers.Contract(tokenContract.ADDRESS, tokenContract.ABI, client), [client]);
};
