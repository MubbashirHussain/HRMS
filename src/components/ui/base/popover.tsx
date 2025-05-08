import React, { forwardRef, useState, useEffect, useCallback, useRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from 'react-haiku'; // Corrected import path
import { Button } from '@/components/ui/base/button'; // Corrected import path
import { twMerge } from 'tailwind-merge'; // Corrected import path

// --- Utility Functions ---

const POPOVER_SCROLL_LOCK_ATTR = 'data-radix-popover-scroll-lock';

const ScrollLock = ({
    enabled,
    children,
}: {
    enabled: boolean;
    children: React.ReactNode;
}) => {
    useEffect(() => {
        if (enabled) {
            document.body.setAttribute(POPOVER_SCROLL_LOCK_ATTR, 'true');
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.removeAttribute(POPOVER_SCROLL_LOCK_ATTR);
                document.body.style.overflow = '';
            };
        }
    }, [enabled]);

    return <>{children}</>;
};

// --- Context ---
const PopoverContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
} | null>(null);

const usePopoverContext = () => {
    const context = React.useContext(PopoverContext);
    if (!context) {
        throw new Error('Popover components must be used within a PopoverProvider');
    }
    return context;
};

// --- Provider ---
const PopoverProvider = ({
    children,
    open: openProp,
    defaultOpen,
    onOpenChange: onOpenChangeProp,
}: {
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    const [openState, setOpenState] = useState(defaultOpen || false);

     const open = typeof openProp !== 'undefined' ? openProp : openState;

    const onOpenChange = useCallback(
        (newOpen: boolean) => {
          if (typeof onOpenChangeProp === 'function') {
            onOpenChangeProp(newOpen);
          }
          if (typeof openProp === 'undefined') {
             setOpenState(newOpen);
          }
        },
        [onOpenChangeProp, setOpenState, openProp]
    );

    const value = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);

    return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
};

// --- Trigger ---
const PopoverTrigger = forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentPropsWithoutRef<typeof Button> & { asChild?: boolean }
>(({ asChild = false, children, ...props }, ref) => {
    const { onOpenChange } = usePopoverContext();

    const triggerProps = {
        ref,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            props.onClick?.(e);
            onOpenChange(true);
        },
        ...props,
    };

    if (asChild) {
        return React.cloneElement(React.Children.only(children) as React.ReactElement, triggerProps);
    }

    return (
        <Button {...triggerProps} ref={ref}>
            {children}
        </Button>
    );
});
PopoverTrigger.displayName = 'PopoverTrigger';

// --- Content ---
const PopoverContent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        align?: 'start' | 'center' | 'end';
        side?: 'top' | 'right' | 'bottom' | 'left';
        sideOffset?: number;
        alignOffset?: number;
        collisionPadding?: number;
        onCloseAutoFocus?: (event: Event) => void;
        onPointerDownOutside?: (event: Event) => void;
        onInteractOutside?: (event: Event) => void;
        shouldWrapFocus?: boolean;
        trapFocus?: boolean;
        ariaLabel?: string;
        asChild?: boolean;
        position?: 'absolute' | 'fixed';
    }
>(
    (
        {
            align = 'center',
            side = 'bottom',
            sideOffset = 5,
            alignOffset = 0,
            collisionPadding = 0,
            onCloseAutoFocus,
            onPointerDownOutside,
            onInteractOutside,
            shouldWrapFocus,
            trapFocus,
            ariaLabel,
            asChild = false,
            position = 'absolute',
            children,
            className,
            ...props
        },
        ref
    ) => {
        const { open, onOpenChange } = usePopoverContext();
        const contentRef = useRef<HTMLDivElement>(null);
        const [isPositioned, setIsPositioned] = useState(false);

        useImperativeHandle(ref, () => contentRef.current!);

        // Close on outside click
        useClickOutside(contentRef, (event) => {
            onPointerDownOutside?.(event);
            onInteractOutside?.(event);
            onOpenChange(false);
        }, {
            disabled: !open
        });

        // Simple positioning logic (for demonstration).  A real implementation
        // would use a library like Floating UI for robust positioning.
        useEffect(() => {
            if (open && contentRef.current) {
                const triggerRect = (document.querySelector('[data-radix-popover-trigger]') as HTMLElement)?.getBoundingClientRect();
                const content = contentRef.current;

                if (!triggerRect) return;

                const containerRect = document.body.getBoundingClientRect();

                const availableHeight =
                    side === 'top' || side === 'bottom'
                        ? containerRect.height
                        : containerRect.width;

                const contentHeight = content.offsetHeight;
                const contentWidth = content.offsetWidth;

                let x = 0;
                let y = 0;

                if (side === 'bottom') {
                    y = triggerRect.bottom + sideOffset;
                } else if (side === 'top') {
                    y = triggerRect.top - contentHeight - sideOffset;
                } else if (side === 'left') {
                    x = triggerRect.left - contentWidth - sideOffset;
                }
                else if (side === 'right') {
                    x = triggerRect.right + sideOffset;
                }


                if (align === 'center') {
                    if (side === 'top' || side === 'bottom') {
                        x = triggerRect.left + triggerRect.width / 2 - contentWidth / 2 + alignOffset;
                    } else {
                        y = triggerRect.top + triggerRect.height / 2 - contentHeight / 2 + alignOffset;
                    }
                } else if (align === 'end') {
                    if (side === 'top' || side === 'bottom') {
                        x = triggerRect.right - contentWidth + alignOffset;
                    } else {
                        y = triggerRect.bottom - contentHeight + alignOffset;
                    }
                } else {
                    if (side === 'top' || side === 'bottom') {
                        x = triggerRect.left + alignOffset;
                    } else {
                        y = triggerRect.top + alignOffset;
                    }
                }

                // Basic viewport collision detection
                if (x < containerRect.left) {
                    x = containerRect.left + collisionPadding;
                } else if (x + contentWidth > containerRect.right) {
                    x = containerRect.right - contentWidth - collisionPadding;
                }
                if (y < containerRect.top) {
                    y = containerRect.top + collisionPadding;
                } else if (y + contentHeight > containerRect.bottom) {
                    y = containerRect.bottom - contentHeight - collisionPadding;
                }

                content.style.left = `${x}px`;
                content.style.top = `${y}px`;
                setIsPositioned(true);
            } else {
                setIsPositioned(false);
            }
        }, [open, align, side, sideOffset, alignOffset, collisionPadding]);


        const contentProps = {
            ref: contentRef,
            'data-radix-popover-content': '',
            role: 'dialog',
            'aria-label': ariaLabel,
            ...props,
            className: twMerge(
                'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg',
                position === 'absolute' && isPositioned && 'fixed',
                className
            ),
            style: {
                position,
                ...props.style,
                display: open ? 'block' : 'none',
            }
        };

        if (asChild) {
            return React.cloneElement(React.Children.only(children) as React.ReactElement, contentProps);
        }

        return (
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        {...contentProps}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }
);
PopoverContent.displayName = 'PopoverContent';

// --- Root ---
const Popover = ({
    children,
    open,
    defaultOpen,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    const [openState, setOpenState] = useState(defaultOpen || false);

      const computedOpen = typeof open !== 'undefined' ? open : openState;


    const internalOnOpenChange = useCallback((newOpen: boolean) => {
        setOpenState(newOpen);
        if (typeof onOpenChange === 'function') {
            onOpenChange(newOpen);
        }
    }, [onOpenChange, setOpenState]);


    return (
        <PopoverProvider open={computedOpen} defaultOpen={defaultOpen} onOpenChange={internalOnOpenChange}>
            <div data-radix-popover-root="">{children}</div>
        </PopoverProvider>
    );
};
Popover.displayName = 'Popover';

export { Popover, PopoverTrigger, PopoverContent };

