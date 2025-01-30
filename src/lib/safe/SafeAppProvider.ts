import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { ethers } from 'ethers'

let safeAppsSdk: SafeAppsSDK | undefined
let provider: SafeAppProvider | undefined
let safe: SafeInfo | undefined
let ethersProvider: ethers.providers.Web3Provider | undefined

export const initSafeSDK = async () => {
  try {
    // Initialize the SDK with proper options
    safeAppsSdk = new SafeAppsSDK({
      allowedDomains: [/gnosis-safe.io/, /app.safe.global/, /safe.lightlink.io/],
      debug: false
    });
    
    // Get Safe Info
    safe = await safeAppsSdk.safe.getInfo()
    
    if (safe) {
      console.log('Safe detected:', safe);
      
      // Create Safe Provider
      provider = new SafeAppProvider(safe, safeAppsSdk)
      
      // Create Ethers Provider
      ethersProvider = new ethers.providers.Web3Provider(provider)
      
      return {
        provider: ethersProvider,
        safe,
        sdk: safeAppsSdk
      }
    }
  } catch (error) {
    console.error('Error initializing Safe SDK:', error)
    return null
  }
  return null
}

export const isSafeApp = () => {
  try {
    return window.parent !== window;
  } catch (e) {
    return false;
  }
}

export const getSafeInfo = () => {
  return safe
}

export const getSafeSDK = () => {
  return safeAppsSdk
}

export const getSafeProvider = () => {
  return ethersProvider
}

export const getSafeAddress = () => {
  return safe?.safeAddress
} 