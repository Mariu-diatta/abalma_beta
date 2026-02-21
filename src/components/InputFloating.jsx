import React from 'react'

const FloatingInput = ({ id, name, label, type = 'text', value, onChange, maxLength, wrapperClass = '', disabled }) => (

    <div className={`relative ${wrapperClass}`}>

        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            maxLength={maxLength}
            disabled={disabled || false}
            className="peer block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
        />

        <label htmlFor={id} className="absolute text-sm text-gray-500 dark:text-gray-400 top-4 left-2.5 transition-all scale-75 -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4">
            {label}
        </label>

    </div>
);

export default FloatingInput