import React, { useState } from 'react';
import FormElementFileUpload from './FormFile';

const UpdateProduct = () => {

    const [dataProduct, setDataProduct] = useState({
        Name: "",
        Brand: "",
        Price: "",
        Categorie: "",
        Poid: "",
        Option: "",
        Description: "",
        Image: ""
    });

    const onChangeClick = (e) => {
        const { name, value } = e.target;
        setDataProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <section className="bg-white dark:bg-gray-900">

            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">

                {/* En-tête avec image et titre */}
                <div className="flex items-center mb-6 space-x-4">
                    <svg className="shrink-0 w-7 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8c0 12.8 10.4 23.2 23.2 23.2l56.8 0c26.5 0 48 21.5 48 48l0 56.8c0 12.8 10.4 23.2 23.2 23.2c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2c-12.8 0-23.2 10.4-23.2 23.2L384 464c0 26.5-21.5 48-48 48l-56.8 0c-12.8 0-23.2-10.4-23.2-23.2c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8c0 12.8-10.4 23.2-23.2 23.2L48 512c-26.5 0-48-21.5-48-48L0 343.2C0 330.4 10.4 320 23.2 320c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256C10.4 256 0 245.6 0 232.8L0 176c0-26.5 21.5-48 48-48l120.8 0c12.8 0 23.2-10.4 23.2-23.2z" />
                    </svg>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        Ajouter / Modifier un produit
                    </h2>
                </div>

                <form action="#">

                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">

                        <div className="sm:col-span-2">
                            <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                            <input
                                type="text"
                                name="Name"
                                id="Name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={dataProduct.Name}
                                placeholder="Type product name"
                                onChange={onChangeClick}
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="Brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                            <input
                                type="text"
                                name="Brand"
                                id="Brand"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={dataProduct.Brand}
                                placeholder="Product brand"
                                onChange={onChangeClick}
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                            <input
                                type="number"
                                name="Price"
                                id="Price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={dataProduct.Price}
                                placeholder="$299"
                                onChange={onChangeClick}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="Categorie" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <select
                                id="Categorie"
                                name="Categorie"
                                value={dataProduct.Categorie}
                                onChange={onChangeClick}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">Select category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="TV">TV/Monitors</option>
                                <option value="PC">PC</option>
                                <option value="GA">Gaming/Console</option>
                                <option value="PH">Phones</option>
                                <option value="HB">Habits</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="Poid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                            <input
                                type="number"
                                name="Poid"
                                id="Poid"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={dataProduct.Poid}
                                onChange={onChangeClick}
                                placeholder="Ex. 12"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="Option" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Option</label>
                            <select
                                id="Option"
                                name="Option"
                                value={dataProduct.Option}
                                onChange={onChangeClick}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option value="">Vendre / Pretable</option>
                                <option value="1">Pretable / Offert</option>
                                <option value="2">Vendre</option>
                                <option value="3">Offert</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="Image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image Produit</label>
                            <FormElementFileUpload />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="Description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea
                                id="Description"
                                name="Description"
                                value={dataProduct.Description}
                                onChange={onChangeClick}
                                rows="8"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write a product description here..."
                            />
                        </div>

                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            className="text-blue bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Update product
                        </button>
                        <button
                            type="button"
                            className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        >
                            <svg
                                className="w-5 h-5 mr-1 -ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateProduct;
