import React, { forwardRef, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

// ===============================
// Sheet Components
// ===============================

const Sheet = ({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = useState(open ?? false);

    // Update internal state when 'open' prop changes
    useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
        }
    }, [open]);

    const handleOpenChange = (newOpen: boolean) => {
        setIsOpen(newOpen);
        onOpenChange?.(newOpen);
    };

    return (
        <>
            {children}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => handleOpenChange(false)}
                />
            )}
            <AnimatePresence>
                {isOpen && (
                    <SheetContent
                        onOpenChange={handleOpenChange}
                    >
                        {children}
                    </SheetContent>
                )}
            </AnimatePresence>
        </>
    );
};

const SheetContent = ({
    children,
    onOpenChange,
    side = 'left', // Added side prop with default value
    className,
}: {
    children: React.ReactNode;
    onOpenChange: (open: boolean) => void;
    side?: 'left' | 'right' | 'top' | 'bottom'; // Added side type
    className?: string;
}) => {
    const horizontal = side === 'left' || side === 'right';
    const initial = horizontal ? { x: side === 'left' ? '-100%' : '100%', y: 0 } : { x: 0, y: side === 'top' ? '-100%' : '100%' };
    const animate = { x: 0, y: 0 };
    const exit = horizontal ? { x: side === 'left' ? '-100%' : '100%', y: 0 } : { x: 0, y: side === 'top' ? '-100%' : '100%' };

    return (
        <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={twMerge(
                "fixed z-50 bg-white dark:bg-gray-900 border",
                horizontal ? "inset-y-0 w-full max-w-sm" : "inset-x-0 h-full max-h-sm",
                side === 'left' && 'left-0 border-r border-gray-200 dark:border-gray-800',
                side === 'right' && 'right-0 border-l border-gray-200 dark:border-gray-800',
                side === 'top' && 'top-0 border-b border-gray-200 dark:border-gray-800',
                side === 'bottom' && 'bottom-0 border-t border-gray-200 dark:border-gray-800',
                "shadow-lg",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

const SheetTrigger = ({
    children,
    asChild,
}: {
    children: React.ReactNode;
    asChild?: boolean;
}) => {
    if (asChild) {
        return <>{children}</>;
    }
    return (
        <div
            onClick={() => {
                // Find the closest Sheet component and trigger its open state
                let current: HTMLElement | null = document.activeElement as HTMLElement | null;
                while (current) {
                    if (current.getAttribute('data-sheet') === 'true') {
                        //  (current as any).handleOpenChange(true); // removed direct access
                        const sheetElement = current.closest('[data-sheet]'); // Find the sheet
                        if (sheetElement && (sheetElement as any).handleOpenChange) {
                            (sheetElement as any).handleOpenChange(true);
                        }
                        break;
                    }
                    current = current.parentElement as HTMLElement | null; // Add type assertion here
                }
            }}
        >
            {children}
        </div>
    );
};

// ===============================
// ScrollArea Component
// ===============================

const ScrollArea = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={twMerge('relative overflow-hidden', className)}
        {...props}
    >
        <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
            {children}
        </div>
    </div>
));
ScrollArea.displayName = 'ScrollArea';

// ===============================
// Separator Component
// ===============================

const Separator = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={twMerge(
            'bg-gray-200 dark:bg-gray-800 h-[1px] w-full',
            className
        )}
        {...props}
    />
));
Separator.displayName = 'Separator';

export { Sheet, SheetContent, SheetTrigger, ScrollArea, Separator };
