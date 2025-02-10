import React from "react";
import { FiX } from "react-icons/fi";
import { Trans } from "@lingui/macro";
import { Link } from "react-router-dom";

import { HeaderLink } from "./HeaderLink";
import { HeaderDropdown } from "./HeaderDropdown";
import "./Header.css";
import { isHomeSite } from "lib/legacy";
import ExternalLink from "components/ExternalLink/ExternalLink";
import logoImg from "img/logo.svg";

type Props = {
  small?: boolean;
  clickCloseIcon?: () => void;
  openSettings?: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function AppHeaderLinks({
  small,
  openSettings,
  clickCloseIcon,
  redirectPopupTimestamp,
  showRedirectModal,
}: Props) {
  return (
    <div className="App-header-links">
      {small && (
        <div className="App-header-links-header">
          <Link className="App-header-link-main" to="/">
            <img src={logoImg} alt="AMP Logo" />
          </Link>
          <div
            className="App-header-menu-icon-block mobile-cross-menu"
            onClick={() => clickCloseIcon && clickCloseIcon()}
          >
            <FiX className="App-header-menu-icon" />
          </div>
        </div>
      )}
      <div className="App-header-link-container">
        <HeaderLink
          to="/dashboard"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Dashboard</Trans>
        </HeaderLink>
      </div>
      <HeaderDropdown
        label={<Trans>Earn</Trans>}
        items={[
          { label: <Trans>Earn</Trans>, to: "/earn" },
          { label: <Trans>Buy / LP</Trans>, to: "/buy" },
        ]}
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      />
      <HeaderDropdown
        label={<Trans>Community</Trans>}
        items={[
          { label: <Trans>Leaderboard</Trans>, to: "/leaderboard" },
          { label: <Trans>Referrals</Trans>, to: "/referrals" },
        ]}
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      />
      <div className="App-header-link-container">
        <HeaderLink to="/bridge" redirectPopupTimestamp={redirectPopupTimestamp} showRedirectModal={showRedirectModal}>
          <Trans>Bridge</Trans>
        </HeaderLink>
      </div>
      {/* <div className="App-header-link-container">
        <ExternalLink href="https://ido.amped.finance">
          <Trans>IDO</Trans>
        </ExternalLink>
      </div> */}
      <div className="App-header-link-container">
        <HeaderLink
          to="/index-funds"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Index Funds</Trans>
        </HeaderLink>
      </div>
      <HeaderDropdown
        label={<Trans>Resources</Trans>}
        items={[
          {
            label: <Trans>Docs</Trans>,
            to: "https://amped.gitbook.io/amped/",
          },
          {
            label: <Trans>Analytics</Trans>,
            to: "https://stats.amped.finance",
          },
        ]}
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      />

      {small && !isHomeSite() && (
        <div className="App-header-link-container">
          {/* eslint-disable-next-line */}
          <a href="#" onClick={openSettings}>
            <Trans>Settings</Trans>
          </a>
        </div>
      )}
    </div>
  );
}
