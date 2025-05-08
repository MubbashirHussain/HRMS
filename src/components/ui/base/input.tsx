import React, { useState, useEffect, ChangeEvent } from 'react';
import { StaticImageData } from 'next/image'; // Corrected import
import { twMerge } from 'tailwind-merge';

interface Props {
    label?: string;
    placeholder?: string;
    labelClassName?: string;
    className?: string;
    prefixIcon?: string | StaticImageData;
    required?: boolean;
    type?: string;
    name?: string;
    initialValue?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    accept?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url' | 'search';
    min?: string;
    max?: string;
    error?: string; // Added error prop
}

const Input: React.FC<Props> = ({
    label,
    placeholder,
    labelClassName,
    className,
    prefixIcon,
    name,
    inputMode = 'text',
    required = false,
    type = 'text',
    initialValue = '',
    value = '',
    disabled = false,
    onChange,
    readOnly,
    accept,
    min,
    max,
    error,
}) => {
    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onChange?.(event);
    };

    return (
        <div className="relative w-full">
            {label && (
                <label
                    className={twMerge(
                        'block text-sm font-medium mb-2 transition-colors',
                        required && "after:content-['*'] after:text-red-500 after:ml-1",
                        labelClassName,
                        error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300', // Added error color
                    )}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {prefixIcon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={prefixIcon as string}
                        alt="icon"
                        width={24}
                        height={24}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    />
                )}
                <input
                    type={type}
                    inputMode={inputMode}
                    name={name}
                    value={inputValue}
                    accept={accept}
                    min={min}
                    max={max}
                    onChange={handleChange}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={twMerge(
                        'block w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        prefixIcon ? 'pl-10' : 'pl-3',
                        disabled
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                        error
                            ? 'border-red-500 focus:ring-red-500' // Apply error styles
                            : 'border-gray-300 dark:border-gray-600',
                        className,
                    )}
                />
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p> // Error message
            )}
        </div>
    );
};

export default Input;
