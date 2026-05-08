import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const ImageGallery = ({ imagesEls,  openModal, owners}) => { 
       
    const cartItems = useSelector(state => state?.cart?.items);


    return (

        <div className="grid grid-cols-2 gap-1 h-full w-full overflow-x-auto overflow-y-auto overflow-x-auto scrollbor_hidden z-0 p-5 m-0">


            {imagesEls?.map(item => {
                const isInCart = cartItems?.some(product => product?.id === item?.id);
                const owner = owners[item?.fournisseur];

                return (
                    <ProductCard
                        key={item?.id} // ✅ Clé unique ici
                        item={item}
                        isInCart={isInCart}
                        owner={owner}
                        openModal={openModal}
                        owners={owners}
                    />
                );
            })}

        </div>
    )


};

export default ImageGallery;