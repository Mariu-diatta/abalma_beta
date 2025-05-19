import React, { useState } from "react";

const FormElementFileUpload = () => {

    return (
        <section className=''>
            <DefaultColumn>
                <UploadFileInput />
            </DefaultColumn>
        </section>
    )
};

export default FormElementFileUpload;

const DefaultColumn = ({ children }) => {
    return (
        <div className='w-full px-4 md:w-1/2 lg:w-1/3'>
            <div className='mb-12'>{children}</div>
        </div>
    )
}

const UploadFileInput = () => {

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

    };

    return (
        <nav className="">
            <div className='relative'>
                <input
                    onChange={(e) => handleImageUpload(e)}
                    type='file'
                    className='w-auto rounded-md border-0  dark:border-dark-3 text-body-color dark:text-dark-6 outline-none transition file:mr-4 file:rounded file:border-[.5px] file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-dark-3 file:py-1 file:px-[10px] file:text-sm file:font-medium file:text-dark dark:file:text-white focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD]'
                />
            </div>

            {
                previewUrl &&
                <img
                    src={previewUrl}
                    alt=""
                    className="w-28 h-28 sm:w-32 sm:h-20  border-4 border-white shadow-md object-cover"
                />
            }
        </nav>
    )
}

