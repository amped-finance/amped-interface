import { Trans } from "@lingui/macro";
import "./Mif.css";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import ChartPrice from "./Chart";
import TxnHistories from "./TxnHistories";
import { APP_ENVIRONMENTS } from "config/env";
import { map, isNaN, size } from "lodash";
import { ChainSupported, computePrice, formatAddress, formatBalance, formatNumber } from "config/helper";
import Tab from "components/Tab/Tab";
import { useEffect, useMemo, useState } from "react";
import { CurrencyInput } from "components/CurrencyInput/CurrencyInput";
import { ethers } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { useMIContract, useMILzContract, useUsdtContract, useUsdtLzContract } from "hooks/useContract";
import { getIndexFundMasterData, useIndexFundMasterData } from "hooks/useIndexFundFetcher";
import { Options, addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { helperToast } from "lib/helperToast";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { switchNetworkbridge } from "pages/Bridge/data";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

const TAB_OPTIONS_CHART = ["day", "week", "month", "year"];
const TAB_OPTION_CHART_LABELS = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const TAB_OPTIONS_ACTION = ["buy", "sell"];
const TAB_OPTION_ACTION_LABELS = {
  buy: "BUY",
  sell: "SELL",
};

const MIF_PRICE_DECIMALS = 6;

const UNIT_PRICE_TRADING = "0.0002";

const BASE_DIVIDER = 10_000;

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function Mif() {
  const [activeTabChart, setActiveTabChart] = useState(TAB_OPTIONS_CHART[0]);
  const [activeTabAction, setActiveTabAction] = useState(1);

  const [isLoadingBuy, setIsLoadingBuy] = useState(false);
  const [isLoadingSell, setIsLoadingSell] = useState(false);
  const [amountBuy, setAmountBuy] = useState("");
  const [amountSell, setAmountSell] = useState("");

  const [sourceChain] = useState(APP_ENVIRONMENTS.CHAINS_MIF[ChainSupported.Lightlink]);
  const [destChain] = useState(APP_ENVIRONMENTS.CHAINS_MIF[ChainSupported.Bsc]);

  const { walletProvider } = useWeb3ModalProvider();
  const { isConnected: active, address: account } = useWeb3ModalAccount();

  const [providerSourceChain, setProviderSourceChain] = useState(
    new ethers.providers.JsonRpcProvider(APP_ENVIRONMENTS.CHAINS[sourceChain.KEY].RPC)
  );

  const usdtContract = useUsdtContract(sourceChain.KEY, providerSourceChain);
  const usdtLzContract = useUsdtLzContract(sourceChain.KEY, providerSourceChain);
  const miContract = useMIContract(sourceChain.KEY, providerSourceChain);
  const miLzContract = useMILzContract(sourceChain.KEY, providerSourceChain);

  const [balanceUsdt, setBalanceUsdt] = useState(0);
  const [balanceMi, setBalanceMi] = useState(0);
  const [decimalsUsdt, setDecimalsUsdt] = useState(0);
  const [decimalsMi, setDecimalsMi] = useState(0);

  const [triggerFetch, setTriggerFetch] = useState(0);

  const [mifMasterData, setMifMasterData] = useState({
    totalToken: "0",
    pools: [],
    totalValue: 0,
    poolSize: 0,
  });

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

  useEffect(() => {
    getMasterData();
  }, []);

  const getMasterData = async () => {
    const data = await getIndexFundMasterData(ChainSupported.Bsc);
    setMifMasterData(data);
  };

  const mifPrice = computePrice(mifMasterData.totalToken, mifMasterData.totalValue, Number(decimalsMi ?? 0));

  const getBalanceUsdt = async () => {
    const balance = await usdtContract.balanceOf(account);
    setBalanceUsdt(balance);
  };

  const getDecimalsUsdt = async () => {
    const decimals = await usdtContract.decimals();
    setDecimalsUsdt(decimals);
  };

  useEffect(() => {
    if (usdtContract) {
      getDecimalsUsdt();
      if (active) {
        getBalanceUsdt();
      }
    }
  }, [usdtContract, active]);

  const getBalanceMi = async () => {
    const data = await miContract.balanceOf(account);
    setBalanceMi(data);
  };

  const getDecimalsMi = async () => {
    try {
      const decimals = await miContract.decimals();
      setDecimalsMi(decimals);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    if (miContract) {
      getDecimalsMi();
      if (active) {
        getBalanceMi();
      }
    }
  }, [miContract, active]);

  const buy = async () => {
    if (!walletProvider) return;
    let check = await switchNetworkbridge(ChainSupported.Lightlink, walletProvider);
    if (!check) return;
    setIsLoadingBuy(true);
    try {
      const options = Options.newOptions()
        .addExecutorLzReceiveOption(120_000, 0)
        .addExecutorComposeOption(
          0,
          750_000 * mifMasterData.poolSize,
          ethers.utils.parseEther(UNIT_PRICE_TRADING).mul(mifMasterData.poolSize).toBigInt()
        )
        .toBytes();

      const allowance = (await usdtContract.allowance(account, usdtLzContract.address)).toBigInt();

      const amountToSend = ethers.utils.parseUnits(amountBuy.toString(), Number(decimalsUsdt)).toBigInt();

      if (allowance < amountToSend) {
        const tx = await usdtContract
          .connect(providerSourceChain)
          .approve(usdtLzContract.address, ethers.constants.MaxUint256);

        await tx.wait(1);
      }

      const composeMessage = ethers.utils.defaultAbiCoder.encode(
        ["bytes4", "address"],
        [ethers.utils.id("acquire(uint32,address,uint256)").substring(0, 10), account]
      );

      const sendParam = {
        dstEid: destChain.EID,
        to: ethers.utils.hexlify(addressToBytes32(destChain.INDEX_FUND.COMPOSER_CONTRACT.ADDRESS)),
        amountLD: amountToSend,
        minAmountLD: 0,
        extraOptions: ethers.utils.hexlify(options),
        composeMsg: composeMessage,
        oftCmd: "0x",
      };

      const oftReceipt = await usdtLzContract.quoteOFT(sendParam);
      sendParam.minAmountLD = oftReceipt.receipt.amountReceivedLD;

      // Get the quote for the send operation
      const feeQuote = await usdtLzContract.quoteSend(sendParam, false);
      const nativeFee = feeQuote.nativeFee;

      const params = [sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, account];
      const gasLimit = await usdtLzContract.estimateGas.send(...params, {
        value: nativeFee,
      });

      const r = await usdtLzContract.send(...params, {
        value: nativeFee,
        gasLimit: gasLimit.mul(150).div(100),
      });
      await r.wait(1);

      getBalanceUsdt();

      helperToast.success(
        <div>
          Successful!{" "}
          <ExternalLink href={`${APP_ENVIRONMENTS.LAYERZERO.SCAN}/tx/${r?.hash}`}>
            <Trans>View</Trans>
          </ExternalLink>
          <br />
        </div>
      );
      setTriggerFetch(Math.random());
    } catch (error) {
      console.log(error);
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
      const options = Options.newOptions()
        .addExecutorLzReceiveOption(120_000, 0)
        .addExecutorComposeOption(
          0,
          750_000 * mifMasterData.poolSize,
          ethers.utils.parseEther(UNIT_PRICE_TRADING).mul(mifMasterData.poolSize).toBigInt()
        )
        .toBytes();

      const allowance = (await miContract.allowance(account, miLzContract.address)).toBigInt();

      const amountToSend = ethers.utils.parseUnits(amountSell.toString(), Number(decimalsMi)).toBigInt();

      if (allowance < amountToSend) {
        const tx = await miContract.approve(miLzContract.address, ethers.constants.MaxUint256);

        await tx.wait(1);
      }

      const composeMessage = ethers.utils.defaultAbiCoder.encode(
        ["bytes4", "address"],
        [ethers.utils.id("redeem(uint32,address,uint256)").substring(0, 10), account]
      );

      const sendParam = {
        dstEid: destChain.EID,
        to: ethers.utils.hexlify(addressToBytes32(destChain.INDEX_FUND.COMPOSER_CONTRACT.ADDRESS)),
        amountLD: amountToSend,
        minAmountLD: 0,
        extraOptions: ethers.utils.hexlify(options),
        composeMsg: composeMessage,
        oftCmd: "0x",
      };

      const oftReceipt = await miLzContract.quoteOFT(sendParam);
      sendParam.minAmountLD = oftReceipt.receipt.amountReceivedLD;

      // Get the quote for the send operation
      const feeQuote = await miLzContract.quoteSend(sendParam, false);
      const nativeFee = feeQuote.nativeFee;

      const params = [sendParam, { nativeFee: nativeFee, lzTokenFee: 0 }, account];
      const gasLimit = await miLzContract.estimateGas.send(...params, {
        value: nativeFee,
      });

      const r = await miLzContract.send(...params, {
        value: nativeFee,
        gasLimit: gasLimit.mul(150).div(100),
      });

      await r.wait(1);

      getBalanceMi();

      helperToast.success(
        <div>
          Successful!{" "}
          <ExternalLink href={`${APP_ENVIRONMENTS.LAYERZERO.SCAN}/tx/${r?.hash}`}>
            <Trans>View</Trans>
          </ExternalLink>
          <br />
        </div>
      );

      setTriggerFetch(Math.random());
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoadingSell(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getMasterData();
    }, 120 * 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, []);

  const generateRandomColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(`rgba(${255 * Math.random()}, ${255 * Math.random()}, ${255 * Math.random()}, 1)`);
    }

    return colors;
  };

  const listColors = ["#f89422", "#bba033", "#ff2300", "#4c9642"];

  const colors = useMemo(() => {
    if (size(mifMasterData?.pools) > 4) {
      return [...listColors, ...generateRandomColors(size(mifMasterData?.pools) - 4)];
    }
    return listColors;
  }, [mifMasterData]);

  const pieData = useMemo(() => {
    return {
      labels: [],
      datasets: [
        {
          label: "Percentage(%)",
          data: map(mifMasterData.pools, (pool) => formatNumber((pool.poolInfo.weight / BASE_DIVIDER) * 100, 2)),
          backgroundColor: colors,
          borderColor: colors.map((color) => "transparent"),
        },
      ],
    };
  }, [mifMasterData]);

  return (
    <SEO title={getPageTitle("Meme Index Fund")}>
      <div className="mif default-container page-layout">
        <div className="mif-container">
          <div className="section-title-content">
            <div className="mif-top-page App-card">
              <div className="Page-title font-kufam">
                <Trans>
                  <b className="text-main">MIF</b> - Meme Index Fund
                </Trans>
              </div>
              <div className="App-card-title font-kufam">
                <Trans>Meme Coin Index Fund</Trans>
              </div>
              <div className="Page-description">
                <ul>
                  <Trans>
                    <li>Tokens purchased are held in in smart contracts on the source chain</li>
                    <li>Your purchased MIF token is redeemable for the underlying tokens on the destination chain</li>
                    <li>This initial release is only available on BSC Mainnet</li>
                  </Trans>
                </ul>
              </div>
            </div>

            <div className="mif-detail">
              <div className="mif-detail-left">
                <div className="App-card">
                  <div className="App-card-title font-kufam">Price chart</div>
                  <div className="mif-chart">
                    <ChartPrice type={activeTabChart} />
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
                      {/* <Tab
                        options={TAB_OPTIONS_CHART}
                        optionLabels={TAB_OPTION_CHART_LABELS}
                        option={activeTabChart}
                        setOption={setActiveTabChart}
                        onChange={setActiveTabChart}
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="App-card">
                  <div className="App-card-title font-kufam">MI Token Composition</div>
                  <div className="chart-pie">
                    <div className="pie-label">
                      {map(mifMasterData.pools, (pool, index) => (
                        <div key={index} className="label">
                          <div className="pie-legend" style={{ backgroundColor: colors[index] }}></div>
                          <div>{pool.name}</div>
                        </div>
                      ))}
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
                    {/* <Tab
                      options={TAB_OPTIONS_ACTION}
                      optionLabels={TAB_OPTION_ACTION_LABELS}
                      option={activeTabAction}
                      setOption={setActiveTabAction}
                      onChange={setActiveTabAction}
                    /> */}
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
                          <div className="label">MI Price</div>
                          <div>{formatNumber(mifPrice, MIF_PRICE_DECIMALS)} USD</div>
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
                          <div>{0 || formatNumber(amountBuy / mifPrice)} MIF</div>
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
                          <div>{formatNumber(mifPrice, MIF_PRICE_DECIMALS)} USD</div>
                        </div>
                        <div className="App-card-row">
                          <div className="label">MI Balance</div>
                          <div>{formatBalance(balanceMi, decimalsMi)}</div>
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
                          <div>{0 || formatNumber(mifPrice * amountSell)} USDT</div>
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
                      <b className="text-main">MI</b> funds at a glance
                    </div>

                    <div className="list-contract">
                      {map(APP_ENVIRONMENTS.CHAINS_MIF, (chain) => {
                        return (
                          <div key={chain.KEY} className="item-contract">
                            <span className="label">{chain.KEY}</span>
                            <a
                              className="text-main"
                              target="_blank"
                              rel="noreferrer"
                              href={`${chain.SCAN}/address/${chain.LZ.MIF.TOKEN_CONTRACT.ADDRESS}`}
                            >
                              {formatAddress(chain.LZ.MIF.TOKEN_CONTRACT.ADDRESS)}
                            </a>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mif-pool">
                      {map(mifMasterData.pools, (pool) => {
                        return (
                          <div key={pool.address}>
                            <div className="item-token">
                              <span className="label-name label">{pool.name}</span>
                              <span className="text-main">{formatBalance(pool.totalHolding, pool.decimals)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* <table className="mif-table Exchange-list App-box">
                      <thead>
                        <tr>
                          <th>
                            <Trans>Token Name</Trans>
                          </th>
                          <th>
                            <Trans>Quantity</Trans>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {map(mifMasterData.pools, (pool, index) => (
                          <tr key={index}>
                            <td>{pool.name}</td>
                            <td>{formatBalance(pool.totalHolding, pool.decimals)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table> */}

                    <div className="total-tokens">
                      <span className="label">Total Tokens Issued:</span>
                      <div className="text-main">{formatBalance(mifMasterData.totalToken, decimalsMi)} MI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mif-table-txn">
              <TxnHistories trigger={triggerFetch} />
            </div>
          </div>
        </div>
      </div>
    </SEO>
  );
}
