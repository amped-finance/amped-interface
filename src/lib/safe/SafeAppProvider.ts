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
      debug: true
    });
    
    // Get Safe Info first
    try {
      safe = await safeAppsSdk.safe.getInfo()
      console.log('Safe info retrieved:', safe);
    } catch (error) {
      console.error('Error getting Safe info:', error);
      return null;
    }
    
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
      
    // Create Safe Provider with explicit permissions
    try {
      provider = new SafeAppProvider(safe, safeAppsSdk)
      console.log('Safe provider created');
      
      // Create temporary ethers provider to test balance
      const tempProvider = new ethers.providers.Web3Provider(provider as any)
      const balance = await tempProvider.getBalance(safe.safeAddress);
      console.log('Safe balance:', ethers.utils.formatEther(balance));
      
    } catch (error) {
      console.error('Error creating Safe provider:', error);
      return null;
    }
    
    // Create and verify Ethers Provider
    try {
      ethersProvider = new ethers.providers.Web3Provider(provider as any)
      
      // Verify we can access the Safe
      const signer = ethersProvider.getSigner(safe.safeAddress);
      const address = await signer.getAddress();
      console.log('Signer address verified:', address);
      
      // Verify network connection
      const network = await ethersProvider.getNetwork()
      console.log('Connected to network:', network);

      // Test basic functionality
      const code = await ethersProvider.getCode(safe.safeAddress);
      const balance = await ethersProvider.getBalance(safe.safeAddress);
      console.log('Safe contract exists:', code.length > 2);
      console.log('Safe balance:', ethers.utils.formatEther(balance));
      
    } catch (error) {
      console.error('Error setting up ethers provider:', error);
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
    return null;
  }
  return ethersProvider
}

export const getSafeAddress = () => {
  if (!safe) {
    console.warn('Attempting to get Safe address before initialization');
    return null;
  }
  return safe?.safeAddress
}

export const getSafeSigner = () => {
  if (!ethersProvider || !safe?.safeAddress) {
    console.warn('Attempting to get Safe signer before initialization');
    return null;
  }
  return ethersProvider.getSigner(safe.safeAddress);
}

export const getSafeBalance = async () => {
  if (!ethersProvider || !safe?.safeAddress) {
    console.warn('Attempting to get Safe balance before initialization');
    return null;
  }
  try {
    const balance = await ethersProvider.getBalance(safe.safeAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting Safe balance:', error);
    return null;
  }
} 