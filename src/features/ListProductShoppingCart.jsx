import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, decreaseQuantity, getTotalPrice, clearCart } from '../slices/cartSlice';
import { useTranslation } from 'react-i18next';
import { TitleCompGenLitle } from "../components/TitleComponentGen";
import { CONSTANTS, totalPrice } from "../utils";
import BuyButtonWithPaymentForm from "./ButtonPaymentShopping";
import api from "../services/Axios";
import { showMessage } from "../components/AlertMessage";


const ListProductShoppingCart = () => {

    const { t } = useTranslation();

    const { i18n } = useTranslation();

    const lang = i18n.language || window.localStorage.i18nextLng || CONSTANTS?.FR;

    const reference = lang === CONSTANTS?.FR ? CONSTANTS?.EUR : CONSTANTS?.USD

    const [convertRate, setConvertRate] = useState(0.00)

    const dispatch = useDispatch();

    const data = useSelector(state => state.cart);

    const itemsData = data?.items

    const max_value = (prod) => {

        const selectedQty = parseInt(prod.quantity_sold, 10);

        const availableQty = parseInt(prod.quantity_product, 10);

        return selectedQty < availableQty

    }

    const handleIncreaseQuantity = (prod) => {

        const selectedQty = parseInt(prod.quantity_sold, 10);

        const availableQty = parseInt(prod.quantity_product, 10);

        if (selectedQty < availableQty) {

            dispatch(addToCart({ id: prod.id }));

        } else {

            alert(t("quantity_limit_error"));
        }
    };

    const handleDecreaseQuantity = (prod) => {

        dispatch(decreaseQuantity({ id: prod.id }));
    };

    const grandTotal = data.items.reduce((acc, product) => acc + totalPrice(product, setConvertRate, reference, convertRate), 0);

    const totalPriceBuy = !isNaN(grandTotal) ? grandTotal.toFixed(CONSTANTS?.DECIMALS_DIGITS) : CONSTANTS?.ZERO_DECIMALS_DIGITS

    const currentUser = useSelector(state => state.auth.user);


    const boughtProduct = useCallback(async () => {

        //e.preventDefault()

        //setLoading(true)

        // Construire directement le tableau, sans setState
        const productIds = data.items.map((item) => ({ "key": item?.id, "quantity": item?.quantity_sold }))

        // Construire l’objet à envoyer
        const payload = {
            product_ids: productIds,
            quantity: data.nbItem,
            price: data.totalPrice,
            transaction_type: "Achat",
            client: currentUser.id,
            payment_mode:"cash"
        }

        try {

            //setLoadingPayPal(true)

            // Envoi en JSON  const products =
            await api.post("creat/transactions/products/",

                payload,

                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            showMessage(dispatch, { Type: "Message", Message: "Transaction effectué" });

            //dispatch(addMessageNotif("Transaction effectué"))

            dispatch(clearCart())

        } catch (err) {

            //setShowPaymentForm(false)

            console.log("Erreur payment::::", err)

            showMessage(dispatch, { Type: "Erreur", Message: err?.response?.data?.detail || err?.message });


        } finally {

        //    setLoadingPayPal(false)
        }

    }, [currentUser, dispatch, data]
    )

    useEffect(() => {

        dispatch(getTotalPrice(grandTotal))

    }, [grandTotal, dispatch])


    return (

        <main
            className="style_bg relative overflow-x-auto sm:rounded-lg p-1 "

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >

            <nav className="flex flex-row items-center gap-2 ">

                <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />

                </svg>

                <TitleCompGenLitle title={t('tableEntries.selectedProducts')}/>

            </nav>

            <table

                className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg p-1"

                style={{

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }}
            >

                <thead className="bg-gray-100">
                
                    <tr> 
                        <th scope="col" className="px-16 py-3"><span className="sr-only">{t('tableEntries.image')}</span></th>

                        <th scope="col" className="px-6 py-3">{t('tableEntries.product')}</th>

                        <th scope="col" className="px-6 py-3">{t('tableEntries.category')}</th>

                        <th scope="col" className="px-6 py-3">{t('tableEntries.quantity')}</th>

                        <th scope="col" className="px-6 py-3">{t('tableEntries.price')}</th>

                        <th scope="col" className="px-6 py-3">{t('tableEntries.total')}</th>

                        <th scope="col" className="px-6 py-3">{t('tableEntries.action')}</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        itemsData?.map(
                            (
                                { id, description_product, categorie_product, image_product, price_product, quantity_product, quantity_sold, currency_price }) => (

                                <tr key={id}

                                    className=" dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"

                                    style={{

                                        backgroundColor: "var(--color-bg)",

                                        color: "var(--color-text)"
                                    }}
                                >

                                    <td className="p-1">

                                        <div className="w-10 h-10 md:w-32 md:h-32 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">

                                            <img
                                                src={image_product}

                                                alt={description_product || "Image du produit"}

                                                className="object-contain w-full h-full"

                                                loading="lazy"
                                            />

                                        </div>

                                    </td>

                                    <td className="px-6 py-4  ">{description_product?.slice(0, 6)}</td>

                                    <td className="px-6 py-4  ">{categorie_product}</td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center">

                                            <button onClick={() => handleDecreaseQuantity({ id })} className="cursor-pointer inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 border border-gray-300 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">

                                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" /></svg>

                                            </button>

                                            <input type="number" value={quantity_sold} readOnly className={`${max_value({ quantity_product, quantity_sold }) ? "" : "bg-gradient-to-br from-pink-300 to-orange-300"}  w-14 text-sm rounded-lg block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white `} />

                                            <button

                                                onClick={() => handleIncreaseQuantity({ id, quantity_product, quantity_sold })} className="cursor-pointer inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500  border border-gray-300 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">

                                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" /></svg>

                                            </button>

                                        </div>

                                    </td>

                                    <td className="px-6 py-4">

                                        {!isNaN(Number(price_product)) ? Number(price_product).toFixed(CONSTANTS?.DECIMALS_DIGITS) : CONSTANTS?.ZERO_DECIMALS_DIGITS} ({currency_price })

                                    </td>

                                    <td className="px-6 py-4 ">

                                        {
                                            (!isNaN(Number(price_product)) && !isNaN(Number(quantity_sold)) ? (Number(price_product) * Number(quantity_sold)).toFixed(CONSTANTS?.DECIMALS_DIGITS) : CONSTANTS?.ZERO_DECIMALS_DIGITS)
                                        } ({currency_price})

                                    </td>

                                    <td className="px-6 py-4">

                                        <button

                                            onClick={() => dispatch(removeFromCart({ id }))}

                                            className="font-medium  hover:underline cursor-pointer"
                                        >
                                            <svg className="w-[25px] h-[20px] text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />

                                            </svg>

                                        </button>

                                    </td>

                                </tr>
                                )
                        )
                    }

                </tbody>

                <tfoot>

                    <tr className="style-bg">

                        <td colSpan="4" className="text-right px-6 py-3 font-bold">Total:</td>

                        <td className="px-6 py-3 text-white-900 dark:text-white">

                            {!isNaN(grandTotal) ? grandTotal.toFixed(CONSTANTS?.DECIMALS_DIGITS) : CONSTANTS?.ZERO_DECIMALS_DIGITS} ({reference})

                        </td>

                        <td></td>

                    </tr>

                </tfoot>

            </table>
  
            <div className=" flex justify-center gap-3 ">

                <BuyButtonWithPaymentForm
                    total_price={totalPriceBuy}
                    reference={reference}
                />

                {
                    (totalPriceBuy>0) &&

                    <div className="text-right p-6">

                        <button onClick={boughtProduct} className="whitespace-nowrap-pointer text-white bg-gradient-to-br from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-400focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">

                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M7 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd" />
                                <path fill-rule="evenodd" d="M2 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd" />
                                <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                            </svg>

                            <span class="whitespace-nowrap">{t('paymentMode')} {totalPriceBuy} ({reference})</span>

                        </button>

                    </div>
                }
            </div>

        </main>
    );
};

export default ListProductShoppingCart;


