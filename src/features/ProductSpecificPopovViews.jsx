
import { useTranslation } from 'react-i18next';
import Carousel from '../components/CarrouselProducts';
import ImageGalleryPan from './ImageGalleryPanel';
import ImageGallery from './ImageGallery';


const ProductSpecifiViews = ({ products, openModal, owners, panelRef }) => {

    const { t } = useTranslation();

    if (products?.length<=0) {

        return (
            <div className="flex border-0 items-center justify-center mx-auto max-w-md p-4 rounded-md border border-gray-200 mb-2 min-h-70 max-h-70">
                <span className="text-sm">{t('ListItemsFilterProduct.noProduct')}</span>
            </div>
        )
    }

    return (

        <div
            ref={panelRef}
            className={`flex gap-2 bg-grey-9000 shadow-xs rounded-md min-h-70 max-h-70 w-full mt-1`}
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

                    products={products}

                    openModal={openModal}

                    owners={owners}


                />

            </div>
        </div>
    )
}

export default ProductSpecifiViews;