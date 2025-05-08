import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { twMerge } from 'tailwind-merge';

// --- Context ---
const SelectContext = React.createContext<{
    value: string | string[] | undefined;
    onValueChange: (value: string | string[] | undefined) => void;
    multiple: boolean;
    disabled: boolean;
} | null>(null);

const useSelectContext = () => {
    const context = React.useContext(SelectContext);
    if (!context) {
        throw new Error('Select components must be used within a Select component');
    }
    return context;
};

// --- Root ---
const Select = ({
    children,
    onValueChange,
    defaultValue,
    value: valueProp,
    multiple = false,
    disabled = false,
    className,
    ...props
}: {
    children: React.ReactNode;
    onValueChange?: (value: string | string[] | undefined) => void;
    defaultValue?: string | string[];
    value?: string | string[];
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    [key: string]: any;
}) => {
    const [value, setValueState] = useState<string | string[] | undefined>(defaultValue);

    // Controlled vs Uncontrolled
    const isControlled = typeof valueProp !== 'undefined';
    const actualValue = isControlled ? valueProp : value;

    const setValue = useCallback(
        (newValue: string | string[] | undefined) => {
            if (!isControlled) {
                setValueState(newValue);
            }
            onValueChange?.(newValue);
        },
        [isControlled, onValueChange]
    );

    const contextValue = React.useMemo(() => ({
        value: actualValue,
        onValueChange: setValue,
        multiple,
        disabled,
    }), [actualValue, multiple, disabled, setValue]);

    return (
        <SelectContext.Provider value={contextValue} {...props}>
            <div data-radix-select-root="" className={twMerge("relative", className)}>
                {children}
            </div>
        </SelectContext.Provider>
    );
};
Select.displayName = 'Select';

// --- Trigger ---
const SelectTrigger = forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<'button'> & { asChild?: boolean }
>(({ asChild = false, children, className, ...props }, ref) => {
    const { value, multiple, disabled } = useSelectContext();
    const displayValue = Array.isArray(value)
        ? value.length > 0
            ? multiple
                ? `${value.length} selected`
                : value[0]
            : 'Select...'
        : value || 'Select...';

    const triggerProps = {
        ref,
        disabled,
        className: twMerge(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className
        ),
        ...props,
        'data-radix-select-trigger': '',
    };

    if (asChild) {
        return React.cloneElement(React.Children.only(children) as React.ReactElement, triggerProps);
    }

    return (
        <button {...triggerProps} type="button">
            <span className="truncate">{displayValue}</span>
            <SelectPrimitiveIcon className="h-4 w-4 opacity-50" />
        </button>
    );
});
SelectTrigger.displayName = 'SelectTrigger';

// --- Value ---
const SelectValue = ({
    placeholder,
    className,
    ...props
}: { placeholder?: string; className?: string; [key: string]: any }) => {
    const { value, multiple } = useSelectContext();
    const displayValue = Array.isArray(value)
        ? value.length > 0
            ? multiple
                ? `${value.length} selected`
                : value[0]
            : placeholder || ''
        : value || placeholder || '';

    return (
        <span className={twMerge("truncate", className)} {...props}>
            {displayValue}
        </span>
    );
};
SelectValue.displayName = 'SelectValue';

// --- Content ---
const SelectContent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { position?: 'popper' | 'static' }
>(({ children, className, position = 'popper', ...props }, ref) => (
    <SelectPrimitivePortal>
        <SelectPrimitiveContent
            ref={ref}
            className={twMerge(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === 'popper' &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitiveViewport
                className={twMerge(
                    "p-1",
                    position === 'popper' &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitiveViewport>
            <SelectScrollDownButton />
        </SelectPrimitiveContent>
    </SelectPrimitivePortal>
));
SelectContent.displayName = 'SelectContent';

// --- Label ---
const SelectLabel = forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label ref={ref} className={twMerge("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = 'SelectLabel';

// --- Item ---
const SelectItem = forwardRef<
    HTMLLIElement,
    React.LiHTMLAttributes<HTMLLIElement> & { value: string; disabled?: boolean }
>(({ className, children, value, disabled = false, ...props }, ref) => {
    const { onValueChange, multiple, value: contextValue } = useSelectContext();

    const isSelected = multiple
        ? Array.isArray(contextValue) && contextValue.includes(value)
        : contextValue === value;

    const handleSelect = useCallback(() => {
        if (disabled) return;

        if (multiple) {
            if (Array.isArray(contextValue)) {
                if (isSelected) {
                    const newValue = contextValue.filter((v) => v !== value);
                    onValueChange(newValue);
                } else {
                    const newValue = [...contextValue, value];
                    onValueChange(newValue);
                }
            } else {
                onValueChange([value]);
            }
        } else {
            onValueChange(value);
        }
    }, [contextValue, multiple, onValueChange, value, disabled, isSelected]);

    return (
        <li
            ref={ref}
            className={twMerge(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={handleSelect}
            data-value={value}
            data-selected={isSelected}
            data-disabled={disabled}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                )}
            </span>
            {children}
        </li>
    );
});
SelectItem.displayName = 'SelectItem';

// --- Separator ---
const SelectSeparator = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={twMerge("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = 'SelectSeparator';

// --- Group ---
const SelectGroup = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
    <div ref={ref} className={twMerge("", className)} {...props}>
        {children}
    </div>
));
SelectGroup.displayName = 'SelectGroup';

// --- Scroll Up/Down Buttons ---
const SelectScrollUpButton = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={twMerge("flex cursor-default items-center justify-center py-1", className)} {...props}>
        <ChevronUp className="h-4 w-4" />
    </div>
));
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={twMerge("flex cursor-default items-center justify-center py-1", className)} {...props}>
        <ChevronDown className="h-4 w-4" />
    </div>
));
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

// --- Portal and Viewport ---
const SelectPrimitivePortal = ({ children }: { children: React.ReactNode }) => (
    <div data-radix-select-portal="">{children}</div>
);
const SelectPrimitiveContent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { position?: 'popper' | 'static' }
>(({ className, children, position = 'popper', ...props }, ref) => (
    <div
        ref={ref}
        className={twMerge(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            position === 'popper' &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
        )}
        position={position}
        {...props}
    >
        {children}
    </div>
));
SelectPrimitiveContent.displayName = 'SelectPrimitiveContent';

const SelectPrimitiveViewport = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={twMerge(
            "p-1",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
SelectPrimitiveViewport.displayName = 'SelectPrimitiveViewport';

const SelectPrimitiveIcon = ({ className, ...props }: { className?: string; [key: string]: any }) => (
    <ChevronDown className={twMerge("h-4 w-4 opacity-50", className)} {...props} />
);
SelectPrimitiveIcon.displayName = 'SelectPrimitiveIcon';

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
    SelectPrimitiveIcon
};
