import React, { useEffect, useRef, useState } from "react";
import "./ModalCreateIndex.css";
import Modal from "components/Modal/Modal";
import { Trans } from "@lingui/macro";
import Select from "react-select";
import { APP_ENVIRONMENTS } from "config/env";
import logoCoinbase from "img/bridge/coinbase.png";
import logoBNB from "img/bridge/bnb.png";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { map, size, isEmpty } from "lodash";
import { MdClose } from "react-icons/md";
import { ethers } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { helperToast } from "lib/helperToast";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { ChainSupported } from "config/helper";
import { switchNetworkbridge } from "pages/Bridge/data";

const { DROPDOWN_CHAINS_INDEX } = APP_ENVIRONMENTS;

const CreateIndexSchema = Yup.object().shape({
  symbol: Yup.string().trim().required("Symbol is required").max(255),
  index_name: Yup.string().trim().required("Index name is required"),
  tokens_composition: Yup.array().of(
    Yup.object().shape({
      token: Yup.string().required("Token is required"),
      percent: Yup.number().required("Weight is required"),
    })
  ),
});

const ModalCreateIndex = ({ isVisible, setIsVisible, metadata, tokens }) => {
  const formRef = useRef();
  const [chain, setChain] = useState(DROPDOWN_CHAINS_INDEX[0]);
  const [tokensByChain, setTokensByChain] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);

  const { walletProvider } = useWeb3ModalProvider();

  const { isConnected: active, address: account } = useWeb3ModalAccount();

  const initFormValue = {
    symbol: "",
    index_name: "",
    tokens_composition: [],
  };

  useEffect(() => {
    if (!isEmpty(tokens) && chain) {
      setTokensByChain(tokens.filter((item) => item?.metadata?.chain === chain?.chain));
    }
  }, [chain, tokens]);

  const getLogoChain = (chain) => {
    switch (chain) {
      case "base": {
        return logoCoinbase;
      }
      case "bsc": {
        return logoBNB;
      }
      default:
        return "";
    }
  };

  const createPool = async (params, resetForm, setSubmitting) => {
    if (!walletProvider) return;
    let check = await switchNetworkbridge(ChainSupported.Lightlink, walletProvider);
    if (!check) return;
    setSubmitting(true);
    const listTokens = map(params.tokens_composition, (item) => {
      return item.token;
    });

    const listWeights = map(params.tokens_composition, (item) => {
      return Number(item.percent) * 100;
    });

    const contractAddress = metadata?.contracts?.source?.poolHub?.address;
    const ABI = metadata?.contracts?.source?.poolHub?.abi;

    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();

    const poolContract = new ethers.Contract(contractAddress, ABI, signer);

    const eidB = metadata?.chains?.[chain?.chain]?.lz_eid || 0;
    try {
      const options = Options.newOptions()
        .addExecutorLzReceiveOption(1_000_000, ethers.utils.parseEther("0.0005").toBigInt())
        .toBytes();

      const payload = ethers.utils.defaultAbiCoder.encode(
        ["address", "address[]", "uint24[]"],
        [account, listTokens, listWeights]
      );

      const feeQuote = await poolContract.quote(eidB, payload, options, false);
      const nativeFee = feeQuote.nativeFee;

      const r = await poolContract.createPool(
        eidB,
        params.index_name,
        params.symbol,
        listTokens,
        listWeights,
        options,
        {
          value: nativeFee,
        }
      );
      await r.wait();
      helperToast.success(
        <div>
          Successful!{" "}
          <ExternalLink href={`${APP_ENVIRONMENTS.LL_SCAN}/tx/${r.hash}`}>
            <Trans>View</Trans>
          </ExternalLink>
          <br />
        </div>
      );
      resetForm();
      setSubmitting(false);
    } catch (err) {
      helperToast.error(err?.reason);
      // resetForm();
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      className="create-index-modal"
      setIsVisible={setIsVisible}
      label={
        <div className="Page-title font-kufam">
          <Trans>Create New index</Trans>
        </div>
      }
    >
      <Formik
        innerRef={formRef}
        initialValues={initFormValue}
        validationSchema={CreateIndexSchema}
        onSubmit={(payload, { setSubmitting, resetForm }) => {
          // setSubmitting(true);
          createPool(payload, resetForm, setSubmitting);
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => {
          let total = 0;
          map(values.tokens_composition, (item) => {
            total = total + Number(item.percent);
          });
          setTotalWeight(total);
          return (
            <Form className="form">
              <div className="line-1">
                <div className="item-form">
                  <div className="label-field">Ticker Symbol</div>
                  <Field name="symbol" className="input-field" placeholder="e.g., AIF" />
                  <ErrorMessage name="symbol" className="error-message" component="div" />
                </div>
                <div className="item-form">
                  <div className="label-field">Index Name</div>
                  <Field name="index_name" className="input-field" placeholder="e.g., AI Index Fund" />
                  <ErrorMessage name="index_name" className="error-message" component="div" />
                </div>
              </div>
              <div>
                <div className="label-field">Network</div>
                <Select
                  name=""
                  isSearchable={false}
                  classNamePrefix="component-select"
                  value={chain}
                  onChange={(value) => {
                    if (value.chain !== chain.chain) {
                      setFieldValue("tokens_composition", []);
                    }
                    setChain(value);
                  }}
                  options={DROPDOWN_CHAINS_INDEX}
                  components={{
                    Option: ({ data, innerProps }) => {
                      return (
                        <div
                          className={`custom-option ${chain.label === data.label ? "custom-option-selected" : ""}`}
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

              <div className="line-3">
                <div>
                  <FieldArray name="tokens_composition">
                    {({ push, remove }) => (
                      <>
                        <div className="token-composition">
                          <div className="label-field">Token Composition</div>
                          <div
                            className={`button-secondary btn-add-token ${
                              size(values.tokens_composition) >= size(tokensByChain) ? "disabled" : ""
                            }`}
                            onClick={() => {
                              if (size(values.tokens_composition) < size(tokensByChain)) {
                                push({
                                  token: "",
                                  percent: "",
                                });
                              }
                            }}
                          >
                            + Add Token
                          </div>
                        </div>
                        {map(values.tokens_composition || [], (_, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="col-input">
                                <Field
                                  name={`tokens_composition.${index}.token`}
                                  as="select"
                                  className="input-field select-field"
                                >
                                  <option disabled value="">
                                    Select Token
                                  </option>
                                  {map(tokensByChain || [], (item, index) => {
                                    return (
                                      <option key={index} value={item?.metadata?.token_address}>
                                        {item?.metadata?.name}
                                      </option>
                                    );
                                  })}
                                </Field>
                                <ErrorMessage
                                  name={`tokens_composition.${index}.token`}
                                  className="error-message"
                                  component="div"
                                />
                              </div>
                              <div className="col-input">
                                <Field
                                  name={`tokens_composition.${index}.percent`}
                                  type="number"
                                  placeholder="0"
                                  className="input-field"
                                />
                                <ErrorMessage
                                  name={`tokens_composition.${index}.percent`}
                                  className="error-message"
                                  component="div"
                                />
                              </div>
                              <div
                                className="remove-row"
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                <MdClose fontSize={20} />
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </FieldArray>
                </div>
              </div>
              <div className="line-4">
                <div className="text-total">
                  <Trans>Total Weight:</Trans>
                </div>
                <span className={totalWeight === 100 ? "text-green" : "text-yellow"}>{totalWeight}%</span>
              </div>
              {totalWeight !== 100 && !isEmpty(values.tokens_composition) && (
                <div className="line-error">Total weight must equal 100%</div>
              )}
              <div className="action-modal">
                <button onClick={() => setIsVisible(false)} className="button-primary">
                  Cancel
                </button>
                <button submit className="button-secondary" disabled={totalWeight !== 100 || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Index"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default ModalCreateIndex;
