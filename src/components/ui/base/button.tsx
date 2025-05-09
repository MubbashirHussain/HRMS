import React from 'react';
import { twMerge } from "tailwind-merge";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon'; // Added 'icon' size
  className?: string;
  disabled?: boolean; // Added disabled prop
  [key: string]: any;
}

const Button = ({
  children,
  variant,
  size,
  className,
  disabled, // Added disabled prop
  ...props
}: Props) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors";

  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50/50 hover:text-blue-600",
    ghost: "text-blue-500 hover:bg-blue-50/50 hover:text-blue-600",
    link: "text-blue-500 hover:underline",
  };

  const sizeClasses = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-lg",
    icon: "p-2", // Added 'icon' size
  };

  const combinedClasses = twMerge(
    baseClasses,
    variantClasses[variant || 'default'],
    sizeClasses[size || 'default'],
    className,
    disabled && 'opacity-50 cursor-not-allowed', // Added style for disabled state
  );

  return (
    <button className={combinedClasses} {...props} disabled={disabled}>
      {children}
    </button>
  );
};

export { Button };
