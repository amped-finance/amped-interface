import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import moment from "moment";
import { APP_ENVIRONMENTS } from "config/env";
import { ShareSvg } from "pages/Bridge/ShareSvg";
import { Trans } from "@lingui/macro";
import { handleGetHistories } from "services/layerZero/layerZero";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

const TxnHistories = ({ trigger }) => {
  const [dataHistories, setDataHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { address: account } = useWeb3ModalAccount();

  useEffect(() => {
    if (account) {
      getHistory(account);
    } else {
      setDataHistories([]);
    }
  }, [account, trigger]);

  const getHistory = async (account) => {
    setLoading(true);
    const response = await handleGetHistories(account);
    if (response?.data?.data) {
      setDataHistories(
        response.data.data.filter(
          (item) =>
            !isEmpty(item?.destination?.lzCompose?.txs) &&
            item?.destination?.lzCompose?.txs[0]?.to?.toLowerCase() ===
              APP_ENVIRONMENTS.CHAINS_MIF.BSC.INDEX_FUND?.COMPOSER_CONTRACT.ADDRESS.toLowerCase()
        )
      );
      setLoading(false);
    }
    if (response?.error) {
      setDataHistories([]);
      setLoading(false);
    }
  };

  const getLocalDate = (timestamp) => {
    const date = new Date(timestamp);
    return moment(date).format("MM/DD/YYYY, HH:mm");
  };

  return (
    <div>
      <div className="Page-title font-kufam mif-txn-history">
        <Trans>Transaction History</Trans>
      </div>
      <div>
        {!isEmpty(dataHistories) ? (
          <table className="mif-table Exchange-list App-box">
            <thead>
              <tr>
                <th>
                  <Trans>Type</Trans>
                </th>
                <th>
                  <Trans>Time</Trans>
                </th>
                <th>
                  <Trans>Status</Trans>
                </th>
                <th>
                  <Trans>View</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataHistories.map((item, index) => (
                <tr>
                  <td>
                    {item?.pathway?.receiver?.address ===
                    APP_ENVIRONMENTS.CHAINS_MIF.BSC.LZ.MIF.LZ_CONTRACT.ADDRESS.toLowerCase() ? (
                      <span className="text-red">Sell</span>
                    ) : (
                      <span className="text-green">Buy</span>
                    )}
                  </td>
                  <td>{getLocalDate(item?.created)}</td>
                  <td>{item?.status?.name}</td>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${APP_ENVIRONMENTS.LAYERZERO.SCAN}/tx/${item?.source?.tx?.txHash}`}
                    >
                      <ShareSvg />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <Trans>No transactions data</Trans>
          </div>
        )}
      </div>
    </div>
  );
};

export default TxnHistories;
