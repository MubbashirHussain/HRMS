import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const badgeVariants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "text-foreground",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: keyof typeof badgeVariants;
    className?: string;
    children: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ variant = 'default', className, children, ...props }, ref) => {
        const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
        const variantClasses = badgeVariants[variant] || badgeVariants.default;

        const combinedClasses = twMerge(baseClasses, variantClasses, className);

        return (
            <div ref={ref} className={combinedClasses} {...props}>
                {children}
            </div>
        );
    },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
