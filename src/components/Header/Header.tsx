import React, { ReactNode, useEffect, useState } from "react";
import cx from "classnames";

import { AppHeaderUser } from "./AppHeaderUser";
import { AppHeaderLinks } from "./AppHeaderLinks";
import { UpdateBanner } from "./UpdateBanner";

import logoImg from "img/logo_with_name.svg";
import logoSmallImg from "img/logo.svg";
import { RiMenuLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import { AnimatePresence as FramerAnimatePresence, motion } from "framer-motion";

import "./Header.css";
import { Link } from "react-router-dom";

// Fix framer-motion old React FC type (solved in react 18)
const AnimatePresence = (props: React.ComponentProps<typeof FramerAnimatePresence> & { children: ReactNode }) => (
  <FramerAnimatePresence {...props} />
);

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

type Props = {
  disconnectAccountAndCloseSettings: () => void;
  openSettings: () => void;
  setWalletModalVisible: (visible: boolean) => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function Header({
  disconnectAccountAndCloseSettings,
  openSettings,
  setWalletModalVisible,
  redirectPopupTimestamp,
  showRedirectModal,
}: Props) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isNativeSelectorModalVisible, setIsNativeSelectorModalVisible] = useState(false);

  useEffect(() => {
    if (isDrawerVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerVisible]);

  return (
    <>
      {isDrawerVisible && (
        <AnimatePresence>
          {isDrawerVisible && (
            <motion.div
              className="App-header-backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeVariants}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerVisible(!isDrawerVisible)}
            />
          )}
        </AnimatePresence>
      )}
      {isNativeSelectorModalVisible && (
        <AnimatePresence>
          {isNativeSelectorModalVisible && (
            <motion.div
              className="selector-backdrop"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeVariants}
              transition={{ duration: 0.2 }}
              onClick={() => setIsNativeSelectorModalVisible(!isNativeSelectorModalVisible)}
            />
          )}
        </AnimatePresence>
      )}
      <header>
        <div className="App-header large">
          <div className="App-header-container-left">
            <Link className="App-header-link-main" to="/">
              <img src={logoImg} className="big" alt="AMP Logo" />
              <img src={logoSmallImg} className="small" alt="AMP Logo" />
            </Link>
          </div>
          <div className="App-header-container-left">
            <AppHeaderLinks redirectPopupTimestamp={redirectPopupTimestamp} showRedirectModal={showRedirectModal} />
          </div>
          <div className="App-header-container-right">
            <AppHeaderUser
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
              openSettings={openSettings}
              setWalletModalVisible={setWalletModalVisible}
              redirectPopupTimestamp={redirectPopupTimestamp}
              showRedirectModal={showRedirectModal}
            />
          </div>
        </div>
        <div className={cx("App-header", "small", { active: isDrawerVisible })}>
          <div
            className={cx("App-header-link-container", "App-header-top", {
              active: isDrawerVisible,
            })}
          >
            <div className="App-header-container-left">
              <div className="App-header-menu-icon-block" onClick={() => setIsDrawerVisible(!isDrawerVisible)}>
                {!isDrawerVisible && <RiMenuLine className="App-header-menu-icon" />}
                {isDrawerVisible && <FaTimes className="App-header-menu-icon" />}
              </div>
              <div className="App-header-link-main clickable" onClick={() => setIsDrawerVisible(!isDrawerVisible)}>
                <img src={logoImg} className="big" alt="AMP Logo" />
                <img src={logoSmallImg} className="small" alt="AMP Logo" />
              </div>
            </div>
            <div className="App-header-container-right">
              <AppHeaderUser
                disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
                openSettings={openSettings}
                small
                setWalletModalVisible={setWalletModalVisible}
                redirectPopupTimestamp={redirectPopupTimestamp}
                showRedirectModal={showRedirectModal}
              />
            </div>
          </div>
        </div>
      </header>
      <UpdateBanner />
      <AnimatePresence>
        {isDrawerVisible && (
          <motion.div
            onClick={() => setIsDrawerVisible(false)}
            className="App-header-links-container App-header-drawer"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            <AppHeaderLinks
              redirectPopupTimestamp={redirectPopupTimestamp}
              showRedirectModal={showRedirectModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
