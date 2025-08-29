function ImageGalleryPan({ imagesEls }) {

    return (

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 scrollbor_hidden_ overflow-y-auto h-full">

            {imagesEls?.map((prod, idx) => (

                <div key={idx}>

                    <img
                        className="h-auto max-w-full rounded-lg"
                        src={prod?.image_product}
                        alt={`Gallery  ${idx + 1}`}
                    />

                </div>
            ))}
        </div>
    );
}

export default ImageGalleryPan;

