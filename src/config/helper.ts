import { ethers } from "ethers";
import { head, reduce } from "lodash";

export const ChainSupported = {
  Lightlink: "LIGHTLINK",
  Bsc: "BSC",
};

export function formatAddress(address: string) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function truncateTransactionHash(hash: string) {
  return hash.slice(0, 6) + "..." + hash.slice(-4);
}

export const formatBalance = (balance: any, decimals: any, fractionDigits = 4) => {
  if (!balance) {
    return "0";
  }
  const res = ethers.utils.formatUnits(balance?.toString(), decimals);
  return parseFloat(res).toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  });
};

export const convertSqrtPriceX96ToTokenPrice = (value: string) => {
  return Number(value) ** 2 / 2 ** 192;
};

export const convertSqrtPriceX96PairToTokenPrice = (
  token: string,
  pairs: any[],
  decimals: {
    token: number;
    usd: number;
  }
) => {
  const isTokenToUsd = head(pairs)?.token0 === token;
  const sourceDecimal = isTokenToUsd ? decimals.token : decimals.usd;
  const targetDecimal = isTokenToUsd ? decimals.usd : decimals.token;
  const res = reduce(
    pairs,
    (acc, pair) => {
      const price = convertSqrtPriceX96ToTokenPrice(pair.sqrtPriceX96.toString());
      if (pair.token0 === acc.token) {
        return {
          price: acc.price * price,
          token: pair.token1,
        };
      } else {
        return {
          price: acc.price / price,
          token: pair.token0,
        };
      }
    },
    {
      price: 1,
      token: token,
    }
  );

  const targetPrice = res.price / 10 ** (sourceDecimal - targetDecimal);
  return {
    price: targetPrice,
    token: res.token,
  };
};

export const computePrice = (amount: string, value: number | string, decimals: number) => {
  if (!value) {
    return 0;
  }

  return Number(value) / Number(ethers.utils.formatUnits(amount, decimals));
};

export const formatNumber = (value: number | string, fractionDigits = 4) => {
  return Number(value.toString()).toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  });
};
