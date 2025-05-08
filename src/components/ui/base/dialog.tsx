import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/base/button'; // Assuming you have a Button component
import { twMerge } from 'tailwind-merge'; // Assuming you have a utility for combining class names

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
    role?: 'dialog' | 'alertdialog';
    ariaLabel?: string;
}

const Dialog = ({
    open,
    onOpenChange,
    children,
    className,
    contentClassName,
    trigger,
    title,
    description,
    footer,
    closable = true,
    onClose,
    role = 'dialog',
    ariaLabel,
}: DialogProps) => {
    const [isOpen, setIsOpen] = useState(open);
    const dialogRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // Sync internal state with prop
    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    // Handle close
    const handleClose = useCallback(() => {
        setIsOpen(false);
        onOpenChange(false);
        onClose?.();
    }, [onOpenChange, onClose]);

    // Keyboard navigation
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && closable) {
                handleClose();
            } else if (e.key === 'Tab' && isOpen && dialogRef.current) {
                const focusableElements = dialogRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (focusableElements.length > 0) {
                    const first = focusableElements[0] as HTMLElement;
                    const last = focusableElements[focusableElements.length - 1] as HTMLElement;

                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            e.preventDefault();
                            last.focus();
                        }
                    } else {
                        if (document.activeElement === last) {
                            e.preventDefault();
                            first.focus();
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', down);
        return () => window.removeEventListener('keydown', down);
    }, [isOpen, handleClose, closable]);

    // Focus management
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            const firstFocusableElement = dialogRef.current.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;

            if (firstFocusableElement) {
                firstFocusableElement.focus();
            } else if (triggerRef.current) {
                triggerRef.current.focus();
            }
        }
    }, [isOpen]);

    const dialogContentVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
    };

    const handleTriggerClick = () => {
        setIsOpen(true);
        onOpenChange(true);
    };

    return (
        <>
            {trigger && (
                <div ref={triggerRef} onClick={handleTriggerClick}>
                    {trigger}
                </div>
            )}
            <AnimatePresence>
                {isOpen && (
                    <div
                        className={twMerge(
                            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center',
                            className
                        )}
                        role="presentation"
                        aria-hidden={!isOpen}
                    >
                        <motion.div
                            ref={dialogRef}
                            variants={dialogContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={twMerge(
                                'bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6',
                                contentClassName
                            )}
                            role={role}
                            aria-label={ariaLabel || title} // Use title as default label
                        >
                            {closable && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                                >
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            )}
                            {title && (
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-gray-600 dark:text-gray-300">
                                    {description}
                                </p>
                            )}
                            {children}
                            {footer && (
                                <div className="flex justify-end gap-4">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// Sub-components (optional, for more granular control if needed)
const DialogTrigger = ({
    children,
    onClick
}: {
    children: React.ReactNode;
    onClick: () => void;
}) => {

    return (
        <div onClick={onClick}>
            {children}
        </div>
    )
};
const DialogContent = ({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) => <div className={className}>{children}</div>;
const DialogHeader = ({
    children
}: {
    children: React.ReactNode;
}) => <div>{children}</div>;
const DialogTitle = ({
    children
}: {
    children: React.ReactNode;
}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{children}</h2>;
const DialogDescription = ({
    children
}: {
    children: React.ReactNode;
}) => <p className="text-gray-600 dark:text-gray-300">{children}</p>;
const DialogFooter = ({
    children
}: {
    children: React.ReactNode;
}) => <div className="flex justify-end gap-4">{children}</div>;

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
