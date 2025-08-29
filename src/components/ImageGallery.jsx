const ImageGallery = ({ imagesEls }) => (

    <div className="grid gap-4 h-auto w-auto overflow-x-auto w-full overflow-y-auto h-full">
        {/*<div>*/}
        {/*    <img className="h-auto rounded-lg" src={mainImage} alt="Main" />*/}
        {/*</div>*/}
        <div className="grid grid-cols-5 gap-4">

            {imagesEls?.map((prod, idx) => (

                <img key={idx} className="h-auto max-w-full rounded-lg" src={prod.image_product} alt={`Sub ${idx + 1}`} />
            ))}

        </div>

    </div>
);

export default ImageGallery;