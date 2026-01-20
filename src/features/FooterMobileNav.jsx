import React from "react";

import { useTranslation } from "react-i18next";
import WhiteRoundedButton from "../components/Button";
import ThemeToggle from "./Theme";
import NotificationsComponent from "../components/NotificationComponent";
import PayBack from "../components/BacketButtonPay";
import { useSelector } from "react-redux";
import { ENDPOINTS } from "../utils";
import LanguageDropdown from "./Langages";

const MobileNav = ({ open }) => {

  const { t } = useTranslation();

  return (

    <nav
      id="navbarCollapse"
        className={`sm:hidden absolute top-10 right-0 w-full max-w-[250px] z-50 rounded-lg  dark:divide-dark-3 dark:bg-dark-2 ${
        !open && "hidden"
      } lg:static lg:block lg:max-w-full lg:w-auto`}
    >
      <div
        className="text-sm absolute top-3 flex flex-col items-start justify-start gap-3 p-1 sm:hidden shadow-lg rounded-lg w-full py-5 bg-white/90"
      >
        <WhiteRoundedButton titleButton={t(ENDPOINTS.LOGIN)} to={ENDPOINTS.LOGIN} />

        <WhiteRoundedButton titleButton={t(ENDPOINTS.REGISTER)} to={ENDPOINTS.REGISTER} />

        <div className="flex justify-between items-center gap-1 text-sm hover:bg-gray-100">
            <PayBack />
            <span>{t("your_basket")}</span>
        </div>

        <div className="flex justify-between items-center gap-1 text-sm  hover:bg-gray-100">
            <LanguageDropdown />
            <span>{t("choose_language")}</span>
        </div>

        <ThemeToggle/>

      </div>

    </nav>
  );
};

export default MobileNav;

//button navigate for Mobile: connected dashbord
export const NavigateLoginButtons = () => {

    const currentNav = useSelector(state => state.navigate.currentNav);

    if (ENDPOINTS?.MESSAGE_INBOX === currentNav) return

    return (

        <div
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            className=" md:hidden flex items-center justify-between gap-3 w-full bg-white absolute bottom-0 py-2 px-2"
        >
            <ThemeToggle/>

            <NotificationsComponent/>

            <PayBack/>

        </div>
    );
};


