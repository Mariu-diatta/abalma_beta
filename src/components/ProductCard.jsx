import { useDispatch, useSelector } from "react-redux";
import OwnerAvatar from "./OwnerProfil";
import ScrollingContent from "./ScrollContain";
import PrintNumberStars from "./SystemStar";
import { useTranslation } from 'react-i18next';
import { addMessageNotif, addUser } from "../slices/chatSlice";
import { addToCart } from "../slices/cartSlice";


const ProductCard = ({
    item,
    qut_sold,
    isInCart,
    owner,
    openModal,
    owners,
    id

}) => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const productNbViews = useSelector(state => state.cart.nbrProductViews)


    return (

        <div

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}

            className={`var(--color-text) var(--color-bg) rounded-lg shadow-md transition transform hover:-translate-y-1 hover:shadow-lg ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                }`}

        >
            {/* Image & Modal Trigger */}
            <div>
                <img
                    key={id}
                    onClick={() => {
                        openModal(item);
                        dispatch(addUser(owners[item?.fournisseur]));
                    }}
                    src={item?.image_product}
                    alt={item?.name_product}
                    className="w-full h-55 object-cover rounded-lg mb-2 transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                    onError={(e) => {
                        if (e.target.src !== window.location.origin + "/default-product.jpg") {
                            e.target.src = "/default-product.jpg";
                        }
                    }}

                    style={{
                        transform: `scale(${1})`,
                        transformOrigin: 'center',
                        transition: 'transform 0.3s ease',
                    }}
                />
            </div>

            {/* Infos Produit */}
            <div className="p-1">

                {/* Avatar & Quantité */}
                <div className="flex justify-between items-center mb-1">

                    <OwnerAvatar owner={owner}/>

                    {item?.quantity_product !== "0" && (
                        <span className="text-xs text-gray-600">
                            {t("quantity")} {item?.quantity_product}
                        </span>
                    )}

                </div>


                {/* Étoiles & Reviews */}
                <PrintNumberStars productNbViews={productNbViews} t={t} />


                {/* Description */}
                <p className="text-xs text-start truncate mb-1 md:text-sm whitespace-nowrap overflow-y-auto w-full scrollbor_hidden ">
                    {item?.description_product}
                </p>

                <div className="whitespace-nowrap flex text-xs gap-1 md:hidden bg-grey-200 text-green dark:bg-white-100 my-auto w-auto p-1 rounded-lg"><p>{t('quantity_sold')}</p>{qut_sold} </div>

                {/* Prix & Boutons */}
                <div className="flex justify-between items-center">

                    <ScrollingContent item={item} t={t}  qut_sold ={qut_sold}/>

                    <div className="flex gap-2">

                        <button

                            title="Ajouter au panier"

                            onClick={
                                () => {

                                    dispatch(

                                        addToCart(item)

                                    );

                                    dispatch(

                                        addMessageNotif(

                                            `Produit ${item?.code_reference} sélectionné le ${Date.now()}`
                                        )
                                    );
                                }}

                            className="cursor-pointer p-1 rounded-full hover:bg-green-100 transition"
                        >
                            <svg
                                className="w-8 h-6 text-gray-800 dark:text-white border-1 rounded-lg"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1"
                                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                                />
                            </svg>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductCard;

