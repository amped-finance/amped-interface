import { useEffect, useRef, useState, useMemo } from "react";
import { Trans, t } from "@lingui/macro";
import { setTraderReferralCodeByUser, validateReferralCodeExists } from "domain/referrals";
import { REFERRAL_CODE_REGEX } from "./referralsHelper";
import { useDebounce } from "lib/useDebounce";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useDisconnect,
  createWeb3Modal,
  defaultConfig
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { useChainId } from "lib/chains";

function JoinReferralCode({ setPendingTxns, pendingTxns, active, connectWallet }) {
  return (
    <div className="referral-card section-center mt-medium">
      <h2 className="title font-kufam">
        <Trans>Enter Referral Code</Trans>
      </h2>
      <p className="sub-title">
        <Trans>Please input a referral code to benefit from fee discounts.</Trans>
      </p>
      <div className="card-action">
        {active ? (
          <ReferralCodeForm setPendingTxns={setPendingTxns} pendingTxns={pendingTxns} />
        ) : (
          <button className="App-cta Exchange-swap-button" type="submit" onClick={connectWallet}>
            <Trans>Connect Wallet</Trans>
          </button>
        )}
      </div>
    </div>
  );
}

export function ReferralCodeForm({
  setPendingTxns,
  pendingTxns,
  callAfterSuccess,
  userReferralCodeString = "",
  type = "join",
}) {
  const { address: account } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider();
  const library = useMemo(() => {
    if (walletProvider) {
      return new ethers.providers.Web3Provider(walletProvider);      
    }
  }, [walletProvider])
  const [referralCode, setReferralCode] = useState("");
  const inputRef = useRef("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCodeExists, setReferralCodeExists] = useState(true);
  const debouncedReferralCode = useDebounce(referralCode, 300);
  const { chainId } = useChainId();

  function getPrimaryText() {
    const isEdit = type === "edit";
    if (isEdit && debouncedReferralCode === userReferralCodeString) {
      return t`Same as current active code`;
    }
    if (isEdit && isSubmitting) {
      return t`Updating...`;
    }

    if (isSubmitting) {
      return t`Adding...`;
    }
    if (debouncedReferralCode === "") {
      return t`Enter Referral Code`;
    }
    if (isValidating) {
      return t`Checking code...`;
    }
    if (!referralCodeExists) {
      return t`Referral Code does not exist`;
    }

    return isEdit ? t`Update` : t`Submit`;
  }
  function isPrimaryEnabled() {
    if (
      debouncedReferralCode === "" ||
      isSubmitting ||
      isValidating ||
      !referralCodeExists ||
      debouncedReferralCode === userReferralCodeString
    ) {
      return false;
    }
    return true;
  }

  async function handleSubmit(event) {
    const isEdit = type === "edit";
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const tx = await setTraderReferralCodeByUser(chainId, referralCode, library, {
        account,
        successMsg: isEdit ? t`Referral code updated!` : t`Referral code added!`,
        failMsg: isEdit ? t`Referral code updated failed.` : t`Adding referral code failed.`,
        setPendingTxns,
        pendingTxns,
      });
      if (callAfterSuccess) {
        callAfterSuccess();
      }
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setReferralCode("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsValidating(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function checkReferralCode() {
      if (debouncedReferralCode === "" || !REFERRAL_CODE_REGEX.test(debouncedReferralCode)) {
        setIsValidating(false);
        setReferralCodeExists(false);
        return;
      }

      setIsValidating(true);
      const codeExists = await validateReferralCodeExists(debouncedReferralCode, chainId);
      if (!cancelled) {
        setReferralCodeExists(codeExists);
        setIsValidating(false);
      }
    }
    checkReferralCode();
    return () => {
      cancelled = true;
    };
  }, [debouncedReferralCode, chainId]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        disabled={isSubmitting}
        type="text"
        placeholder="Enter referral code"
        className="text-input mb-sm"
        value={referralCode}
        onChange={({ target }) => {
          const { value } = target;
          setReferralCode(value);
        }}
      />
      <button type="submit" className="App-cta Exchange-swap-button" disabled={!isPrimaryEnabled()}>
        {getPrimaryText()}
      </button>
    </form>
  );
}
export default JoinReferralCode;
