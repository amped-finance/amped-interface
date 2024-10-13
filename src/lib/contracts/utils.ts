import { Provider } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";
import { GAS_PRICE_ADJUSTMENT_MAP, MAX_GAS_PRICE_MAP, PEGASUS, PHOENIX, UNICHAINTESTNET } from "config/chains";
import { bigNumberify } from "../numbers";

export async function setGasPrice(txnOpts: any, provider: Provider, chainId: number) {
  if(chainId === PEGASUS || chainId === PHOENIX) {
    txnOpts.gasPrice = ethers.constants.Zero;
    return;
  }
  let maxGasPrice = MAX_GAS_PRICE_MAP[chainId];
  const premium = GAS_PRICE_ADJUSTMENT_MAP[chainId] || bigNumberify(0);

  const gasPrice = await provider.getGasPrice();

  if (maxGasPrice) {
    if (gasPrice.gt(maxGasPrice)) {
      maxGasPrice = gasPrice;
    }

    const feeData = await provider.getFeeData();

    // the wallet provider might not return maxPriorityFeePerGas in feeData
    // in which case we should fallback to the usual getGasPrice flow handled below
    if (feeData && feeData.maxPriorityFeePerGas) {
      txnOpts.maxFeePerGas = maxGasPrice || gasPrice.add(premium);
      
      // Set a maximum priority fee for Unichain Testnet
      if (chainId === UNICHAINTESTNET) {
        const maxPriorityFee = bigNumberify("1000000"); // 1 gwei, adjust as needed
        txnOpts.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.add(premium).lt(maxPriorityFee)
          ? feeData.maxPriorityFeePerGas.add(premium)
          : maxPriorityFee;
      } else {
        txnOpts.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.add(premium);
      }
      
      return;
    }
  }

  // Fallback to legacy gas price if EIP-1559 is not supported
  txnOpts.gasPrice = (maxGasPrice && gasPrice.gt(maxGasPrice) ? maxGasPrice : gasPrice).add(premium);
  return;
}

export async function getGasLimit(contract: Contract, method, params = [], value) {
  const defaultValue = bigNumberify(0);

  if (!value) {
    value = defaultValue;
  }

  let gasLimit = await contract.estimateGas[method](...params, { value });

  if (gasLimit.lt(22000)) {
    gasLimit = bigNumberify(22000)!;
  }

  return gasLimit.mul(11000).div(10000); // add a 10% buffer
}
