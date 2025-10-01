import { useDispatch, useSelector } from "react-redux";
import { setCurrentNav } from "../slices/navigateSlice";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';


const PayBack = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const nbItems = useSelector(state => state.cart.nbItem);

    const navigate = useNavigate();

    const currentUser = useSelector(state => state.auth.user);

    return (
        <button

            onClick={
                currentUser
                    ? () => {

                        navigate("/payment");

                        dispatch(setCurrentNav("payment"));
                    }
                    : () => {

                        if (window.confirm(t("connectAlertPaiement"))) {

                            dispatch(setCurrentNav("login"));

                            navigate("/login");
                        }

                    }
            }

            className="relative flex items-center justify-between rounded-full  dark:bg-dark-2 text-dark dark:text-white h-8 w-8 mx-4  hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm "

            style={{ color: "var(--color-text)" }}
        >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
            </svg>

            <span className="text-xs text-green-600 pb-2">{nbItems}</span>

        </button >
    )
}

export default PayBack;