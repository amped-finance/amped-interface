import React, { useEffect, useState } from "react";
import { isEmpty, toLower } from "lodash";
import moment from "moment";
import { APP_ENVIRONMENTS } from "config/env";
import { ShareSvg } from "pages/Bridge/ShareSvg";
import { Trans } from "@lingui/macro";
import { handleGetHistories } from "services/layerZero/layerZero";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

const TxnHistories = ({ trigger, metadata, selectPool }) => {
  const [dataHistories, setDataHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { address: account } = useWeb3ModalAccount();

  useEffect(() => {
    if (account && metadata && selectPool) {
      getHistory(account);
    } else {
      setDataHistories([]);
    }
  }, [account, trigger, metadata, selectPool]);

  const getHistory = async (account) => {
    setLoading(true);
    const response = await handleGetHistories(account);
    if (response?.data?.data) {
      setDataHistories(
        response.data.data.filter(
          (item) =>
            toLower(item?.destination?.lzCompose?.txs?.[0]?.to) ===
              toLower(metadata?.contracts?.edge?.[selectPool?.metadata?.dest_chain]?.gateway?.address) ||
            toLower(item?.pathway?.sender?.address) === toLower(metadata?.contracts?.source?.gateway?.address)
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
                <tr key={index}>
                  <td>
                    {toLower(item?.pathway?.sender?.address) ===
                    toLower(metadata?.contracts?.source?.gateway?.address) ? (
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
