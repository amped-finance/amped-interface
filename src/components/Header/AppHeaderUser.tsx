import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";
import React, { useCallback, useEffect, useMemo } from "react";
import { HeaderLink } from "./HeaderLink";
import connectWalletImg from "img/ic_wallet_24.svg";
import { isSafeApp, getSafeInfo } from "../../lib/safe/SafeAppProvider";

import "./Header.css";
import { isHomeSite, getAccountUrl } from "lib/legacy";
import { isDevelopment } from "lib/legacy";
import cx from "classnames";
import { Trans } from "@lingui/macro";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";
import { SUPPORTED_CHAIN_IDS, getChainName } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useDisconnect,
  createWeb3Modal,
  defaultConfig
} from "@web3modal/ethers5/react";

type Props = {
  openSettings: () => void;
  small?: boolean;
  setWalletModalVisible: (visible: boolean) => void;
  disconnectAccountAndCloseSettings: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function AppHeaderUser({
  openSettings,
  small,
  setWalletModalVisible,
  disconnectAccountAndCloseSettings,
  redirectPopupTimestamp,
  showRedirectModal,
}: Props) {
  const { chainId } = useChainId();
  const { isConnected: active, address: account } = useWeb3ModalAccount()
  const { open } = useWeb3Modal()
  const showConnectionOptions = !isHomeSite();

  // Get Safe info if we're in a Safe app
  const safeInfo = useMemo(() => {
    if (isSafeApp()) {
      return getSafeInfo();
    }
    return null;
  }, []);

  useEffect(() => {
    if (active || safeInfo) {
      setWalletModalVisible(false);
    }
  }, [active, safeInfo, setWalletModalVisible]);

  // const networkOptions = [
  //   {
  //     label: getChainName(chainId),
  //     value: chainId,
  //     icon: `ic_${getChainName(chainId).toLowerCase()}.png`,
  //     color: "#E841424D",
  //   },
  // ];
  const networkOptions = 
    SUPPORTED_CHAIN_IDS.map((_chain) => {
      return {
        label: getChainName(_chain),
        value: _chain,
        icon: `ic_${getChainName(_chain).toLowerCase()}.png`,
        color: "#E841424D",
      }
    })

  const onNetworkSelect = useCallback(
    (option) => {
      if (option.value === chainId) {
        return;
      }
      return switchNetwork(option.value, active);
    },
    [chainId, active]
  );

  const selectorLabel = getChainName(chainId);

  // Use Safe address if available, otherwise use account from web3modal
  const displayAddress = safeInfo?.safeAddress || account;
  const accountUrl = getAccountUrl(chainId, displayAddress);

  if (!active && !isSafeApp()) {
    return (
      <div className="App-header-user">
        <div className={cx("App-header-trade-link", { "homepage-header": isHomeSite() })}>
          <HeaderLink
            className="btn-trade button-primary btn-header"
            to="/trade"
            redirectPopupTimestamp={redirectPopupTimestamp}
            showRedirectModal={showRedirectModal}
          >
            <Trans>Trade</Trans>
          </HeaderLink>
        </div>

        {showConnectionOptions ? (
          <>
            <ConnectWalletButton onClick={open}>
              {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectWalletButton>
            <NetworkDropdown
              small={small}
              networkOptions={networkOptions}
              selectorLabel={selectorLabel}
              onNetworkSelect={onNetworkSelect}
              openSettings={openSettings}
            />
          </>
        ) : (
          <LanguagePopupHome />
        )}
      </div>
    );
  }

  return (
    <div className="App-header-user">
      <div className="App-header-trade-link">
        <HeaderLink
          className="button-primary btn-trade btn-header"
          to="/trade"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Trade</Trans>
        </HeaderLink>
      </div>

      {showConnectionOptions ? (
        <>
          <div className="App-header-user-address">
            <AddressDropdown
              account={displayAddress}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
          <NetworkDropdown
            small={small}
            networkOptions={networkOptions}
            selectorLabel={selectorLabel}
            onNetworkSelect={onNetworkSelect}
            openSettings={openSettings}
          />
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
