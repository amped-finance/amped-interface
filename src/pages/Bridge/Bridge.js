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
import ExternalLink from "components/ExternalLink/ExternalLink";
import { ShareSvg } from "./ShareSvg";
import { helperToast } from "lib/helperToast";
import moment from "moment";

const {
  DROPDOWN_CHAINS,
  CONTRACT_ADAPTER_AMP_LL,
  ADDRESS_AMP_LL,
  ADDRESS_AMP_BSC,
  API_LAYERZERO,
  EXPLORER_LAYERZERO_SCAN,
} = APP_ENVIRONMENTS;

const pageSize = 10;

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

  const [txnHistory, setTxnHistory] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [nextToken, setNextToken] = useState("");
  const [fee, setFee] = useState("");
  const [disabled, setDisabled] = useState(false);

  const getUTCDate = (timestamp) => {
    const date = new Date(timestamp);
    return moment.utc(date).format("MM/DD/YYYY, HH:mm");
  };

  const debouncedFeeBridge = useCallback(
    debounce(async (amount, walletProvider) => {
      const contractAdapter = tokenFrom.chain === "LIGHTLINK" ? CONTRACT_ADAPTER_AMP_LL : ADDRESS_AMP_BSC;

      const provider = new ethers.providers.Web3Provider(walletProvider);
      if (!provider) return;
      const signer = provider.getSigner();

      const oftContract = new ethers.Contract(contractAdapter, ABI_ADAPTER, signer);

      const amountBridge = ethers.utils.parseUnits(String(Number(amount)), 18);

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

      try {
        const feeQuote = await oft.quoteSend(sendParam, false);
        const nativeFee = feeQuote.nativeFee;

        let calFee = ethers.utils.formatEther(nativeFee);
        calFee = Math.round(calFee * 1e4) / 1e4;
        setFee(calFee);
      } catch (xxx) {
        console.log("err: ", xxx);
      }
    }, 1000),
    [walletProvider]
  );

  useEffect(() => {
    if (walletProvider && Number(amount)) {
      debouncedFeeBridge(amount, walletProvider);
    }
  }, [amount, tokenFrom, tokenTo, walletProvider]);

  useEffect(() => {
    if (!amount || Number(amount) > Number(balance)) {
      setTextButton("Insufficient funds");
      setDisabled(true);
    } else {
      setTextButton("Transfer");
      setDisabled(false);
    }
  }, [amount, balance]);

  const handleAmountChange = (value) => {
    setAmount(String(value));
  };

  useEffect(() => {
    if (account) {
      getTxnHistory();
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

  const getTxnHistory = async () => {
    setLoadingTable(true);
    await fetch(`${API_LAYERZERO}/v1/messages/wallet/${account}`)
      .then((response) => response.json())
      .then((response) => {
        setLoadingTable(false);
        if (response?.data) {
          setTxnHistory(
            response.data.filter(
              (item) =>
                item?.pathway?.receiver?.address === ADDRESS_AMP_BSC.toLocaleLowerCase() ||
                item?.pathway?.sender?.address === ADDRESS_AMP_BSC.toLocaleLowerCase()
            )
          );
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
        setLoadingTable(false);
        setLoadMore(false);
      });
  };

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
      const amountBridge = ethers.utils.parseUnits(String(Number(amount)), decimals);

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
      const nativeFee = feeQuote.nativeFee;

      let calFee = ethers.utils.formatEther(nativeFee);
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
      const r = await oft.send(sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, account, {
        value: nativeFee,
      });
      await r.wait();
      helperToast.success(
        <div>
          Successful!{" "}
          <ExternalLink href={`${EXPLORER_LAYERZERO_SCAN}tx/${r?.hash}`}>
            <Trans>View</Trans>
          </ExternalLink>
          <br />
        </div>
      );
      setLoading(false);
      getBalance();
    } catch (err) {
      console.log("err: ", err);
      helperToast.error(<div>{err?.message}</div>);
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

  const getChainFromLayerZero = (chain) => {
    switch (chain) {
      case "lightlink-testnet":
        return (
          <span>
            <img className="td-icon-chain" src={logoLL} />
            Lightlink Pegasus Testnet
          </span>
        );
      case "lightlink": {
        return (
          <span>
            <img className="td-icon-chain" src={logoLL} />
            Lightlink Phoenix Mainnet
          </span>
        );
      }
      case "bsc-testnet":
        return (
          <span>
            <img className="td-icon-chain" src={logoBNB} />
            BNB Smart Chain Testnet
          </span>
        );
      case "bsc": {
        return (
          <span>
            <img className="td-icon-chain" src={logoBNB} />
            BNB Smart Chain Mainnet
          </span>
        );
      }
      default:
        return <span>{chain}</span>;
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
                    disabled={!amount || loading || disabled}
                    onClick={handleBridge}
                    className="App-cta Exchange-swap-button"
                    type="submit"
                  >
                    {textButton}
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
            {txnHistory.length ? (
              <>
                <div className="table-txn-history">
                  <table className="Exchange-list Orders App-box txn-history-list">
                    <tbody>
                      <th className="td-1">
                        <div>
                          <Trans>From</Trans>
                        </div>
                      </th>
                      <th className="td-2">
                        <div>
                          <Trans>To</Trans>
                        </div>
                      </th>
                      <th className="td-3">
                        <div>
                          <Trans>Time</Trans>
                        </div>
                      </th>
                      <th className="td-4">
                        <div>
                          <Trans>Status</Trans>
                        </div>
                      </th>
                      <th className="td-5">
                        <div>
                          <Trans>View</Trans>
                        </div>
                      </th>
                      {txnHistory.map((item, index) => (
                        <tr key={index}>
                          <td className="td-1">{getChainFromLayerZero(item?.pathway?.sender?.chain)}</td>
                          <td className="td-2">{getChainFromLayerZero(item?.pathway?.receiver?.chain)}</td>
                          <td className="td-3">{getUTCDate(item?.created)}</td>
                          <td className="td-4">{item?.status?.name}</td>
                          <td className="td-5">
                            <ExternalLink
                              className="plain"
                              href={`${EXPLORER_LAYERZERO_SCAN}tx/${item?.source?.tx?.txHash}`}
                            >
                              <ShareSvg />
                            </ExternalLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* {loadMore && (
                  <div className="load-more">
                    <button onClick={() => getTxnHistory(nextToken)} className="load-more button-secondary">
                      {loadingTable ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )} */}
              </>
            ) : (
              <div className="no-data">
                <Trans>No transactions data</Trans>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
