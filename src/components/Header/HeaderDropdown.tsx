import React, { ReactNode } from "react";
import { HeaderLink } from "./HeaderLink";
import { Trans } from "@lingui/macro";
import "./Header.css";

type DropdownItem = {
  label: string;
  to: string;
};

type Props = {
  label: string;
  items: DropdownItem[];
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function HeaderDropdown({ label, items, redirectPopupTimestamp, showRedirectModal }: Props) {
  return (
    <div className="App-header-dropdown">
      <div className="App-header-dropdown-label">
        <Trans>{label}</Trans>
      </div>
      <div className="App-header-dropdown-content">
        {items.map((item) => (
          <HeaderLink
            key={item.to}
            to={item.to}
            redirectPopupTimestamp={redirectPopupTimestamp}
            showRedirectModal={showRedirectModal}
          >
            <Trans>{item.label}</Trans>
          </HeaderLink>
        ))}
      </div>
    </div>
  );
} 