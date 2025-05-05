import React from "react";
import { twMerge } from "tailwind-merge";

// Heading Component
const Heading = ({
    children,
    level = 1,
    className,
    ...props
}: {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    [key: string]: any;
}) => {
    const headingLevels = {
        1: 'text-3xl font-bold',
        2: 'text-2xl font-semibold',
        3: 'text-xl font-semibold',
        4: 'text-lg font-semibold',
        5: 'text-md font-semibold',
        6: 'text-sm font-semibold',
    };

    const validLevel = level >= 1 && level <= 6 ? level : 1; // Ensure level is within 1-6 range

    const combinedClasses = twMerge(
        headingLevels[validLevel],
        className
    );

    const HeadingTag = `h${validLevel}` as keyof React.JSX.IntrinsicElements; // Use type assertion

    return (
        <HeadingTag className={combinedClasses} {...props}>
            {children}
        </HeadingTag>
    );
};


export default Heading