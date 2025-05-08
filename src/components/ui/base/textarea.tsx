import React, { useState, useEffect, ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    placeholder?: string;
    labelClassName?: string;
    className?: string;
    required?: boolean;
    name?: string;
    initialValue?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    readOnly?: boolean;
    rows?: number;
    error?: string; // Added error prop
}

const Textarea: React.FC<Props> = ({
    label,
    placeholder,
    labelClassName,
    className,
    name,
    required = false,
    initialValue = '',
    value = '',
    disabled,
    onChange,
    readOnly,
    rows = 3,
    error,
    ...props
}) => {
    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
            <textarea
                name={name}
                value={inputValue}
                onChange={handleChange}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows}
                placeholder={placeholder}
                className={twMerge(
                    'block w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    disabled
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                    error
                        ? 'border-red-500 focus:ring-red-500' // Apply error styles
                        : 'border-gray-300 dark:border-gray-600',
                    className,
                    'min-h-[80px]', // Added a minimum height
                )}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p> // Error message
            )}
        </div>
    );
};

export  {Textarea};

