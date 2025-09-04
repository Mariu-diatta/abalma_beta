import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

const ImageGallery = ({ imagesEls,  openModal, owners}) => { 
       
    const cartItems = useSelector(state => state?.cart?.items);


    return (

        <div className="grid grid-cols-2 gap-1 h-full w-full overflow-x-auto overflow-y-auto overflow-x-auto scrollbor_hidden">


            {imagesEls?.map(item => {
                const isInCart = cartItems?.some(product => product?.id === item?.id);
                const owner = owners[item?.fournisseur];

                return (
                    <ProductCard
                        key={item?.id} // ✅ Clé unique ici
                        id={item?.id}
                        item={item}
                        isInCart={isInCart}
                        owner={owner}
                        openModal={openModal}
                        owners={owners}
                        qut_sold={item?.quanttity_product_sold}
                    />
                );
            })}

        </div>
    )


};

export default ImageGallery;