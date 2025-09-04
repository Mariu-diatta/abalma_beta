import Carousel from "./CarrouselProducts"
import ImageGallery from "./ImageGallery"
import ImageGalleryPan from "./ImageGalleryPanel"

const ProductSpecifiViews = ({ products, openModal, owners, btnId, panelRef }) => {

    return (

        <div
            ref={panelRef}
            className={`${btnId && products?.length ? "flex gap-2 bg-grey-9000 shadow-lg rounded-md h-70 lg:h-70 w-full mt-1" : "hidden"}`}
        >
            <div style={{ flex: 2 }} className="hidden lg:block">

                <ImageGallery

                    imagesEls={products}

                    openModal={openModal}

                    owners={owners}

                />

            </div>

            <div style={{ flex: 3 }}>

                <Carousel

                    products={products}

                    openModal={openModal}

                    owners={owners}
                />

            </div>

            <div style={{ flex: 2 }}>

                <ImageGalleryPan

                    imagesEls={products}

                    openModal={openModal}

                    owners={owners}


                />

            </div>
        </div>
    )
}

export default ProductSpecifiViews;