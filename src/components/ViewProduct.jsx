import React from 'react'
import { getMediaUrl } from '../utils'

const ViewProduct = ({ productSelected }) => {

    return (
        <div
            className="fixed flex flex-col z-50 items-center justify-center bg-white rounded-lg shadow-lg"
            style={{ zIndex: 9999 }}
        >
            {/* Image principale */}
            <div className="relative">
                <img
                    className="rounded-lg max-w-full h-auto"
                    src={getMediaUrl(productSelected?.image_product)}
                    alt={productSelected?.name_product || 'Product Image'}
                />
            </div>

            {/* Infos du produit */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-center px-4 py-3">
                <p className="px-4 py-2 font-semibold">{productSelected?.name_product || '-'}</p>
                <p className="px-4 py-2 text-sm text-gray-600">{productSelected?.description_product || '-'}</p>
                <p className="px-4 py-2 text-sm">{productSelected?.categorie_product?.name || productSelected?.categorie_product || '-'}</p>
                <p className="px-4 py-2 capitalize">{productSelected?.statut || '-'}</p>
                <p className="px-4 py-2 font-medium text-indigo-600">
                    {productSelected?.price_product ? `${productSelected.price_product} ${productSelected?.currency_price || ''}` : '-'}
                </p>
                <p className="px-4 py-2 text-sm">{productSelected?.operation_product || '-'}</p>
            </div>
        </div>
    )
}

export default ViewProduct
