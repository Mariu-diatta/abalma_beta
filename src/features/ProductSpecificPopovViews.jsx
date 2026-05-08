import React from 'react'
import ProductsDisplayWithCarousel from '../components/CarrouselProducts';
import CategoryProductsImagesGalleryDisplay from './ImageGalleryPanel';
import CategoryProductsCardDisplay from './ImageGallery';
//import bg_image from '../assets/bg_image_.jpg'


const ProductSpecifiViews = ({ products, openModal, owners, panelRef }) => {

    return (

        <div

            ref={panelRef}

            className={`flex gap-0 gap-1 bg-grey-9000 shadow-xs rounded-md  mt-1 z-0 py-1 m-0 ${products?.length <= 0 ? "hidden" : "min-h-70 max-h-70 w-full"}`}

        >
            <div style={{ flex: 2 }} className="hidden lg:block">

                <CategoryProductsCardDisplay

                    imagesEls={products}

                    openModal={openModal}

                    owners={owners}

                />

            </div>

            <div style={{ flex: 3 }}>

                <ProductsDisplayWithCarousel

                    products={products}

                    openModal={openModal}

                    owners={owners}
                />

            </div>

            <div style={{ flex: 2 }}>

                <CategoryProductsImagesGalleryDisplay

                    products={products}

                    openModal={openModal}

                    owners={owners}


                />

            </div>
        </div>
    )
}

export default ProductSpecifiViews;