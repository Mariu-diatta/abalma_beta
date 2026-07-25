import React from 'react'
import ProductsDisplayWithCarousel from '../components/CarrouselProducts';
import CategoryProductsImagesGalleryDisplay from './ImageGalleryPanel';
import CategoryProductsCardDisplay from './ImageGallery';


const ProductSpecifiViews = ({ products, openModal, owners, panelRef }) => {

    return (

        <div

            ref={panelRef}

            className={` flex gap-0  w-full bg-grey-9000 shadow-xs rounded-md mt-1 z-0 py-1 m-0 ${products?.length <= 0 ? "hidden" : "min-h-70 max-h-70 px-0"}`}

        >
            <div style={{ flex: 2 }} className="hidden md:block p-0 m-0">

                <CategoryProductsCardDisplay

                    imagesEls={products}

                    openModal={openModal}

                    owners={owners}

                />

            </div>

            <div style={{ flex: 3 }} className="p-0 m-0">

                <ProductsDisplayWithCarousel

                    products={products}

                    openModal={openModal}

                    owners={owners}
                />

            </div>

            <div style={{ flex: 2 }} className=" p-0 m-0">

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