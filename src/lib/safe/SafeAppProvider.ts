import SafeAppsSDK, { SafeInfo } from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'
import { ethers } from 'ethers'

let safeAppsSdk: SafeAppsSDK | undefined
let provider: SafeAppProvider | undefined
let safe: SafeInfo | undefined
let ethersProvider: ethers.providers.Web3Provider | undefined
let currentAddress: string | undefined

const validateSafeEnvironment = () => {
  if (!window.parent) {
    console.error('No parent window found - not in iframe');
    return false;
  }
  
  try {
    // Check if we're in a Safe iframe
    return window.parent !== window;
  } catch (e) {
    console.error('Error checking Safe environment:', e);
    return false;
  }
};

export const initSafeSDK = async () => {
  try {
    if (!validateSafeEnvironment()) {
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
      
      if (!safe) {
        console.error('No Safe info returned');
        return null;
      }

      if (!safe.safeAddress) {
        console.error('Safe info missing address');
        return null;
      }

      currentAddress = safe.safeAddress;
      console.log('Set current address:', currentAddress);
      
    } catch (error) {
      console.error('Error getting Safe info:', error);
      return null;
    }

    console.log('Safe detected:', {
      chainId: safe.chainId,
      safeAddress: safe.safeAddress,
      owners: safe.owners,
      threshold: safe.threshold,
      currentAddress
    });
      
    // Create Safe Provider with explicit permissions
    try {
      provider = new SafeAppProvider(safe, safeAppsSdk)
      console.log('Safe provider created');
      
      // Verify provider functionality
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
      
      // Double check the current address
      if (address && address !== currentAddress) {
        console.warn('Address mismatch, updating current address');
        currentAddress = address;
        console.log('Updated current address:', currentAddress);
      }
      
      // Verify network connection
      const network = await ethersProvider.getNetwork()
      console.log('Connected to network:', network);

      // Verify contract interaction capability
      const code = await ethersProvider.getCode(safe.safeAddress);
      console.log('Safe contract exists:', code.length > 2);
      
      // Final verification of all components
      if (!currentAddress || !safe || !provider || !ethersProvider) {
        console.error('Missing required components after initialization');
        return null;
      }
      
    } catch (error) {
      console.error('Error setting up ethers provider:', error);
      return null;
    }
    
    return {
      provider: ethersProvider,
      safe,
      sdk: safeAppsSdk,
      address: currentAddress
    }
  } catch (error) {
    console.error('Error initializing Safe SDK:', error)
    return null
  }
}

export const isSafeApp = () => {
  return validateSafeEnvironment();
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
  if (currentAddress) {
    return currentAddress;
  }
  if (safe?.safeAddress) {
    currentAddress = safe.safeAddress;
    return currentAddress;
  }
  console.warn('Attempting to get Safe address before initialization');
  return null;
}

export const getSafeSigner = () => {
  if (!ethersProvider || !currentAddress) {
    console.warn('Attempting to get Safe signer before initialization');
    return null;
  }
  return ethersProvider.getSigner(currentAddress);
}

export const getSafeBalance = async () => {
  if (!ethersProvider || !currentAddress) {
    console.warn('Attempting to get Safe balance before initialization');
    return null;
  }
  try {
    const balance = await ethersProvider.getBalance(currentAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting Safe balance:', error);
    return null;
  }
}

export const validateSafeConnection = async () => {
  if (!ethersProvider || !currentAddress || !safe) {
    return false;
  }
  
  try {
    const signer = ethersProvider.getSigner(currentAddress);
    const address = await signer.getAddress();
    const network = await ethersProvider.getNetwork();
    const code = await ethersProvider.getCode(currentAddress);
    
    return address === currentAddress && code.length > 2;
  } catch (error) {
    console.error('Error validating Safe connection:', error);
    return false;
  }
} 