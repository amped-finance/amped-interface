import React, { ReactNode } from "react";
import { HeaderLink } from "./HeaderLink";
import { Trans } from "@lingui/macro";
import "./Header.css";

type DropdownItem = {
  label: ReactNode;
  to: string;
};

type Props = {
  label: ReactNode;
  items: DropdownItem[];
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function HeaderDropdown({ label, items, redirectPopupTimestamp, showRedirectModal }: Props) {
  return (
    <div className="App-header-dropdown">
      <div className="App-header-dropdown-label" role="button" aria-haspopup="true">
        {label}
      </div>
      <div className="App-header-dropdown-content" role="menu">
        {items.map((item) => (
          <HeaderLink
            key={item.to}
            to={item.to}
            redirectPopupTimestamp={redirectPopupTimestamp}
            showRedirectModal={showRedirectModal}
          >
            {item.label}
          </HeaderLink>
        ))}
      </div>
    </div>
  );
} 