'use client'
import React, {  useState, useEffect, useCallback, useRef, Children } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';


type SheetSide = 'left' | 'right' | 'top' | 'bottom';

interface SheetProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface SheetContentProps {
    children: ((props: { onClose: () => void }) => React.ReactNode) | React.ReactNode;
    onOpenChange: (open: boolean) => void;
    side?: SheetSide;
    className?: string;
}

interface SheetTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

// ===============================
// Sheet Components
// ===============================

const Sheet = ({
    children,
    open,
    onOpenChange,
}: SheetProps) => {
    const [isOpen, setIsOpen] = useState(open ?? false);
    const sheetRef = useRef<HTMLDivElement>(null); // Ref for the Sheet component

    // Update internal state when 'open' prop changes
    useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
        }
    }, [open]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        setIsOpen(newOpen);
        onOpenChange?.(newOpen);
    }, [onOpenChange]);

    // Make handleOpenChange available to child components.  Crucial for trigger.
    useEffect(() => {
        if (sheetRef.current) {
            (sheetRef.current as any).handleOpenChange = handleOpenChange;
        }
        return () => {
            if (sheetRef.current) {
                delete (sheetRef.current as any).handleOpenChange;
            }
        };
    }, [handleOpenChange]);

    return (
        <div ref={sheetRef} data-sheet="true">  {/* Ref and data-sheet attribute */}
            {children}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => handleOpenChange(false)}
                />
            )}
            {/* <AnimatePresence>
                {isOpen && (
                    <SheetContent
                        onOpenChange={handleOpenChange}
                    >
                        {children}
                    </SheetContent>
                )}
            </AnimatePresence> */}
        </div>
    );
};

const SheetContent = ({
    children,
    onOpenChange,
    side = 'left', // Added side prop with default value
    className,
}: SheetContentProps) => {
    const horizontal = side === 'left' || side === 'right';
    const initial = horizontal ? { x: side === 'left' ? '-100%' : '100%', y: 0 } : { x: 0, y: side === 'top' ? '-100%' : '100%' };
    const animate = { x: 0, y: 0 };
    const exit = horizontal ? { x: side === 'left' ? '-100%' : '100%', y: 0 } : { x: 0, y: side === 'top' ? '-100%' : '100%' };

    // Function to handle close, ensuring onOpenChange is called.
    const handleClose = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

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
            // Pass handleClose to children.
            data-testid="sheet-content"
        >
            {/* Make sure children can access the close handler. */}
            {typeof children === 'function' ? children({ onClose: handleClose }) : children}
        </motion.div>
    );
};

const SheetTrigger = ({
    children,
    asChild,
}: SheetTriggerProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);

    // Use useCallback for the onClick handler
    const handleClick = useCallback(() => {
        let current: HTMLElement | null = triggerRef.current;
        while (current) {
            if (current.getAttribute('data-sheet') === 'true') {
                const sheetElement = current;
                if (sheetElement && (sheetElement as any).handleOpenChange) {
                    (sheetElement as any).handleOpenChange(true);
                }
                break;
            }
            current = current.parentElement as HTMLElement | null;
        }
    }, []);

    if (asChild) {
        return <>{children}</>;
    }
    return (
        <div
            ref={triggerRef}
            onClick={handleClick}
            data-trigger="true" //Add data-trigger
        >
            {children}
        </div>
    );
};

export { Sheet, SheetContent, SheetTrigger };

