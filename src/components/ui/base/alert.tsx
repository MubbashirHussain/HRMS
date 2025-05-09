import React, { forwardRef } from 'react';
import {  twMerge } from 'tailwind-merge';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
    className?: string;
    children: React.ReactNode;
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children: React.ReactNode;
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    children: React.ReactNode;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
    ({ variant = 'default', className, children, ...props }, ref) => {
        const baseClasses = 'relative w-full rounded-md border p-4';
        const variantClasses = {
            default: 'bg-background text-foreground',
            destructive:
                'bg-destructive text-destructive-foreground border-destructive',
        };

        const combinedClasses = twMerge(baseClasses, variantClasses[variant], className);

        return (
            <div ref={ref} className={combinedClasses} {...props}>
                {children}
            </div>
        );
    },
);
Alert.displayName = 'Alert';

const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
    ({ className, children, ...props }, ref) => {
        const baseClasses = 'text-lg font-semibold';
        const combinedClasses = twMerge(baseClasses, className);
        return (
            <h3 ref={ref} className={combinedClasses} {...props}>
                {children}
            </h3>
        );
    },
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
    ({ className, children, ...props }, ref) => {
        const baseClasses = 'text-sm';
        const combinedClasses = twMerge(baseClasses, className);
        return (
            <p ref={ref} className={combinedClasses} {...props}>
                {children}
            </p>
        );
    },
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
