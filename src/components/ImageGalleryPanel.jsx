
import { useDispatch } from "react-redux";
import { addUser } from "../slices/chatSlice";

function ImageGalleryPan({ imagesEls, openModal, owners }) {

    const dispatch = useDispatch()

    return (

        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 scrollbor_hidden_ overflow-y-auto h-full">

            {
                imagesEls?.map(item => {

                    return <div
                                key={item?.id}

                                style={
                                    {
                                        width: '200px',
                                        height: '200px',
                                    }}
                           >
                                <img

                                    src={item?.image_product}
                                    alt={item?.name_product}
                                    className="w-full h-55 object-cover rounded-lg mb-2 transition duration-300 ease-in-out hover:brightness-75 hover:grayscale scale-100"
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
                                        transition: 'transform 0.3s ease',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                          </div>

                    }
                )
            }

        </div>
    );
}

export default ImageGalleryPan;

