import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { ethers } from 'ethers'

let safeAppsSdk: SafeAppsSDK | undefined
let provider: SafeAppProvider | undefined
let safe: SafeInfo | undefined
let ethersProvider: ethers.providers.Web3Provider | undefined

export const initSafeSDK = async () => {
  try {
    if (!isSafeApp()) {
      console.log('Not running in Safe environment');
      return null;
    }

    // Initialize the SDK with proper options
    safeAppsSdk = new SafeAppsSDK({
      allowedDomains: [/gnosis-safe.io/, /app.safe.global/, /safe.lightlink.io/],
      debug: true // Enable debug mode temporarily to help diagnose issues
    });
    
    // Get Safe Info
    safe = await safeAppsSdk.safe.getInfo()
    
    if (!safe || !safe.safeAddress) {
      console.error('Failed to get Safe info or Safe address is missing');
      return null;
    }

    console.log('Safe detected:', {
      chainId: safe.chainId,
      safeAddress: safe.safeAddress,
      owners: safe.owners,
      threshold: safe.threshold
    });
      
    // Create Safe Provider
    provider = new SafeAppProvider(safe, safeAppsSdk)
    
    // Create Ethers Provider
    ethersProvider = new ethers.providers.Web3Provider(provider)
    
    // Verify provider is working
    try {
      const network = await ethersProvider.getNetwork()
      console.log('Provider network:', network);
      
      const code = await ethersProvider.getCode(safe.safeAddress)
      console.log('Safe contract code exists:', code.length > 2);
    } catch (error) {
      console.error('Provider verification failed:', error)
      return null;
    }
    
    return {
      provider: ethersProvider,
      safe,
      sdk: safeAppsSdk
    }
  } catch (error) {
    console.error('Error initializing Safe SDK:', error)
    return null
  }
}

export const isSafeApp = () => {
  try {
    return window.parent !== window;
  } catch (e) {
    return false;
  }
}

export const getSafeInfo = () => {
  if (!safe) {
    console.warn('Attempting to get Safe info before initialization');
  }
  return safe
}

export const getSafeSDK = () => {
  if (!safeAppsSdk) {
    console.warn('Attempting to get Safe SDK before initialization');
  }
  return safeAppsSdk
}

export const getSafeProvider = () => {
  if (!ethersProvider) {
    console.warn('Attempting to get Safe provider before initialization');
  }
  return ethersProvider
}

export const getSafeAddress = () => {
  if (!safe) {
    console.warn('Attempting to get Safe address before initialization');
  }
  return safe?.safeAddress
} 