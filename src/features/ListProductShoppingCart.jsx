import React, { useState } from "react";
import Payment from "../pages/Payment";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart, decreaseQuantity } from '../slices/cartSlice';
import Logo from "../components/LogoApp";

const ListProductShoppingCart = () => {

    const dispatch = useDispatch();

    const data = useSelector(state => state.cart);

    const max_value = (prod) => {

        const selectedQty = parseInt(prod.quantity_selected, 10);

        const availableQty = parseInt(prod.quantity_product, 10);

        return selectedQty < availableQty

    }

    const handleIncreaseQuantity = (prod) => {

        const selectedQty = parseInt(prod.quantity_selected, 10);

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

        const quantity = Number(product.quantity_selected);

        return (!isNaN(price) && !isNaN(quantity)) ? price * quantity : 0;
    };

    const grandTotal = data.items.reduce((acc, product) => acc + totalPrice(product), 0);

    return (
        <div className="mb-2 relative overflow-x-auto shadow-md sm:rounded-lg">

            <nav className="flex flex-row items-center gap-2 ">

                <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                </svg>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Produits selectionnes</h2>
            </nav>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-16 py-3"><span className="sr-only">Image</span></th>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Qty</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Total</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map(({ id, description_product, categorie_product, image_product, price_product, quantity_product, quantity_selected }) => (

                        <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">

                            <td className="p-1">
                                <div className="w-10 h-10 md:w-32 md:h-32 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                                    <img
                                        src={image_product}
                                        alt={description_product || "Image du produit"}
                                        className="object-contain w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                            </td>

                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{description_product}</td>

                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{categorie_product}</td>

                            <td className="px-6 py-4">
                                <div className="flex items-center">

                                    <button onClick={() => handleDecreaseQuantity({ id })} className="cursor-pointer inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">
                                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" /></svg>
                                    </button>

                                    <input type="number" value={quantity_selected} readOnly className={`${max_value({ quantity_product, quantity_selected }) ? "bg-gray-50" : "bg-red-100"}  w-14 border text-sm rounded-lg block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white `} />

                                    <button
                                        onClick={() => handleIncreaseQuantity({ id, quantity_product, quantity_selected })} className="cursor-pointer inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">
                                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" /></svg>
                                    </button>

                                </div>
                            </td>

                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${!isNaN(Number(price_product)) ? Number(price_product).toFixed(2) : "0.00"}
                            </td>

                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${(!isNaN(Number(price_product)) && !isNaN(Number(quantity_selected)) ? (Number(price_product) * Number(quantity_selected)).toFixed(2) : "0.00")}
                            </td>

                            <td className="px-6 py-4">
                                <button
                                    onClick={() => dispatch(removeFromCart({ id}))}
                                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer">
                                    <svg className="w-6 h-5 text-red-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <td colSpan="4" className="text-right px-6 py-3 font-bold">Total</td>
                        <td className="px-6 py-3 font-bold text-gray-900 dark:text-white">
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
                parseInt(total_price) !== 0 &&

                <button onClick={() => setShowPaymentForm(true)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">

                    <svg className="w-3.5 h-3.5 me-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                     
                    Acheter (${total_price})

                </button>
            }

            {showPaymentForm && parseInt(total_price)!==0 && (

                <div className="fixed inset-0 z-50 bg-gray-100 bg-transparent  bg-opacity-100 flex items-center justify-center" onClick={() => setShowPaymentForm(false)}>

                    <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl" onClick={(e) => e.stopPropagation()}>

                        <div className="flex justify-between items-center mb-4">

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
