import React from 'react';

const InputBox = ({
    ref = null,
    type = "text",
    placeholder = "",
    name = "",
    value = "",
    onChange,
    maxLength = 80,
    id,
    required = false,
    ...rest
}) => {
    const inputId = id || `input-${name}`;

    return (
        <div className="relative mb-6 w-full">
            <input
                id={inputId}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder=" "
                maxLength={maxLength}
                required={required}
                ref={ref}
                className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                {...rest}
            />
            <label
                htmlFor={inputId}
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
                {placeholder}
            </label>
        </div>
    );
};

export default InputBox;
