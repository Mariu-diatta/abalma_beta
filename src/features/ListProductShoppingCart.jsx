import React, { useEffect, useState } from "react";
import Payment from "../pages/Payment";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, decreaseQuantity, getTotalPrice } from '../slices/cartSlice';
import Logo from "../components/LogoApp";
import { useTranslation } from 'react-i18next';


const ListProductShoppingCart = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const data = useSelector(state => state.cart);

    const max_value = (prod) => {

        const selectedQty = parseInt(prod.quanttity_product_sold, 10);

        const availableQty = parseInt(prod.quantity_product, 10);

        return selectedQty < availableQty

    }

    const handleIncreaseQuantity = (prod) => {

        const selectedQty = parseInt(prod.quanttity_product_sold, 10);

        const availableQty = parseInt(prod.quantity_product, 10);

        if (selectedQty < availableQty) {

            dispatch(addToCart({ id: prod.id }));

        } else {

            alert("Vous ne pouvez pas dépasser la quantité disponible !");
        }
    };

    const handleDecreaseQuantity = (prod) => {

        dispatch(decreaseQuantity({ id: prod.id }));
    };

    const totalPrice = (product) => {

        const price = Number(product.price_product);

        const quantity = Number(product.quanttity_product_sold);

        return (!isNaN(price) && !isNaN(quantity)) ? price * quantity : 0;
    };

    const grandTotal = data.items.reduce((acc, product) => acc + totalPrice(product), 0);


    useEffect(() => {

        dispatch(getTotalPrice(grandTotal))

    }, [grandTotal, dispatch])


    return (

        <div
            className="style_bg mb-2 relative overflow-x-auto sm:rounded-lg p-2"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >

            <nav className="flex flex-row items-center gap-2 ">

                <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />

                </svg>

                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t('tableEntries.selectedProducts')}</h2>

            </nav>

            <table

                className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg p-2"

                style={{

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }}
            >

                <thead

                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"

                    style={

                        {
                            backgroundColor: "var(--color-bg)",

                            color: "var(--color-text)"
                        }
                    }
                >

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

                    {data.items.map(({ id, description_product, categorie_product, image_product, price_product, quantity_product, quanttity_product_sold }) => (

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

                            <td className="px-6 py-4  ">{description_product}</td>

                            <td className="px-6 py-4  ">{categorie_product}</td>

                            <td className="px-6 py-4">

                                <div className="flex items-center">

                                    <button onClick={() => handleDecreaseQuantity({ id })} className="cursor-pointer inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 border border-gray-300 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">

                                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" /></svg>

                                    </button>

                                    <input type="number" value={quanttity_product_sold} readOnly className={`${max_value({ quantity_product, quanttity_product_sold }) ? "" : "bg-red-100"}  w-14 border text-sm rounded-lg block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white `} />

                                    <button

                                        onClick={() => handleIncreaseQuantity({ id, quantity_product, quanttity_product_sold })} className="cursor-pointer inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500  border border-gray-300 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">

                                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" /></svg>

                                    </button>

                                </div>

                            </td>

                            <td className="px-6 py-4">

                                ${!isNaN(Number(price_product)) ? Number(price_product).toFixed(2) : "0.00"}

                            </td>

                            <td className="px-6 py-4 ">

                                ${(!isNaN(Number(price_product)) && !isNaN(Number(quanttity_product_sold)) ? (Number(price_product) * Number(quanttity_product_sold)).toFixed(2) : "0.00")}

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
                    ))}

                </tbody>

                <tfoot>

                    <tr className="style-bg">

                        <td colSpan="4" className="text-right px-6 py-3 font-bold">Total</td>

                        <td className="px-6 py-3 font-bold text-white-900 dark:text-white">

                            ${!isNaN(grandTotal) ? grandTotal.toFixed(2) : "0.00"}

                        </td>

                        <td></td>

                    </tr>

                </tfoot>

            </table>

            <BuyButtonWithPaymentForm total_price={!isNaN(grandTotal) ? grandTotal.toFixed(2) : "0.00"} />

        </div>
    );
};

export default ListProductShoppingCart;


const BuyButtonWithPaymentForm = ({ total_price }) => {

    const [showPaymentForm, setShowPaymentForm] = useState(false);

    return (

        <div className="text-right p-4">

            {
                (parseInt(total_price) !== 0) &&

                <button onClick={() => setShowPaymentForm(true)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">

                    <svg className="w-3.5 h-3.5 me-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">

                         <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                     
                    Acheter (${total_price})

                </button>
            }

            {showPaymentForm && parseInt(total_price)!==0 && (

                <div className="backdrop-blur-sm fixed inset-0 z-50 bg-gray-100 bg-transparent  bg-opacity-100 flex items-center justify-center style-bg" onClick={() => setShowPaymentForm(false)}>

                    <div className=" rounded-lg p-6 w-full max-w-xl shadow-xl " onClick={(e) => e.stopPropagation()}>

                        <div className="flex justify-between items-center mb-4 style-bg">

                            <Logo />

                            <span className="text-lg font-semibold">Total à payer : ${total_price}</span>
                        </div>

                        <Payment />

                    </div>

                </div>
            )}

        </div>
    );
};
