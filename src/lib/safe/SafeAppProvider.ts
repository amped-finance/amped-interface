import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { ethers } from 'ethers'

let safeAppsSdk: SafeAppsSDK | undefined
let provider: SafeAppProvider | undefined
let safe: SafeInfo | undefined

export const initSafeSDK = async () => {
  try {
    safeAppsSdk = new SafeAppsSDK()
    safe = await safeAppsSdk.safe.getInfo()
    
    if (safe) {
      provider = new SafeAppProvider(safe, safeAppsSdk)
      return {
        provider: new ethers.providers.Web3Provider(provider),
        safe
      }
    }
  } catch (error) {
    console.error('Error initializing Safe SDK:', error)
  }
  return null
}

export const isSafeApp = () => {
  return !!safe
}

export const getSafeInfo = () => {
  return safe
}

export const getSafeSDK = () => {
  return safeAppsSdk
}

export const getSafeProvider = () => {
  return provider ? new ethers.providers.Web3Provider(provider) : null
} 