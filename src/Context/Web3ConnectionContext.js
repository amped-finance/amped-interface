import useWeb3Connection from "hooks/useWeb3Connection";
import React, { createContext, useContext } from "react";

const Web3ConnectionContext = createContext(null);

export function Web3ConnectionProvider({ children }) {
  const web3Connection = useWeb3Connection();

  return (
    <Web3ConnectionContext.Provider value={web3Connection}>
      {children}
    </Web3ConnectionContext.Provider>
  );
}

export function useWeb3ConnectionContext() {
  const context = useContext(Web3ConnectionContext);
  if (!context) {
    throw new Error(
      "useWeb3ConnectionContext() must be used inside a <Web3ConnectionProvider>"
    );
  }
  return context;
}
