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
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update product</h2>
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
