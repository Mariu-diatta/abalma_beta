
import { useDispatch } from "react-redux";
import { addUser } from "../slices/chatSlice";

function ImageGalleryPan({ imagesEls, openModal, owners }) {

    const dispatch = useDispatch()

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 scrollbor_hidden_ overflow-y-auto h-full items-center">

            {
                imagesEls?.map(item => {

                    return  <img
                                key={item?.id}
                                src={item?.image_product}
                                alt={item?.name_product}
                                className="min-w-[30dvh] min-h-[30dvh] object-cover rounded-lg  transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
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
                                    transform: `scale(${0.5})`,
                                    transformOrigin: 'center',
                                }}
                            />
                    }
                )
            }

        </div>
    );
}

export default ImageGalleryPan;

