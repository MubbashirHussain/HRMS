import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={twMerge('relative overflow-hidden', className)}
                {...props}
            >
                <div className="relative h-full w-full overflow-auto hide-scroll">
                    {children}
                </div>
            </div>
        );
    }
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
