import React from 'react';
import { twMerge } from 'tailwind-merge';

// ===============================
//  Card Component (Simplified) - Themed
// ===============================
const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any; }) => {
    const baseClasses = "bg-white/80 backdrop-blur-md rounded-md shadow-lg border border-blue-200/50"; // Light theme
    const combinedClasses = twMerge(baseClasses, className);
    return <div className={combinedClasses} {...props}>{children}</div>;
};

const CardHeader = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any; }) => {
    const baseClasses = "p-6";
    const combinedClasses = twMerge(baseClasses, className);
    return <div className={combinedClasses} {...props}>{children}</div>;
};

const CardTitle = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any; }) => {
    const baseClasses = "text-xl font-semibold text-blue-600";  // Light blue
    const combinedClasses = twMerge(baseClasses, className);
    return <h1 className={combinedClasses} {...props}>{children}</h1>;
};

const CardDescription = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any; }) => {
    const baseClasses = "text-gray-500";
    const combinedClasses = twMerge(baseClasses, className);
    return <p className={combinedClasses} {...props}>{children}</p>;
};

const CardContent = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any; }) => {
    const baseClasses = "p-6 space-y-4";
    const combinedClasses = twMerge(baseClasses, className);
    return <div className={combinedClasses} {...props}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
