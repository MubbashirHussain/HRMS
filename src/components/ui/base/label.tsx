import React from 'react';
import { twMerge } from 'tailwind-merge';

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
    >(({ className, children, ...props }, ref) => {
    return (
        <label
            ref={ref}
            className={twMerge(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
});
Label.displayName = 'Label';

export { Label };
