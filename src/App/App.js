// App.js
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { SWRConfig } from "swr";
import useScrollToTop from "lib/useScrollToTop";
import { RefreshContextProvider } from "../Context/RefreshContext";
import { Switch, Route, HashRouter as Router, useLocation, useHistory } from "react-router-dom";

import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

import { cssTransition, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "components/Modal/Modal";
import Checkbox from "components/Checkbox/Checkbox";
import "styles/Shared.css";
import "styles/Font.css";
import "./App.scss";
import "styles/Input.css";

import useEventToast from "components/EventToast/useEventToast";
import EventToastContainer from "components/EventToast/EventToastContainer";
import SEO from "components/Common/SEO";
import useRouteQuery from "lib/useRouteQuery";
import { encodeReferralCode, decodeReferralCode } from "domain/referrals";

import { getContract } from "config/contracts";
import Vault from "abis/Vault.json";
import VaultV2b from "abis/VaultV2b.json";
import PositionRouter from "abis/PositionRouter.json";
import PageNotFound from "pages/PageNotFound/PageNotFound";
import PageOnPresale from "pages/PageOnPresale/PageOnPresale";
import ReferralTerms from "pages/ReferralTerms/ReferralTerms";
import TermsAndConditions from "pages/TermsAndConditions/TermsAndConditions";
import { useLocalStorage } from "react-use";
import { RedirectPopupModal } from "components/ModalViews/RedirectModal";
import { REDIRECT_POPUP_TIMESTAMP_KEY } from "config/ui";
import Jobs from "pages/Jobs/Jobs";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import { defaultLocale, dynamicActivate } from "lib/i18n";
import { Header } from "components/Header/Header";
import {
  ARBITRUM,
  PEGASUS,
  PEGASUS_RPC_PROVIDERS,
  PHOENIX,
  PHOENIX_RPC_PROVIDERS,
  getAlchemyWsUrl,
  getExplorerUrl,
  BSCTESTNET,
  BSC,
  BSC_RPC_PROVIDERS,
  BSC_TESTNET_RPC_PROVIDER,
  UNICHAINTESTNET,
  UNICHAIN_TESTNET_RPC_PROVIDER,
  SONIC,
  SONIC_RPC_PROVIDER
} from "config/chains";

import { useChainId } from "lib/chains"; // If you still want chainId from your custom chain logic
import {
  ACTIVE_CHAIN_IDS,
  NETWORK_METADATA,
} from "config/chains";

import {
  CURRENT_PROVIDER_LOCALSTORAGE_KEY,
  DISABLE_ORDER_VALIDATION_KEY,
  IS_PNL_IN_LEVERAGE_KEY,
  LANGUAGE_LOCALSTORAGE_KEY,
  REFERRAL_CODE_KEY,
  SHOULD_EAGER_CONNECT_LOCALSTORAGE_KEY,
  SHOULD_SHOW_POSITION_LINES_KEY,
  SHOW_PNL_AFTER_FEES_KEY,
  SLIPPAGE_BPS_KEY,
} from "config/localStorage";

import {
  DEFAULT_SLIPPAGE_AMOUNT,
  BASIS_POINTS_DIVISOR,
  getAppBaseUrl,
  isHomeSite,
  isMobileDevice,
  REFERRAL_CODE_QUERY_PARAM,
  isDevelopment,
  importImage,
} from "lib/legacy";

import { useLocalStorageSerializeKey } from "lib/localStorage";
import { helperToast } from "lib/helperToast";

import Home from "pages/Home/Home";
import Dashboard from "pages/Dashboard/Dashboard";
import Stake from "pages/Stake/Stake";
import { Exchange } from "pages/Exchange/Exchange";
import Actions from "pages/Actions/Actions";
import OrdersOverview from "pages/OrdersOverview/OrdersOverview";
import PositionsOverview from "pages/PositionsOverview/PositionsOverview";
import Referrals from "pages/Referrals/Referrals";
import BuyAlp from "pages/BuyAlp/BuyAlp";
import BuyAMP from "pages/BuyAMP/BuyAMP";
import Buy from "pages/Buy/Buy";
import NftWallet from "pages/NftWallet/NftWallet";
import ClaimEsAmp from "pages/ClaimEsAmp/ClaimEsAmp";
import BeginAccountTransfer from "pages/BeginAccountTransfer/BeginAccountTransfer";
import CompleteAccountTransfer from "pages/CompleteAccountTransfer/CompleteAccountTransfer";
import Leaderboard from "pages/Leaderboard/Leaderboard";

import Bridge from "pages/Bridge/Bridge";
import Mif from "pages/Mif/Mif";
import { useWeb3ConnectionContext, Web3ConnectionProvider } from "Context/Web3ConnectionContext";

if ("ethereum" in window) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const Zoom = cssTransition({
  enter: "zoomIn",
  exit: "zoomOut",
  appendPosition: false,
  collapse: true,
  collapseDuration: 200,
  duration: 200,
});

const arbWsProvider = new ethers.providers.WebSocketProvider(getAlchemyWsUrl());
const pegasusProvider = new ethers.providers.JsonRpcProvider(PEGASUS_RPC_PROVIDERS[0]);
const phoenixProvider = new ethers.providers.FallbackProvider(
  PHOENIX_RPC_PROVIDERS.map((url) => new ethers.providers.JsonRpcProvider(url))
);
const bsctestnetProvider = new ethers.providers.JsonRpcProvider(BSC_TESTNET_RPC_PROVIDER[0]);
const bscProvider = new ethers.providers.JsonRpcProvider(BSC_RPC_PROVIDERS[0]);
const sonicProvider = new ethers.providers.JsonRpcProvider(SONIC_RPC_PROVIDER[0]);

function getWsProvider(active, chainId) {
  if (!active) return;
  if (chainId === ARBITRUM) {
    return arbWsProvider;
  }
  if (chainId === PEGASUS) {
    return pegasusProvider;
  }
  if (chainId === PHOENIX) {
    return phoenixProvider;
  }
  if (chainId === BSCTESTNET) {
    return bsctestnetProvider;
  }
  if (chainId === SONIC) {
    return sonicProvider;
  }
  if (chainId === BSC) {
    return bscProvider;
  }
}

function FullApp() {
  const isHome = isHomeSite();
  const exchangeRef = useRef();

  const {
    account,
    active,
    provider,
    connect,
    disconnect,
  } = useWeb3ConnectionContext();

  const { chainId } = useChainId();

  const location = useLocation();
  const history = useHistory();
  useEventToast();

  const [redirectModalVisible, setRedirectModalVisible] = useState(false);
  const [shouldHideRedirectModal, setShouldHideRedirectModal] = useState(false);
  const [redirectPopupTimestamp, setRedirectPopupTimestamp, removeRedirectPopupTimestamp] =
    useLocalStorage(REDIRECT_POPUP_TIMESTAMP_KEY);
  const [selectedToPage, setSelectedToPage] = useState("");
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [pendingTxns, setPendingTxns] = useState([]);

  // For storing slippage, etc.
  const [savedSlippageAmount, setSavedSlippageAmount] = useLocalStorageSerializeKey(
    [chainId, SLIPPAGE_BPS_KEY],
    DEFAULT_SLIPPAGE_AMOUNT
  );
  const [slippageAmount, setSlippageAmount] = useState(0);
  const [isPnlInLeverage, setIsPnlInLeverage] = useState(false);
  const [savedIsPnlInLeverage, setSavedIsPnlInLeverage] = useLocalStorageSerializeKey(
    [chainId, IS_PNL_IN_LEVERAGE_KEY],
    false
  );

  const [showPnlAfterFees, setShowPnlAfterFees] = useState(false);
  const [savedShowPnlAfterFees, setSavedShowPnlAfterFees] = useLocalStorageSerializeKey(
    [chainId, SHOW_PNL_AFTER_FEES_KEY],
    false
  );

  const [shouldDisableValidationForTesting, setShouldDisableValidationForTesting] = useState(false);
  const [savedShouldDisableValidationForTesting, setSavedShouldDisableValidationForTesting] =
    useLocalStorageSerializeKey([chainId, DISABLE_ORDER_VALIDATION_KEY], false);

  const [savedShouldShowPositionLines, setSavedShouldShowPositionLines] = useLocalStorageSerializeKey(
    [chainId, SHOULD_SHOW_POSITION_LINES_KEY],
    false
  );


  const query = useRouteQuery();
  useEffect(() => {
    let referralCode = query.get(REFERRAL_CODE_QUERY_PARAM);
    if (!referralCode || referralCode.length === 0) {
      const params = new URLSearchParams(window.location.search);
      referralCode = params.get(REFERRAL_CODE_QUERY_PARAM);
    }
    if (referralCode && referralCode.length <= 20) {
      const encodedReferralCode = encodeReferralCode(referralCode);
      if (encodedReferralCode !== ethers.constants.HashZero) {
        localStorage.setItem(REFERRAL_CODE_KEY, encodedReferralCode);
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has(REFERRAL_CODE_QUERY_PARAM)) {
          queryParams.delete(REFERRAL_CODE_QUERY_PARAM);
          history.replace({
            search: queryParams.toString(),
          });
        }
      }
    }
  }, [query, history, location]);
  const connectWallet = useCallback(() => {
    connect();
  }, [connect]);

  const disconnectAccount = useCallback(() => {
    disconnect();
    // Optionally remove localstorage items, etc.
    localStorage.removeItem(SHOULD_EAGER_CONNECT_LOCALSTORAGE_KEY);
    localStorage.removeItem(CURRENT_PROVIDER_LOCALSTORAGE_KEY);
  }, [disconnect]);

  const disconnectAccountAndCloseSettings = () => {
    disconnectAccount();
    setIsSettingsVisible(false);
  };

  const showRedirectModal = (to) => {
    setRedirectModalVisible(true);
    setSelectedToPage(to);
  };

  const baseUrl = getAppBaseUrl();
  let appRedirectUrl = baseUrl + selectedToPage;
  const localStorageCode = window.localStorage.getItem(REFERRAL_CODE_KEY);
  if (localStorageCode && localStorageCode.length > 0 && localStorageCode !== ethers.constants.HashZero) {
    const decodedRefCode = decodeReferralCode(localStorageCode);
    if (decodedRefCode) {
      appRedirectUrl = `${appRedirectUrl}?ref=${decodedRefCode}`;
    }
  }

  useEffect(() => {
    if (!provider) return;

    const checkPendingTxns = async () => {
      const updatedPendingTxns = [];
      for (let i = 0; i < pendingTxns.length; i++) {
        const pendingTxn = pendingTxns[i];
        const receipt = await provider.getTransactionReceipt(pendingTxn.hash);
        if (receipt) {
          if (receipt.status === 0) {
            const txUrl = getExplorerUrl(chainId) + "tx/" + pendingTxn.hash;
            helperToast.error(
              <div>
                <Trans>
                  Txn failed. <ExternalLink href={txUrl}>View</ExternalLink>
                </Trans>
                <br />
              </div>
            );
          }
          if (receipt.status === 1 && pendingTxn.message) {
            const txUrl = getExplorerUrl(chainId) + "tx/" + pendingTxn.hash;
            helperToast.success(
              <div>
                {pendingTxn.message}{" "}
                <ExternalLink href={txUrl}>
                  <Trans>View</Trans>
                </ExternalLink>
                <br />
              </div>
            );
          }
          continue;
        }
        updatedPendingTxns.push(pendingTxn);
      }

      if (updatedPendingTxns.length !== pendingTxns.length) {
        setPendingTxns(updatedPendingTxns);
      }
    };

    const interval = setInterval(checkPendingTxns, 2000);
    return () => clearInterval(interval);
  }, [provider, pendingTxns, chainId]);

  const vaultAddress = getContract(chainId, "Vault");
  const positionRouterAddress = getContract(chainId, "PositionRouter");

  useEffect(() => {
    const wsVaultAbi =
      chainId === PEGASUS ||
      chainId === PHOENIX ||
      chainId === BSCTESTNET ||
      chainId === UNICHAINTESTNET ||
      chainId === BSC ||
      chainId === SONIC
        ? Vault.abi
        : VaultV2b.abi;

    const wsProvider = getWsProvider(active, chainId);
    if (!wsProvider) return;

    const wsVault = new ethers.Contract(vaultAddress, wsVaultAbi, wsProvider);
    const wsPositionRouter = new ethers.Contract(positionRouterAddress, PositionRouter.abi, wsProvider);

    const callExchangeRef = (method, ...args) => {
      if (!exchangeRef || !exchangeRef.current) {
        return;
      }
      exchangeRef.current[method](...args);
    };

    const onUpdatePosition = (...args) => callExchangeRef("onUpdatePosition", ...args);
    const onClosePosition = (...args) => callExchangeRef("onClosePosition", ...args);
    const onIncreasePosition = (...args) => callExchangeRef("onIncreasePosition", ...args);
    const onDecreasePosition = (...args) => callExchangeRef("onDecreasePosition", ...args);
    const onCancelIncreasePosition = (...args) => callExchangeRef("onCancelIncreasePosition", ...args);
    const onCancelDecreasePosition = (...args) => callExchangeRef("onCancelDecreasePosition", ...args);

    wsVault.on("UpdatePosition", onUpdatePosition);
    wsVault.on("ClosePosition", onClosePosition);
    wsVault.on("IncreasePosition", onIncreasePosition);
    wsVault.on("DecreasePosition", onDecreasePosition);
    wsPositionRouter.on("CancelIncreasePosition", onCancelIncreasePosition);
    wsPositionRouter.on("CancelDecreasePosition", onCancelDecreasePosition);

    return function cleanup() {
      wsVault.off("UpdatePosition", onUpdatePosition);
      wsVault.off("ClosePosition", onClosePosition);
      wsVault.off("IncreasePosition", onIncreasePosition);
      wsVault.off("DecreasePosition", onDecreasePosition);
      wsPositionRouter.off("CancelIncreasePosition", onCancelIncreasePosition);
      wsPositionRouter.off("CancelDecreasePosition", onCancelDecreasePosition);
    };
  }, [active, chainId, vaultAddress, positionRouterAddress]);

  const openSettings = () => {
    const slippage = parseInt(savedSlippageAmount);
    setSlippageAmount((slippage / BASIS_POINTS_DIVISOR) * 100);
    setIsPnlInLeverage(savedIsPnlInLeverage);
    setShowPnlAfterFees(savedShowPnlAfterFees);
    setShouldDisableValidationForTesting(savedShouldDisableValidationForTesting);
    setIsSettingsVisible(true);
  };

  const saveAndCloseSettings = () => {
    const slippage = parseFloat(slippageAmount);
    if (isNaN(slippage)) {
      helperToast.error(t`Invalid slippage value`);
      return;
    }
    if (slippage > 5) {
      helperToast.error(t`Slippage should be less than 5%`);
      return;
    }
    const basisPoints = (slippage * BASIS_POINTS_DIVISOR) / 100;
    if (parseInt(basisPoints) !== parseFloat(basisPoints)) {
      helperToast.error(t`Max slippage precision is 0.01%`);
      return;
    }

    setSavedIsPnlInLeverage(isPnlInLeverage);
    setSavedShowPnlAfterFees(showPnlAfterFees);
    setSavedShouldDisableValidationForTesting(shouldDisableValidationForTesting);
    setSavedSlippageAmount(basisPoints);
    setIsSettingsVisible(false);
  };
  return (
    <>
      <div className="App">
        <div className="App-content">
          <Header
            disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            openSettings={openSettings}
            setWalletModalVisible={() => null}
            redirectPopupTimestamp={redirectPopupTimestamp}
            showRedirectModal={showRedirectModal}
          />
          {isHome ? (
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/referral-terms">
                <ReferralTerms />
              </Route>
              <Route exact path="/terms-and-conditions">
                <TermsAndConditions />
              </Route>
              <Route path="/buy_alp151">
                <PageOnPresale />
              </Route>
              <Route path="*">
                <PageNotFound />
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/trade">
                <Exchange
                  ref={exchangeRef}
                  savedShowPnlAfterFees={savedShowPnlAfterFees}
                  savedIsPnlInLeverage={savedIsPnlInLeverage}
                  setSavedIsPnlInLeverage={setSavedIsPnlInLeverage}
                  savedSlippageAmount={savedSlippageAmount}
                  setPendingTxns={setPendingTxns}
                  pendingTxns={pendingTxns}
                  savedShouldShowPositionLines={savedShouldShowPositionLines}
                  setSavedShouldShowPositionLines={setSavedShouldShowPositionLines}
                  connectWallet={connectWallet}
                  savedShouldDisableValidationForTesting={savedShouldDisableValidationForTesting}
                />
              </Route>
              <Route exact path="/dashboard">
                <Dashboard />
              </Route>
              <Route exact path="/earn">
                <Stake setPendingTxns={setPendingTxns} connectWallet={connectWallet} />
              </Route>
              <Route exact path="/buy">
                <Buy
                  savedSlippageAmount={savedSlippageAmount}
                  setPendingTxns={setPendingTxns}
                  connectWallet={connectWallet}
                />
              </Route>
              <Route exact path="/buy_alp">
                <BuyAlp
                  savedSlippageAmount={savedSlippageAmount}
                  setPendingTxns={setPendingTxns}
                  connectWallet={connectWallet}
                  savedShouldDisableValidationForTesting={savedShouldDisableValidationForTesting}
                />
              </Route>
              <Route exact path="/jobs">
                <Jobs />
              </Route>
              <Route exact path="/bridge">
                <Bridge setPendingTxns={setPendingTxns} connectWallet={connectWallet} />
              </Route>
              <Route exact path="/mif">
                <Mif />
              </Route>
              <Route exact path="/referrals">
                <Referrals
                  pendingTxns={pendingTxns}
                  connectWallet={connectWallet}
                  setPendingTxns={setPendingTxns}
                />
              </Route>
              <Route exact path="/referrals/:account">
                <Referrals
                  pendingTxns={pendingTxns}
                  connectWallet={connectWallet}
                  setPendingTxns={setPendingTxns}
                />
              </Route>
              <Route exact path="/nft_wallet">
                <NftWallet />
              </Route>
              <Route exact path="/claim_es_amp">
                <ClaimEsAmp setPendingTxns={setPendingTxns} />
              </Route>
              <Route exact path="/actions">
                <Actions />
              </Route>
              <Route exact path="/actions/:account">
                <Actions />
              </Route>
              <Route exact path="/orders_overview">
                <OrdersOverview />
              </Route>
              <Route exact path="/positions_overview">
                <PositionsOverview />
              </Route>
              <Route exact path="/begin_account_transfer">
                <BeginAccountTransfer setPendingTxns={setPendingTxns} />
              </Route>
              <Route exact path="/complete_account_transfer/:sender/:receiver">
                <CompleteAccountTransfer setPendingTxns={setPendingTxns} />
              </Route>
              <Route exact path="/referral-terms">
                <ReferralTerms />
              </Route>
              <Route exact path="/terms-and-conditions">
                <TermsAndConditions />
              </Route>
              <Route path="/buy_alp151">
                <PageOnPresale />
              </Route>
              <Route path="/leaderboard">
                <Leaderboard />
              </Route>
              <Route path="*">
                <PageNotFound />
              </Route>
            </Switch>
          )}
        </div>
      </div>
      <ToastContainer
        limit={1}
        transition={Zoom}
        position="bottom-right"
        autoClose={7000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        draggable={false}
        pauseOnHover
      />
      <EventToastContainer />
      <RedirectPopupModal
        redirectModalVisible={redirectModalVisible}
        setRedirectModalVisible={setRedirectModalVisible}
        appRedirectUrl={appRedirectUrl}
        setRedirectPopupTimestamp={setRedirectPopupTimestamp}
        setShouldHideRedirectModal={setShouldHideRedirectModal}
        shouldHideRedirectModal={shouldHideRedirectModal}
        removeRedirectPopupTimestamp={removeRedirectPopupTimestamp}
      />
      <Modal
        className="App-settings"
        isVisible={isSettingsVisible}
        setIsVisible={setIsSettingsVisible}
        label={t`Settings`}
      >
        <div className="App-settings-row">
          <div>
            <Trans>Allowed Slippage</Trans>
          </div>
          <div className="App-slippage-tolerance-input-container">
            <input
              type="number"
              className="App-slippage-tolerance-input"
              min="0"
              value={slippageAmount}
              onChange={(e) => setSlippageAmount(e.target.value)}
            />
            <div className="App-slippage-tolerance-input-percent">%</div>
          </div>
        </div>
        <div className="Exchange-settings-row">
          <Checkbox isChecked={showPnlAfterFees} setIsChecked={setShowPnlAfterFees}>
            <Trans>Display PnL after fees</Trans>
          </Checkbox>
        </div>
        <div className="Exchange-settings-row">
          <Checkbox isChecked={isPnlInLeverage} setIsChecked={setIsPnlInLeverage}>
            <Trans>Include PnL in leverage display</Trans>
          </Checkbox>
        </div>
        {isDevelopment() && (
          <div className="Exchange-settings-row">
            <Checkbox isChecked={shouldDisableValidationForTesting} setIsChecked={setShouldDisableValidationForTesting}>
              <Trans>Disable order validations</Trans>
            </Checkbox>
          </div>
        )}

        <button className="App-cta Exchange-swap-button" onClick={saveAndCloseSettings}>
          <Trans>Save</Trans>
        </button>
      </Modal>
    </>
  );
}

function App() {
  useScrollToTop();

  // Handle i18n on mount
  useEffect(() => {
    const defaultLanguage = localStorage.getItem(LANGUAGE_LOCALSTORAGE_KEY) || defaultLocale;
    dynamicActivate(defaultLanguage);
  }, []);

  return (
    <SWRConfig value={{ refreshInterval: 5000 }}>
      <RefreshContextProvider>
        <Web3ConnectionProvider>
          <Router>
            <I18nProvider i18n={i18n}>
              <SEO>
                <FullApp />
              </SEO>
            </I18nProvider>
          </Router>
        </Web3ConnectionProvider>
      </RefreshContextProvider>
    </SWRConfig>
  );
}

export default App;
