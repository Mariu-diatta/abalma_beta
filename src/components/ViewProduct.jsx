import React from 'react'
import { BASE_URL_ } from '../services/Axios'

const ViewProduct = ({ productSelected }) => {

    //useEffect(

    //    () => {

    //        console.log(BASE_URL_ + productSelected.image_product)

    //    }, [productSelected]
    //)

    return (

        <div className="grid gap-4 mt-2">

            <div>

                <img className="h-auto max-w-full rounded-lg" src={BASE_URL_ + productSelected.image_product} alt="" />

            </div>

            <div className="flex">

                <p className="px-4 py-3">{productSelected?.description_product || '-'}</p>

                <p className="px-4 py-3">{productSelected?.categorie_product || '-'}</p>

                <p className="px-4 py-3 capitalize">{productSelected?.statut || '-'}</p>

                <p className="px-4 py-3">{productSelected?.price_product || '-'}</p>

                <p className="px-4 py-3">{productSelected?.date_emprunt || 'N/A'}</p>

                <p className="px-4 py-3">{productSelected?.date_fin_emprunt || '-'}</p>

                <p className="px-4 py-3">{productSelected?.operation_product || '-'}</p>

            </div>

            <div className="grid grid-cols-5 gap-4">
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg" alt="" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg" alt="" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg" alt="" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg" alt="" />
                </div>
                <div>
                    <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg" alt="" />
                </div>
            </div>
        </div>

    )
}

export default ViewProduct;