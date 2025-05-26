import React, { useState } from "react";
import Payment from "../pages/Payment";
import Logo from "./LogoApp";
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart, clearCart, decreaseQuantity } from '../slices/cartSlice'

const ListProductShoppingCart = () => {

    const dispatch = useDispatch()

    const data = useSelector(state => state.cart)

    const handleIncreaseQuantity = (prod) => {

        dispatch(addToCart({ id: prod.id }))

    };

    const handleDecreaseQuantity = (prod) => {

   
        dispatch(decreaseQuantity({id : prod.id }))

    };

    const totalPrice = (product) => product.price * product.quantity;

    const grandTotal = data.items.reduce((acc, product) => acc + totalPrice(product), 0);

    return (
        <div className="mb-2 relative overflow-x-auto shadow-md sm:rounded-lg">

            <nav className="flex flex-row items-center gap-2 m-2">

                <svg
                    className="text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fillRule="evenodd"
                        d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
                        clipRule="evenodd"
                    />
                </svg>

                <h2 className="text-2xl font-semibold  text-gray-800 dark:text-white">Produits selectionnes</h2>

            </nav>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                    <tr>
                        <th scope="col" className="px-16 py-3">
                            <span className="sr-only">Image</span>
                        </th>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Qty</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Total</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                       
                    </tr>
                </thead>

                <tbody>
                    {data.items.map(({ id, title,category, img, price, quantity }) => (
                        <tr
                            key={id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td className="p-4">
                                <img
                                    src={img}
                                    className="w-16 md:w-32 max-w-full max-h-full"
                                    alt={title}
                                />
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {title}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {category}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleDecreaseQuantity({ id, title, category, img, price, quantity })}
                                        className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        type="button"
                                    >
                                        <span className="sr-only">Decrease quantity</span>
                                        <svg
                                            className="w-3 h-3"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 18 2"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M1 1h16"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    />
                                    <button
                                        onClick={() => handleIncreaseQuantity({ id, title, category, img, price, quantity })}
                                        className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        type="button"
                                    >
                                        <span className="sr-only">Increase quantity</span>
                                        <svg
                                            className="w-3 h-3"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 18 18"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 1v16M1 9h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${totalPrice({ price, quantity }).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => dispatch(removeFromCart({ id, title, category, img, price, quantity}))}
                                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                                >
                                    <svg class="w-6 h-5 text-red-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd" />
                                    </svg>

                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

                <tfoot>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <td colSpan="4" className="text-right px-6 py-3 font-bold">
                            Total
                        </td>
                        <td className="px-6 py-3 font-bold text-gray-900 dark:text-white">
                            ${grandTotal.toFixed(2)}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <BuyButtonWithPaymentForm total_price={grandTotal.toFixed(2) } /> 
            

        </div>
    );
};

export default ListProductShoppingCart;


const BuyButtonWithPaymentForm = ({ total_price }) => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const handleBuyClick = () => {
        setShowPaymentForm(true);
    };

    const handleClose = () => {
        setShowPaymentForm(false);
    };

    // Empêche la fermeture quand on clique dans le formulaire
    const handleFormClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="relative">
            <div className="m-2 inline-flex rounded-md shadow-xs" role="group">
                <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleBuyClick}
                >
                    <svg
                        className="w-3.5 h-3.5 me-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 21"
                    >
                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                    Buy now
                </button>
            </div>

            {showPaymentForm && (
                // Overlay qui couvre tout l'écran, clic ferme le formulaire
                <div
                    className="fixed inset-0 z-50 bg-gray-800 bg-opacity-1000 flex justify-center items-center"
                    onClick={handleClose}
                >
                   

                    {/* Formulaire qui prend la moitié de la largeur et une hauteur max, centré */}
                    <div
                        className="fixed bg-white md:w-1/2 max-h-[90vh] shadow-lg p-6 overflow-auto rounded"
                        onClick={(e) => e.stopPropagation()}
                    > 
                        <div className="p-2 flex justify-between items-center">
                            <Logo />
                            <span className="font-semibold text-lg"> TOTAL à payer : {total_price}</span>
                        </div>
                        <Payment />
                    </div>
                </div>

            )}
        </div>
    );
};


