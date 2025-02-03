import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { SafeAppWeb3Modal } from "@safe-global/safe-apps-web3modal";
import { useWeb3ModalAccount, useWeb3ModalProvider, useWeb3Modal, defaultConfig, createWeb3Modal, useDisconnect } from "@web3modal/ethers5/react";
import { ACTIVE_CHAIN_IDS, NETWORK_METADATA } from "config/chains";
import { map, mapValues } from "lodash";
import {
  importImage,
} from "lib/legacy";

const metadata = {
  name: "LightLink Bridge",
  description:
    "LightLink Bridge facilitates seamless communication between blockchains, enabling the transfer of information and assets with heightened security and efficiency.`",
  url: window.location.hostname,
  icons: [],
};

const _chains = map(ACTIVE_CHAIN_IDS, (chainId) => ({
  rpcUrl: NETWORK_METADATA[chainId].rpcUrls[0],
  explorerUrl: NETWORK_METADATA[chainId].blockExplorerUrls[0],
  currency: NETWORK_METADATA[chainId].nativeCurrency.name,
  name: NETWORK_METADATA[chainId].chainName,
  chainId: parseInt(NETWORK_METADATA[chainId].chainId),
}));

const web3ModalConfig = {
  ethersConfig: defaultConfig({
    metadata,
    defaultChainId: ACTIVE_CHAIN_IDS[0],
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: NETWORK_METADATA[ACTIVE_CHAIN_IDS[0]].rpcUrls[0],
  }),
  chains: _chains,
  projectId: "b6587c240d0d3c291075db2d8424aa71",

  themeVariables: {
    "--w3m-z-index": 9999,
  },
  chainImages: mapValues(NETWORK_METADATA, (metadata) => importImage(`ic_${metadata.chainName.toLowerCase()}.png`)),
}

createWeb3Modal(web3ModalConfig);

const useWeb3Connection = () => {
  const { isConnected, address } = useWeb3ModalAccount();
  const { disconnect: disconnectWeb3Modal } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();
  const [account, setAccount] = useState(null);
  const [active, setActive] = useState(false);
  const [provider, setProvider] = useState(null);
  const { open, close } = useWeb3Modal();
  const [safeModal, setSafeModal] = useState(null);

  useEffect(() => {
    const initConnection = async () => {
      await connect();
    };

    initConnection();
  }, []);

  const connect = useCallback(async () => {
    const _safeModal = new SafeAppWeb3Modal(web3ModalConfig);
    
    const safeProvider = await _safeModal.requestProvider();
    const loadedAsSafeApp = await _safeModal.isSafeApp();
    if (loadedAsSafeApp) {
      setActive(true);
      setProvider(new ethers.providers.Web3Provider(safeProvider));
      setAccount(safeProvider.safe.safeAddress);
      setSafeModal(_safeModal);
      return;
    }
    if (!loadedAsSafeApp) {
      open();
    }
  }, [isConnected, address, walletProvider, open]);

  const disconnectHandler = useCallback(async () => {
    disconnectWeb3Modal();
    if (safeModal) {
      safeModal.close();
    }
  })
  
  return { 
    account: account || address,
    active: active || isConnected,
    provider: provider || (walletProvider ? new ethers.providers.Web3Provider(walletProvider) : null),
    connect,
    disconnect: disconnectHandler
  };
};

export default useWeb3Connection;
