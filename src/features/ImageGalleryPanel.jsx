
import { useDispatch } from "react-redux";
import { addUser } from "../slices/chatSlice";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";

function CategoryImagesDisplay({ products, openModal, owners }) {

    const dispatch = useDispatch()

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 scrollbor_hidden overflow-y-auto h-full w-full pb-0 pt-0 p-0 m-0">

            {
                products?.map((item,k)=> {

                    return <section className="flex flex-col z-0" key={k}>

                                <img
                                    key={k}
                                    src={item?.image_product}
                                    alt={item?.name_product}
                                    className="relatif  object-cover rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale hover:scale-60 z-0"
                                    onClick={() => {
                                        openModal(item);
                                        dispatch(addUser(owners[item?.fournisseur]));
                                    }}
                                    onError={(e) => {
                                        if (e.target.src !== window.location.origin + "/default-product.jpg") {
                                            e.target.src = "/default-product.jpg";
                                        }
                                    }}

                                    style={{
                                        transform: `scale(${1})`,
                                        transformOrigin: 'center',
                                    }}
                                />

                                <RendrePrixProduitMonnaie item={item} />

                            </section>
                    }
                )
            }

        </div>
    );
}

export default CategoryImagesDisplay;

