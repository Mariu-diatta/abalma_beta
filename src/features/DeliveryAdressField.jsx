import { useState } from "react";
import { PrimaryButton } from "./Settings";
import LocationSearchPopover from "./LocationSearch";
import api from "../services/Axios";
import { showMessage } from "../components/AlertMessage";
import { useDispatch } from "react-redux";
import { CONSTANTS } from "../utils";
export default function DeliveryAddressField({
    deliveryAddress = [],
    address,
    onUpdate,
    onSelect,
    loading = false,
    setDeliveryAddress,
    t,
}) {
    const [selectedId, setSelectedId] = useState(
        deliveryAddress?.[0]?.id || ""
    );

    const hasAddress = deliveryAddress?.length > 0 || !!address;

    const [loadingDel, setLoadingDel] = useState(false)

    const dispatch = useDispatch();


    const deleteDeliveredAdress = async (id) => {
        setLoadingDel(true)
        try {
            await api.delete(`delivery-address/${id}/`);;
            deliveryAddress.filter(item => item.id !== id)
            setDeliveryAddress(deliveryAddress)
            showMessage(dispatch, { Type: 'Message', Message: 'Done!' });
        } catch (error) {
            console.log("erreur suppression adress", error)
            showMessage(dispatch, {
                Type: CONSTANTS.ERRREUR, Message: 'Error!'
            });
        } finally {
            setLoadingDel(false)
        }

    };

    return (
        <div className="bg-white rounded-xl shadow-md border-0 p-4 space-y-3 my-5 md:w-1/2 lg:w-1/2">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                    {hasAddress ? t("adress") : t("noDeliveryAddress")}
                </h3>

                {!hasAddress && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                        {t("noDeliveryAddress")}
                    </span>
                )}
            </div>

            {/* SELECT */}
            {deliveryAddress?.length > 0 && (
                <div className="space-y-2">

                    <select
                        className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            onSelect?.(e.target.value);
                        }}
                    >
                        {deliveryAddress.map((item) => (
                            <option key={item.id} value={item.id} >
                                <>{JSON.parse(item.address).adresse}</>
                            </option>
                        ))}
                    </select>
                    {
                        selectedId &&
                        <button onClick={() => deleteDeliveredAdress(selectedId)} className="bg-red-300 rounded-full p-2 text-md">
                            {!loadingDel ? `Delete ${selectedId}` : "Loading"}
                        </button>
                    }
                </div>
            )}

            {/* FORM */}
            <form onSubmit={onUpdate} className="flex flex-col gap-3">
                <LocationSearchPopover setLocationSearch={onSelect} />

                <PrimaryButton
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading
                        ? t("loading")
                        : t("settingsText.deleveredPawd", "Mettre à jour l'adresse de livraison")}
                </PrimaryButton>
            </form>
        </div>
    );
}