import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/base/input";
import { Label } from "@/components/ui/base/label"; // Import from @heroui/react
import { Textarea } from "@/components/ui/base/textarea";
import { Button } from "@/components/ui/base/button";
import { Calendar, Select, SelectItem } from "@heroui/react"; // Changed import
import { twMerge } from "tailwind-merge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/base/popover";
import { CalendarIcon } from "lucide-react";
import { DateValue, parseDate } from "@internationalized/date";
import { SelectTrigger } from "../ui/base/select";

export interface InputConfig {
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "date";
  label: string;
  name: string; // This is the key for the form data
  placeholder?: string;
  defaultValue?: string | number | string[] | DateValue<any>;
  options?: { label: string; value: string | number }[]; // For select dropdown
  isDisabled?: boolean;
  error?: string; // Add error prop
}

interface FormModalProps {
  isOpen?: boolean;
  onClose?: (data?: Record<string, any>) => void; // Include data in onClose
  heading: string;
  inputs: InputConfig[];
  submitButtonText?: string;
  isDirectChildren?: boolean; //remove this
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen = false,
  onClose,
  heading,
  inputs,
  submitButtonText = "Submit",
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // State for errors
  const [dateValues, setDateValues] = useState<
    Record<string, DateValue<any> | undefined>
  >({});

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, any> = {};
    const initialDates: Record<string, DateValue<any> | undefined> = {};
    inputs.forEach((input) => {
      if (input.type === "date") {
        initialDates[input.name] = input.defaultValue
          ? parseDate(input.defaultValue)
          : undefined;
      } else {
        initialData[input.name] = input.defaultValue || "";
      }
    });
    setFormData(initialData);
    setDateValues(initialDates);
    setFormErrors({}); // Reset errors when form opens
  }, [inputs, isOpen]); // Depend on inputs and isOpen

  const handleInputChange = useCallback((name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error on input change
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback(
    (name: string, value: string | string[] | undefined) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    },
    []
  );

  const handleDateChange = useCallback(
    (name: string, value: DateValue<any> | undefined) => {
      setDateValues((prevDates) => ({
        ...prevDates,
        [name]: value,
      }));
      setFormData((prevData) => ({
        ...prevData,
        [name]: value ? new Date(value.toString()) : undefined, // Store as Date
      }));

      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    // Basic validation - extend as needed
    inputs.forEach((input) => {
      if (input.type === "text" && !formData[input.name]?.trim()) {
        newErrors[input.name] = `${input.label} is required`;
        hasErrors = true;
      }
      if (input.type === "email" && !/^\S+@\S+$/.test(formData[input.name])) {
        newErrors[input.name] = "Invalid email format";
        hasErrors = true;
      }
      if (input.type === "number" && isNaN(Number(formData[input.name]))) {
        newErrors[input.name] = `${input.label} must be a number`;
        hasErrors = true;
      }
      if (input.type === "select" && !formData[input.name]) {
        newErrors[input.name] = `${input.label} is required`;
        hasErrors = true;
      }
      if (input.type === "date" && !formData[input.name]) {
        newErrors[input.name] = `${input.label} is required`;
        hasErrors = true;
      }
    });

    setFormErrors(newErrors);

    if (!hasErrors && onClose) {
      onClose(formData);
    }
  }, [formData, onClose, inputs]);

  if (!isOpen) return null; // Early return if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {heading}
        </h2>
        <div className="space-y-4">
          {inputs.map((input) => {
            const commonProps = {
              id: input.name,
              name: input.name,
              placeholder: input.placeholder,
              defaultValue: input.defaultValue,
              disabled: input.isDisabled,
              onChange: (e: any) =>
                handleInputChange(input.name, e.target.value),
              className: twMerge(
                "mt-1 w-full",
                "bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600",
                "text-gray-900 dark:text-white",
                "focus:ring-blue-500 focus:border-blue-500",
                "rounded-md shadow-sm",
                "transition-colors duration-200",
                input.error &&
                  "border-red-500 focus:ring-red-500 focus:border-red-500" // Apply error styles
              ),
            };

            return (
              <div key={input.name} className="space-y-1">
                <Label
                  htmlFor={input.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {input.label}
                </Label>
                {input.type === "text" && (
                  <Input
                    type="text"
                    {...commonProps}
                    error={formErrors[input.name]}
                  />
                )}
                {input.type === "number" && (
                  <Input
                    type="number"
                    {...commonProps}
                    error={formErrors[input.name]}
                  />
                )}
                {input.type === "email" && (
                  <Input
                    type="email"
                    {...commonProps}
                    error={formErrors[input.name]}
                  />
                )}
                {input.type === "password" && (
                  <Input
                    type="password"
                    {...commonProps}
                    error={formErrors[input.name]}
                  />
                )}
                {input.type === "textarea" && (
                  <Textarea
                    {...commonProps}
                    rows={3}
                    error={formErrors[input.name]}
                  />
                )}
                {input.type === "select" && input.options && (
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select className="max-w-xs" label="Select an animal">
                      {input.options.map((option) => (
                        <SelectItem
                          key={option.value}
                          className="hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
                {input.type === "date" && (
                  <Popover className="relative">
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={twMerge(
                          commonProps.className,
                          "justify-start text-left font-normal",
                          formErrors[input.name] &&
                            "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {dateValues[input.name] ? (
                          new Date(
                            dateValues[input.name]!.toString()
                          ).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">
                            {input.placeholder}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto absolute top-[50px] z-20 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                      align="start"
                    >
                      <Calendar
                        showMonthAndYearPickers
                        aria-label="Date (Uncontrolled)"
                        value={dateValues[input.name]}
                        onChange={(date) => handleDateChange(input.name, date)}
                        className="rounded-md border shadow"
                      />
                    </PopoverContent>
                  </Popover>
                )}
                {formErrors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors[input.name]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200"
          >
            {submitButtonText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FormModal;
