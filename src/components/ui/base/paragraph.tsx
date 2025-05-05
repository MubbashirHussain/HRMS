import { twMerge } from "tailwind-merge";

// Paragraph Component
const Paragraph = ({
    children,
    size = 4,
    className,
    ...props
}: {
    children: React.ReactNode;
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    className?: string;
    [key: string]: any;
}) => {
    const paragraphSizes = {
        1: 'text-xs',
        2: 'text-sm',
        3: 'text-base',
        4: 'text-base', // Default size
        5: 'text-lg',
        6: 'text-xl',
        7: 'text-2xl',
        8: 'text-3xl',
        9: 'text-4xl',
        10: 'text-5xl',
        11: 'text-6xl',
        12: 'text-7xl',
        13: 'text-8xl',
        14: 'text-9xl'
    };

    const validSize = size >= 1 && size <= 14 ? size : 4; // Ensure size is within 1-14 range

    const combinedClasses = twMerge(
        paragraphSizes[validSize],
        className
    );

    return (
        <p className={combinedClasses} {...props}>
            {children}
        </p>
    );
};

export default Paragraph