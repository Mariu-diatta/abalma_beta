import React, { useState } from 'react'
import LoadingCard from '../components/LoardingSpin';
import { canUpdateDelete } from '../utils';
import api from '../services/Axios';

const SubTransactionCard = ({
    title = "Sous-transaction",
    icon,
    status,
    createdAt,
    code,
    price,
    pk,
    url,
    data,
    setData,
    setDeleted,
    priceLabel,
    showAction = false,
    isLoading = false,
    actionLabel,
    onAction,
    actionDisabled = false,
}) => {

    const [loadingDelate, setLoadingDelate] = useState(false)

    const handleDelete = async (url) => {

        setLoadingDelate(true)

        try {

            await api.delete(

                `${url}/${pk}/`,

                {

                    params: {

                        mode: "sell"
                    }
                }

            ).then(

                resp => {

                    console.log(resp)

                    alert("Secessuffuly delete")

                    setData(
                        () => data.filter(el => el?.id !== pk)
                    )
                    setDeleted(true)
                }

            ).catch(

                err => {
                    console.log(err)

                    alert(err?.response?.data?.detail || "Error delete")

                    setDeleted(false)
                }
            )

        } catch (e) {

        } finally {
            setLoadingDelate(false)
        }
    }

    return (

        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl shadow-lg w-fit">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2 text-blue-800 font-semibold">
                    {icon}
                    <span>{title}</span>
                </div>

                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                    {status}
                </span>
            </div>

            <div className="my-3 h-px bg-gray-200" />

            {/* CONTENT */}
            <div className="flex flex-col gap-1 text-sm text-gray-700">
                <p><span className="font-medium">Date :</span> {createdAt}</p>
                <p><span className="font-medium">Code :</span> {code}</p>
                <p><span className="font-medium">{priceLabel} :</span> {price}</p>
            </div>

            <div className="my-3 h-px bg-gray-200" />

            <div className="flex justify-between px-1">

                {
                    canUpdateDelete?.includes(status) && (

                        <>
                            {
                                !loadingDelate ?
                                    <button
                                        onClick={() => handleDelete(url)}
                                        className="px-4 py-2 text-sm font-medium r  ounded-lg
                                    bg-white 
                                    hover:bg-red-50 hover:border-green-400
                                    transition"
                                    >
                                        Delete

                                    </button>
                                    :
                                    <LoadingCard />
                            }
                        </>
                    )
                }

                {/* ACTION */}
                {
                    showAction && (

                        <div className="flex justify-end">

                            {
                                !isLoading ? (
                                    <button
                                        onClick={onAction}
                                        disabled={actionDisabled}
                                        className="px-4 py-2 text-sm font-medium rounded-lg
                                    bg-white border border-gray-300
                                    hover:bg-green-50 hover:border-green-400
                                    transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {actionLabel}

                                    </button>
                                )
                                    :
                                    (
                                        <LoadingCard/>
                                    )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default SubTransactionCard;