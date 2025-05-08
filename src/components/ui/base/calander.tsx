import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/base/popover"
import { Calendar } from "@/components/ui/base/calendar"
import { Button } from './button';

interface Props {
    label?: string;
    placeholder?: string;
    labelClassName?: string;
    className?: string;
    required?: boolean;
    name?: string;
    initialValue?: Date;
    value?: Date;
    disabled?: boolean;
    onChange?: (date: Date | undefined) => void;
    error?: string; // Added error prop
    minDate?: Date;
    maxDate?: Date;
}

const DatePicker: React.FC<Props> = ({
    label,
    placeholder,
    labelClassName,
    className,
    name,
    required = false,
    initialValue,
    value,
    disabled,
    onChange,
    error,
    minDate,
    maxDate
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialValue);

    useEffect(() => {
        setSelectedDate(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    const handleDateChange = useCallback((date: Date | undefined) => {
        setSelectedDate(date);
        onChange?.(date);
    }, [onChange]);

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
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={twMerge(
                            className,
                            "w-full justify-start text-left font-normal",
                            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                            disabled && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {selectedDate ? (
                            format(selectedDate, "PPP")
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                            (minDate && date < minDate) || (maxDate && date > maxDate) || disabled
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p> // Error message
            )}
        </div>
    );
};

export default DatePicker;
