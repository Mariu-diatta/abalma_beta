import React, { useEffect } from 'react'

const ViewProduct = ({ productSelected }) => {

    useEffect(() => {
        console.log("Product views", productSelected)
    }, [productSelected])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white rounded-lg shadow-lg">

            {/* Image principale */}
            <div className="mb-6">
                <img
                    className="rounded-lg max-w-full h-auto"
                    src={productSelected?.image_product}
                    alt={productSelected?.name_product || 'Product Image'}
                />
            </div>

            {/* Infos du produit */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-center">
                <p className="px-4 py-2">{productSelected?.description_product || '-'}</p>
                <p className="px-4 py-2">{productSelected?.categorie_product || '-'}</p>
                <p className="px-4 py-2 capitalize">{productSelected?.statut || '-'}</p>
                <p className="px-4 py-2">{productSelected?.price_product || '-'}</p>
                <p className="px-4 py-2">{productSelected?.date_emprunt || 'N/A'}</p>
                <p className="px-4 py-2">{productSelected?.date_fin_emprunt || '-'}</p>
                <p className="px-4 py-2">{productSelected?.operation_product || '-'}</p>
            </div>

            {/* Galerie d'images */}
            <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i}>
                        <img
                            className="h-auto max-w-full rounded-lg"
                            src={`https://flowbite.s3.amazonaws.com/docs/gallery/square/image-${i}.jpg`}
                            alt={`Gallery ${i}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewProduct
