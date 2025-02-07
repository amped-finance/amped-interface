import { Trans } from "@lingui/macro";
import "./Mif.css";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import ChartPrice from "./Chart";
import TxnHistories from "./TxnHistories";
import { APP_ENVIRONMENTS } from "config/env";
import { map, isNaN, size, find, toLower, isEmpty } from "lodash";
import { ChainSupported, formatAddress, formatBalance, formatNumber } from "config/helper";
import { useEffect, useMemo, useState } from "react";
import { CurrencyInput } from "components/CurrencyInput/CurrencyInput";
import { ethers } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { Options, addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { helperToast } from "lib/helperToast";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { switchNetworkbridge } from "pages/Bridge/data";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ModalCreateIndex from "./ModalCreateIndex/ModalCreateIndex";
import { handleGetMetadata, handleGetPools } from "services/tokens/action";
import { OFT_ABI } from "config/contracts/oft.abi";
import { ERC20_ABI } from "config/contracts/erc20.abi";
import { handleGetTokenRefs } from "services/tokens/action";
import Select from "react-select";

const TAB_OPTIONS_CHART = ["day", "week", "month", "year"];
const TAB_OPTION_CHART_LABELS = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const POOL_PRICE_DECIMALS = 6;

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function Mif() {
  const [activeTabChart, setActiveTabChart] = useState(TAB_OPTIONS_CHART[0]);
  const [activeTabAction, setActiveTabAction] = useState(1);

  const [isLoadingBuy, setIsLoadingBuy] = useState(false);
  const [isLoadingSell, setIsLoadingSell] = useState(false);
  const [amountBuy, setAmountBuy] = useState("");
  const [amountSell, setAmountSell] = useState("");

  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected: active, address: account } = useWeb3ModalAccount();

  const [providerSourceChain, setProviderSourceChain] = useState(
    new ethers.providers.JsonRpcProvider(APP_ENVIRONMENTS.CHAINS[ChainSupported.Lightlink].RPC)
  );

  const [balanceUsdt, setBalanceUsdt] = useState(0);
  const [balancePool, setBalancePool] = useState(0);
  const [decimalsUsdt, setDecimalsUsdt] = useState(0);
  const [decimalsPool, setDecimalsPool] = useState(18);

  const [triggerFetch, setTriggerFetch] = useState(0);

  const [metadata, setMetadata] = useState();
  const [tokens, setTokens] = useState([]);

  const [pools, setPools] = useState();
  const [selectPool, setSelectPool] = useState();
  const [showModalCreateIndex, setShowModalCreateIndex] = useState(false);

  const oftContract = useMemo(async () => {
    if (!metadata || !walletProvider || !providerSourceChain) return;
    const lz_usdt = metadata?.contracts?.source?.lz_usdt?.address;
    const LZ_ABI = metadata?.contracts?.source?.lz_usdt?.abi;
    const lzContract = new ethers.Contract(lz_usdt, LZ_ABI, providerSourceChain);

    const usdtAddress = await lzContract.token();
    return new ethers.Contract(usdtAddress, OFT_ABI, providerSourceChain);
  }, [metadata, walletProvider, providerSourceChain]);

  const tokenContract = useMemo(async () => {
    if (!(await oftContract) || !metadata || !walletProvider || !providerSourceChain) return;
    const token = await (await oftContract).token();

    return new ethers.Contract(token, ERC20_ABI, providerSourceChain);
  }, [oftContract, metadata, walletProvider, providerSourceChain]);

  const tokenContractPool = useMemo(async () => {
    if (!metadata || !walletProvider || !selectPool || !providerSourceChain) return;
    const token = selectPool?.metadata?.token_address;

    return new ethers.Contract(token, ERC20_ABI, providerSourceChain);
  }, [oftContract, metadata, walletProvider, selectPool, providerSourceChain]);

  useEffect(() => {
    getMetadata();
    getPools();
  }, []);

  useEffect(() => {
    getListTokens();
  }, []);

  const getListTokens = async () => {
    const res = await handleGetTokenRefs();
    if (res.success) {
      setTokens(res?.data?.items);
    } else {
      setTokens([]);
    }
  };

  const getMetadata = async () => {
    const data = await handleGetMetadata();
    if (data?.success) {
      setMetadata(data?.data);
    } else {
      setMetadata(undefined);
    }
  };

  const getPools = async () => {
    const data = await handleGetPools();
    if (data?.success) {
      setPools(data?.data?.items);
      if (!isEmpty(data?.data?.items)) {
        setSelectPool(data?.data?.items[0]);
      }
    } else {
      setPools([]);
    }
  };

  useEffect(() => {
    if (active && walletProvider) {
      getConfig();
    }
  }, [active, walletProvider]);

  const getConfig = async () => {
    const provider = new ethers.providers.Web3Provider(walletProvider);
    setProviderSourceChain(provider.getSigner());
  };

  useEffect(() => {
    if (walletProvider) {
      switchNetwork();
    }
  }, [walletProvider]);

  const switchNetwork = async () => {
    if (!walletProvider) return;
    await switchNetworkbridge(ChainSupported.Lightlink, walletProvider);
  };

  const getBalanceUsdt = async () => {
    if (!(await tokenContract)) return;
    const balance = await (await tokenContract).balanceOf(account);
    setBalanceUsdt(balance);
  };

  useEffect(() => {
    if (account) {
      getBalanceUsdt();
    }
  }, [account]);

  const getDecimalsUsdt = async () => {
    if (!(await tokenContract)) return;
    const decimals = await (await tokenContract).decimals();
    setDecimalsUsdt(decimals);
  };

  useEffect(() => {
    if (tokenContract) {
      getDecimalsUsdt();
      if (active) {
        getBalanceUsdt();
      }
    }
  }, [tokenContract, active]);

  const getBalancePool = async () => {
    if (!(await tokenContractPool)) return;
    const data = await (await tokenContractPool).balanceOf(account);
    setBalancePool(data);
  };

  const getDecimalsPool = async () => {
    try {
      if (!(await tokenContractPool)) return;
      const decimals = await (await tokenContractPool).decimals();
      setDecimalsPool(decimals);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    if (tokenContractPool) {
      getDecimalsPool();
      if (active) {
        getBalancePool();
      }
    }
  }, [tokenContractPool, active]);

  const buy = async () => {
    if (!walletProvider) return;
    let check = await switchNetworkbridge(ChainSupported.Lightlink, walletProvider);
    if (!check) return;
    setIsLoadingBuy(true);
    try {
      const to = account;
      const contractAddress = metadata?.contracts?.source?.gateway?.address;
      const ABI = metadata?.contracts?.source?.gateway?.abi;
      const eidB = metadata?.chains?.[selectPool?.metadata?.dest_chain]?.lz_eid;
      const poolId = selectPool?.metadata?.pool_id;

      const gatewayContract = new ethers.Contract(contractAddress, ABI, providerSourceChain);

      const options = Options.newOptions()
        .addExecutorLzReceiveOption(500_000, 0)
        .addExecutorComposeOption(0, 5_000_000, ethers.utils.parseEther("0.0007").mul(3).toBigInt())
        .toBytes();

      const amount = ethers.utils.parseUnits(amountBuy.toString(), decimalsUsdt);
      const allowance = await (await tokenContract).allowance(account, gatewayContract.address);

      if (Number(allowance) < Number(amount)) {
        const re = await (await tokenContract).approve(gatewayContract.address, ethers.constants.MaxUint256);
        await re.wait();
      }

      const composeMessage = ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [poolId, to]);

      const sendParam = {
        dstEid: eidB,
        to: ethers.utils.hexlify(addressToBytes32(gatewayContract.address)), // addressToBytes32(toAddress),
        amountLD: amount,
        minAmountLD: amount,
        extraOptions: ethers.utils.hexlify(options),
        composeMsg: composeMessage,
        oftCmd: "0x", // ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
      };

      const oftReceipt = await (await oftContract).quoteOFT(sendParam);
      sendParam.minAmountLD = oftReceipt.receipt.amountReceivedLD;

      // Get the quote for the send operation
      const feeQuote = await (await oftContract).quoteSend(sendParam, false);
      const nativeFee = feeQuote.nativeFee;

      const r = await gatewayContract.acquire(eidB, poolId, to, amount, options, {
        value: nativeFee,
      });

      await r.wait();

      helperToast.success(
        <div>
          Successful!{" "}
          <ExternalLink href={`${APP_ENVIRONMENTS.LAYERZERO.SCAN}/tx/${r?.hash}`}>
            <Trans>View</Trans>
          </ExternalLink>
          <br />
        </div>
      );

      setTimeout(() => {
        getBalanceUsdt();
        setTriggerFetch(Math.random());
      }, 2000);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoadingBuy(false);
    }
  };

  const sell = async () => {
    if (!walletProvider) return;
    let check = await switchNetworkbridge(ChainSupported.Lightlink, walletProvider);
    if (!check) return;
    setIsLoadingSell(true);
    try {
      const to = account;
      const contractAddress = metadata?.contracts?.source?.gateway?.address;
      const ABI = metadata?.contracts?.source?.gateway?.abi;
      const eidB = metadata?.chains?.[selectPool?.metadata?.dest_chain]?.lz_eid;
      const poolId = selectPool?.metadata?.pool_id;

      const gatewayContract = new ethers.Contract(contractAddress, ABI, providerSourceChain);

      const options = Options.newOptions()
        .addExecutorLzReceiveOption(2_000_000, ethers.utils.parseEther("0.0007").mul(3).toBigInt())
        .toBytes();

      const amount = ethers.utils.parseUnits(amountSell.toString(), decimalsUsdt);
      const allowance = await (await tokenContractPool).allowance(account, gatewayContract.address);

      if (Number(allowance) < Number(amount)) {
        const re = await (await tokenContractPool).approve(gatewayContract.address, ethers.constants.MaxUint256);
        await re.wait();
      }

      const payload = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "address", "uint256"],
        [poolId, account, to, amount]
      );

      const feeQuote = await gatewayContract.quote(eidB, payload, options, false);

      const nativeFee = feeQuote.nativeFee;

      const r = await gatewayContract.redeem(eidB, poolId, to, amount, options, {
        value: nativeFee,
      });

      await r.wait();

      helperToast.success(
        <div>
          Successful!{" "}
          <ExternalLink href={`${APP_ENVIRONMENTS.LAYERZERO.SCAN}/tx/${r?.hash}`}>
            <Trans>View</Trans>
          </ExternalLink>
          <br />
        </div>
      );

      setTimeout(() => {
        getBalancePool();
        setTriggerFetch(Math.random());
      }, 2000);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoadingSell(false);
    }
  };

  const generateRandomColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(`rgba(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()}, 1)`);
    }

    return colors;
  };

  const listColors = ["#f89422", "#bba033", "#ff2300", "#4c9642"];

  const colors = useMemo(() => {
    if (size(selectPool?.metadata?.weights) > 4) {
      return [...listColors, ...generateRandomColors(size(selectPool?.metadata?.weights) - 4)];
    }
    return listColors;
  }, [selectPool]);

  const pieData = useMemo(() => {
    return {
      labels: [],
      datasets: [
        {
          label: "Percentage(%)",
          data: map(selectPool?.metadata?.weights, (weight) => formatNumber(weight / 100, 2)),
          backgroundColor: colors,
          borderColor: colors.map((color) => "transparent"),
        },
      ],
    };
  }, [selectPool]);

  return (
    <SEO title={getPageTitle("Meme Index Fund")}>
      <div className="mif default-container page-layout">
        <div className="mif-container">
          <div className="section-title-content">
            <div className="index-top">
              <div className="top-left">
                <Select
                  name=""
                  isSearchable={false}
                  classNamePrefix="component-select"
                  value={selectPool}
                  onChange={(value) => {
                    setSelectPool(value);
                  }}
                  options={pools}
                  components={{
                    Option: ({ data, innerProps }) => {
                      return (
                        <div
                          className={`custom-option ${
                            selectPool?.metadata?.token_address === data?.metadata?.token_address
                              ? "custom-option-selected"
                              : ""
                          }`}
                          {...innerProps}
                        >
                          {data?.metadata?.name || data?.metadata?.symbol ? (
                            <>
                              {data?.metadata?.name} ({data?.metadata?.symbol})
                            </>
                          ) : (
                            <> </>
                          )}
                        </div>
                      );
                    },
                    SingleValue: ({ data }) => (
                      <div className="custom-option-single">
                        <span className="custom-option-label">
                          {data?.metadata?.name || data?.metadata?.symbol ? (
                            <>
                              {data?.metadata?.name} ({data?.metadata?.symbol})
                            </>
                          ) : (
                            <> </>
                          )}
                        </span>
                      </div>
                    ),
                  }}
                />
                <div className="Page-title font-kufam">
                  <Trans>Index Funds</Trans>
                </div>
              </div>
              <button className="button-secondary" onClick={() => setShowModalCreateIndex(true)}>
                + Create Index
              </button>
            </div>
            <div className="mif-top-page App-card">
              <div className="App-card-title font-kufam">
                <Trans>Your Portfolio</Trans>
              </div>
              <div className="top-price">
                <div className="label font-kufam">
                  {selectPool?.metadata?.name} {selectPool?.metadata?.name ? <>({selectPool?.metadata?.symbol})</> : ""}
                </div>
                <div>{formatNumber(selectPool?.context?.price || 0, POOL_PRICE_DECIMALS)} USD</div>
              </div>
            </div>

            <div className="mif-detail">
              <div className="mif-detail-left">
                <div className="App-card">
                  <div className="App-card-title font-kufam">Price chart</div>
                  <div className="mif-chart">
                    <ChartPrice type={activeTabChart} pool={selectPool} />
                    <div className="list-tabs tabs-chart">
                      {map(TAB_OPTIONS_CHART, (item, index) => (
                        <div
                          className={`option-tab-chart ${activeTabChart === item ? "active" : ""}`}
                          key={index}
                          onClick={() => setActiveTabChart(item)}
                        >
                          {TAB_OPTION_CHART_LABELS[item]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="App-card">
                  <div className="App-card-title font-kufam">Token Composition</div>
                  <div className="chart-pie">
                    <div className="pie-label">
                      {map(selectPool?.metadata?.tokens, (address, index) => {
                        const token = find(
                          tokens,
                          (item) => toLower(item?.metadata?.token_address) === toLower(address)
                        );
                        return (
                          <div key={index} className="label">
                            <div className="pie-legend" style={{ backgroundColor: colors[index] }}></div>
                            <div>{token?.metadata?.symbol}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pie-circle">
                      <Pie data={pieData} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mif-detail-right">
                <div className="App-card">
                  <div className="list-tabs tabs-action">
                    <div
                      className={`option-tab-action ${activeTabAction === 1 ? "active" : ""}`}
                      onClick={() => setActiveTabAction(1)}
                    >
                      BUY
                    </div>
                    <div
                      className={`option-tab-action ${activeTabAction === 2 ? "active" : ""}`}
                      onClick={() => setActiveTabAction(2)}
                    >
                      SELL
                    </div>
                  </div>
                  {activeTabAction === 1 ? (
                    <>
                      <div className="App-card-content">
                        <div className="App-card-row">
                          <div className="label">Price</div>
                          <div>{formatNumber(selectPool?.context?.price || 0, POOL_PRICE_DECIMALS)} USD</div>
                        </div>
                        <div className="App-card-row">
                          <div className="label">USDT Balance</div>
                          <div>{formatBalance(balanceUsdt, decimalsUsdt)}</div>
                        </div>
                      </div>
                      <div className="link-bridge-usdt">
                        <ExternalLink href={APP_ENVIRONMENTS.URL_BRIDGE_USDT_TO_LL}>
                          Bridge USDT to LightLink
                        </ExternalLink>
                      </div>
                      <CurrencyInput
                        className="input-amount"
                        value={amountBuy}
                        onChange={(e) => {
                          if (isNaN(Number(e))) {
                            return;
                          }
                          setAmountBuy(e);
                        }}
                      />
                      <div className="App-card-content">
                        <div className="App-card-row">
                          <div className="label">Receive (Estimated)</div>
                          <div>
                            {selectPool?.context?.price ? formatNumber(amountBuy / selectPool?.context?.price) : 0}{" "}
                            {selectPool?.metadata?.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="mif-action">
                        <button
                          disabled={isLoadingBuy || amountBuy <= 0}
                          onClick={buy}
                          className="App-cta Exchange-swap-button"
                          type="submit"
                        >
                          {isLoadingBuy ? "BUYING..." : "BUY"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="App-card-content">
                        <div className="App-card-row">
                          <div className="label">Price</div>
                          <div>{formatNumber(selectPool?.context?.price || 0, POOL_PRICE_DECIMALS)} USD</div>
                        </div>
                        <div className="App-card-row">
                          <div className="label">{selectPool?.metadata?.symbol} Balance</div>
                          <div>{formatBalance(balancePool, decimalsPool)}</div>
                        </div>
                      </div>
                      <div className="link-bridge-usdt">
                        <ExternalLink href={APP_ENVIRONMENTS.URL_BRIDGE_USDT_TO_LL}>
                          Bridge USDT to LightLink
                        </ExternalLink>
                      </div>
                      <CurrencyInput
                        className="input-amount"
                        value={amountSell}
                        onChange={(e) => {
                          if (isNaN(Number(e))) {
                            return;
                          }
                          setAmountSell(e);
                        }}
                      />
                      <div className="App-card-content">
                        <div className="App-card-row">
                          <div className="label">Receive (Estimated)</div>
                          <div>{0 || formatNumber((selectPool?.context?.price || 0) * amountSell)} USDT</div>
                        </div>
                      </div>
                      <div className="mif-action">
                        <button
                          disabled={isLoadingSell || amountSell <= 0}
                          onClick={sell}
                          className="App-cta Exchange-swap-button"
                          type="submit"
                        >
                          {isLoadingSell ? "SELLING..." : "SELL"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="App-card">
                  <div className="mif-fund-glance">
                    <div className="App-card-title font-kufam">
                      <b className="text-main">{selectPool?.metadata?.symbol}</b> funds at a glance
                    </div>

                    <div className="list-contract">
                      <div className="item-contract">
                        <span className="label">LIGHTLINK</span>
                        <a
                          className="text-main"
                          target="_blank"
                          rel="noreferrer"
                          href={`${APP_ENVIRONMENTS.LL_SCAN}/address/${selectPool?.metadata?.token_address}`}
                        >
                          {formatAddress(selectPool?.metadata?.token_address || "")}
                        </a>
                      </div>
                    </div>

                    <div className="mif-pool">
                      {map(selectPool?.metadata?.tokens || [], (address) => {
                        const token = find(
                          tokens,
                          (item) => toLower(item?.metadata?.token_address) === toLower(address)
                        );
                        return (
                          <div key={address}>
                            <div className="item-token">
                              <span className="label-name label">{token?.metadata?.symbol}</span>
                              <span className="text-main">
                                {formatBalance(
                                  selectPool?.context?.tokens?.[address]?.total_holding,
                                  selectPool?.context?.tokens?.[address]?.decimals
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="total-tokens">
                      <span className="label">Total Tokens Issued:</span>
                      <div className="text-main">
                        {formatBalance(selectPool?.context?.total_issued || 0, decimalsPool)}{" "}
                        {selectPool?.metadata?.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="mif-table-txn">
              <TxnHistories trigger={triggerFetch} />
            </div> */}
          </div>
        </div>
        {showModalCreateIndex && (
          <ModalCreateIndex
            isVisible={showModalCreateIndex}
            setIsVisible={setShowModalCreateIndex}
            metadata={metadata}
            tokens={tokens}
          />
        )}
      </div>
    </SEO>
  );
}
