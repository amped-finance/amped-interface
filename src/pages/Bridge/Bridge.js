import React, { useCallback, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import Footer from "components/Footer/Footer";
import "./Bridge.css";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import logoAmp from "img/ic_amp.svg";
import arrowSw from "img/bridge/arrow-sw.svg";
import Select from "react-select";
import { CurrencyInput } from "components/CurrencyInput/CurrencyInput";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { addressToBytes32, Options } from "@layerzerolabs/lz-v2-utilities";
import { ethers } from "ethers";
import { APP_ENVIRONMENTS } from "config/env";

import logoLL from "img/bridge/LL.png";
import logoBNB from "img/bridge/bnb.png";
import { ABI_ADAPTER, ABI_AMP, switchNetworkbridge } from "./data";
import { debounce } from "lodash";

const { DROPDOWN_CHAINS, CONTRACT_ADAPTER_AMP_LL, ADDRESS_AMP_LL, ADDRESS_AMP_BSC, API_LAYERZERO } = APP_ENVIRONMENTS;

export default function Bridge({ setPendingTxns, connectWallet }) {
  const decimals = 18;
  const [tokenFrom, setTokenFrom] = useState(DROPDOWN_CHAINS[0]);
  const [tokenTo, setTokenTo] = useState(DROPDOWN_CHAINS[1]);
  const [loading, setLoading] = useState(false);
  const [balance, setbalance] = useState("");
  const [textButton, setTextButton] = useState("Transfer");

  const [amount, setAmount] = useState("");
  const { walletProvider } = useWeb3ModalProvider();

  const { isConnected: active, address: account } = useWeb3ModalAccount();
  let { chainId } = useWeb3ModalAccount();

  const [txnHistory, setTxnHistory] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [nextToken, setNextToken] = useState("");
  const [fee, setFee] = useState("");

  const debouncedFeeBridge = useCallback(
    debounce(async (amount) => {
      console.log("1111");
      // setDebouncedSearchTerm(term);
      const contractAddress = tokenFrom.chain === "LIGHTLINK" ? ADDRESS_AMP_LL : ADDRESS_AMP_BSC;
      const contractAdapter = tokenFrom.chain === "LIGHTLINK" ? CONTRACT_ADAPTER_AMP_LL : ADDRESS_AMP_BSC;

      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();

      const oftContract = new ethers.Contract(contractAdapter, ABI_ADAPTER, signer);

      const contractToken = new ethers.Contract(contractAddress, ABI_AMP, signer);
      const amountBridge = ethers.utils.parseUnits(amount, 18);

      let options = Options.newOptions().addExecutorLzReceiveOption(150000, 0).toBytes();
      const oft = oftContract;

      const sendParam = {
        dstEid: tokenTo.value,
        to: ethers.utils.hexlify(addressToBytes32(account)), // addressToBytes32(toAddress),
        amountLD: amountBridge,
        minAmountLD: amountBridge,
        extraOptions: ethers.utils.hexlify(options),
        composeMsg: "0x", // ethers.utils.arrayify('0x'), // Assuming no composed message
        oftCmd: "0x", // ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
      };

      const feeQuote = await oft.quoteSend(sendParam, false);
      console.log("feeQuote: ", feeQuote);
      const nativeFee = feeQuote.nativeFee;

      let calFee = ethers.utils.formatEther(nativeFee);
      console.log("calFee: ", calFee);
      calFee = Math.round(calFee * 1e4) / 1e4;
      setFee(calFee);
    }, 1000),
    []
  );

  useEffect(() => {
    if (walletProvider) {
      debouncedFeeBridge(amount);
    }
  }, [amount, tokenFrom, tokenTo, walletProvider]);

  useEffect(() => {
    if (!amount || Number(amount) > Number(balance)) {
      setTextButton("Insufficient funds");
    } else {
      setTextButton("Transfer");
    }
  }, [amount, balance]);

  useEffect(() => {
    console.log("chainId: ", chainId);
  }, [chainId]);

  const handleAmountChange = (value) => {
    setAmount(String(value));
  };

  useEffect(() => {
    if (account) {
      getTxnHistory("");
    }
  }, [account]);

  useEffect(() => {
    if (walletProvider) {
      switchNetwork();
    }
  }, [tokenFrom, walletProvider]);

  const switchNetwork = async () => {
    if (!walletProvider) return;
    const check = await switchNetworkbridge(tokenFrom.chain, walletProvider);
    if (check) {
      getBalance();
    }
  };

  const getBalance = async () => {
    const contractAddress = tokenFrom.chain === "LIGHTLINK" ? ADDRESS_AMP_LL : ADDRESS_AMP_BSC;
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();
    const contractToken = new ethers.Contract(contractAddress, ABI_AMP, signer);
    const balanceOf = await contractToken.balanceOf(account);
    setbalance(ethers.utils.formatUnits(balanceOf, decimals));
  };

  const getTxnHistory = async (token) => {
    await fetch(`${API_LAYERZERO}/v1/messages/wallet/${account}?limit=20${token ? `&nextToken=${token}` : ""}`)
      .then((response) => response.json())
      .then((response) => {
        if (response?.data) {
          setTxnHistory([...txnHistory, ...response.data]);
        }

        if (response?.nextToken) {
          setLoadMore(true);
          setNextToken(response?.nextToken);
        } else {
          setLoadMore(false);
          setNextToken("");
        }
      })
      .catch((err) => {
        setLoadMore(false);
      });
  };

  useEffect(() => {
    console.log("txnHistory: ", txnHistory);
  }, [txnHistory]);

  const handleBridge = async () => {
    if (!walletProvider) return;
    let check = await switchNetworkbridge(tokenFrom.chain, walletProvider);
    if (!check) return;
    try {
      setLoading(true);
      const contractAdapter = tokenFrom.chain === "LIGHTLINK" ? CONTRACT_ADAPTER_AMP_LL : ADDRESS_AMP_BSC;
      const contractAddress = tokenFrom.chain === "LIGHTLINK" ? ADDRESS_AMP_LL : ADDRESS_AMP_BSC;

      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();

      const oftContract = new ethers.Contract(contractAdapter, ABI_ADAPTER, signer);

      const contractToken = new ethers.Contract(contractAddress, ABI_AMP, signer);
      const amountBridge = ethers.utils.parseUnits(amount, decimals);

      let options = Options.newOptions().addExecutorLzReceiveOption(150000, 0).toBytes();
      const oft = oftContract;

      const sendParam = {
        dstEid: tokenTo.value,
        to: ethers.utils.hexlify(addressToBytes32(account)), // addressToBytes32(toAddress),
        amountLD: amountBridge,
        minAmountLD: amountBridge,
        extraOptions: ethers.utils.hexlify(options),
        composeMsg: "0x", // ethers.utils.arrayify('0x'), // Assuming no composed message
        oftCmd: "0x", // ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
      };

      const feeQuote = await oft.quoteSend(sendParam, false);
      console.log("feeQuote: ", feeQuote);
      const nativeFee = feeQuote.nativeFee;

      let calFee = ethers.utils.formatEther(nativeFee);
      console.log("2222: ", calFee);
      calFee = Math.round(calFee * 1e4) / 1e4;
      setFee(calFee);

      if (tokenFrom.chain === "LIGHTLINK") {
        const allowance = await contractToken.allowance(account, contractAdapter);
        if (Number(allowance) < Number(amountBridge)) {
          setTextButton("Approving...");
          const etmApprove = await contractToken.estimateGas.approve(contractAdapter, amountBridge);

          await (
            await contractToken.approve(contractAdapter, amountBridge, {
              from: account,
              gasLimit: etmApprove.mul(150).div(100),
            })
          ).wait();
        }
      }
      //

      setTextButton("Transferring...");
      const etmBridge = await oft.estimateGas.send(sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, account, {
        value: nativeFee,
      });
      console.log("gas: ", Number(etmBridge));
      const r = await oft.send(sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, account, {
        value: nativeFee,
      });
      console.log("r: ", r);
      await r.wait();
      setLoading(false);
      getBalance();
    } catch (err) {
      console.log("err: ", err);
      setLoading(false);
      setTextButton("Transfer");
    }
  };

  const getLogoChain = (chain) => {
    switch (chain) {
      case "LIGHTLINK": {
        return logoLL;
      }
      case "BSC": {
        return logoBNB;
      }
      default:
        return "";
    }
  };

  return (
    <SEO title={getPageTitle("bridge AMP")}>
      <div className="bridge default-container page-layout">
        <div className="bridge-container">
          <div className="section-title-content">
            <div className="Page-title font-kufam">
              <Trans>Bridge</Trans>
            </div>
            <div className="Page-description">
              <Trans>Bridge AMP seamlessly and securely across blockchains.</Trans>
            </div>
            <div className="token">
              <img src={logoAmp} alt="AMP" /> AMP
            </div>
            <div className="App-card card-bridge">
              <div className="select-chain">
                <div className="box-from box-chain">
                  <div className="App-card-title font-kufam label-field">From</div>
                  <Select
                    isSearchable={false}
                    classNamePrefix="component-select"
                    value={tokenFrom}
                    onChange={(value) => {
                      setTokenFrom(value);
                      setTokenTo(DROPDOWN_CHAINS.find((item) => item.value !== value.value));
                    }}
                    options={DROPDOWN_CHAINS}
                    components={{
                      Option: ({ data, innerProps }) => {
                        return (
                          <div
                            className={`custom-option ${
                              tokenFrom.label === data.label ? "custom-option-selected" : ""
                            }`}
                            {...innerProps}
                          >
                            <img src={getLogoChain(data.chain)} /> {data.label}
                          </div>
                        );
                      },
                      SingleValue: ({ data }) => (
                        <div className="custom-option-single">
                          <span className="custom-option-label">
                            <img src={getLogoChain(data.chain)} /> {data.label}
                          </span>
                        </div>
                      ),
                    }}
                  />
                </div>
                <div
                  className="arrow"
                  onClick={() => {
                    setTokenFrom(tokenTo);
                    setTokenTo(tokenFrom);
                  }}
                >
                  <img src={arrowSw} alt="" />
                </div>
                <div className="box-to box-chain">
                  <div className="App-card-title font-kufam label-field">To</div>
                  <Select
                    isSearchable={false}
                    classNamePrefix="component-select"
                    value={tokenTo}
                    onChange={(value) => {
                      setTokenTo(value);
                      setTokenFrom(DROPDOWN_CHAINS.find((item) => item.value !== value.value));
                    }}
                    options={DROPDOWN_CHAINS}
                    components={{
                      Option: ({ data, innerProps }) => {
                        return (
                          <div
                            className={`custom-option ${tokenTo.label === data.label ? "custom-option-selected" : ""}`}
                            {...innerProps}
                          >
                            <img src={getLogoChain(data.chain)} /> {data.label}
                          </div>
                        );
                      },
                      SingleValue: ({ data }) => (
                        <div className="custom-option-single">
                          <span className="custom-option-label">
                            <img src={getLogoChain(data.chain)} /> {data.label}
                          </span>
                        </div>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="label-input">
                <div className="App-card-title font-kufam label-field">I want to transfer</div>
                <div className="App-card-title font-kufam label-field balance">
                  Balance: <span>{balance || "0.0000"}</span>
                </div>
              </div>
              <CurrencyInput
                className="input-amount"
                onChange={handleAmountChange}
                value={amount}
                disabled={!active || loading}
              />

              <div className="info">
                <div className="text">You will receive:</div>
                <div className="value">{amount ? amount : "--"} AMP</div>
              </div>
              <div className="info">
                <div className="text" title="Transaction Fees charged by LayerZero">
                  Bridge fee:
                </div>
                <div className="value">{fee ? fee : "--"} ETH</div>
              </div>
              <div className="bridge-action">
                {active ? (
                  <button
                    disabled={!amount || loading}
                    onClick={handleBridge}
                    className="App-cta Exchange-swap-button"
                    type="submit"
                  >
                    <Trans>{textButton}</Trans>
                  </button>
                ) : (
                  <button className="App-cta Exchange-swap-button" type="submit" onClick={connectWallet}>
                    <Trans>Connect Wallet</Trans>
                  </button>
                )}
              </div>
            </div>
            <div className="Page-title font-kufam txn-history">
              <Trans>Transaction History</Trans>
            </div>
            <table className="Exchange-list Orders App-box">
              <tbody>
                <th className="td-from">
                  <div>
                    <Trans>From</Trans>
                  </div>
                </th>
                <th className="td-to">
                  <div>
                    <Trans>To</Trans>
                  </div>
                </th>
                <th className="td-amount">
                  <div>
                    <Trans>Amount</Trans>
                  </div>
                </th>
                <th className="td-status">
                  <div>
                    <Trans>Status</Trans>
                  </div>
                </th>
                <th className="td-view">
                  <div>
                    <Trans>View</Trans>
                  </div>
                </th>
                {txnHistory.map((item, index) => (
                  <tr key={index}>
                    <td className="">
                      <Trans>{item?.pathway?.sender?.chain}</Trans>
                    </td>
                    <td className="">
                      <Trans>{item?.pathway?.receiver?.chain}</Trans>
                    </td>
                    <td className="">
                      <Trans>Limit</Trans>
                    </td>
                    <td className="">
                      <Trans>{item?.status?.name}</Trans>
                    </td>
                    <td className="">
                      <Trans>Limit</Trans>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
