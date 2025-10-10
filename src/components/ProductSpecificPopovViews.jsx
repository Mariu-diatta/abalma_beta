import Carousel from "./CarrouselProducts"
import ImageGallery from "./ImageGallery"
import ImageGalleryPan from "./ImageGalleryPanel"
import { useTranslation } from 'react-i18next';


const ProductSpecifiViews = ({ products, openModal, owners, panelRef }) => {

    const { t } = useTranslation();

    if (products?.length<=0) {

        return (
            <div className="flex items-center justify-center mx-auto max-w-md p-4 rounded-full border border-gray-200 mb-2 min-h-70 max-h-70">
                <span className="text-sm">{t('ListItemsFilterProduct.noProduct')}</span>
            </div>
        )
    }

    return (

        <div
            ref={panelRef}
            className={`flex gap-2 bg-grey-9000 shadow-lg rounded-md min-h-70 max-h-70 w-full mt-1`}
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