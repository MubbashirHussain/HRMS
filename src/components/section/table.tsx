'use client'
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/base/table'; // Corrected import path
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/base/card';
import React, { useState } from 'react';
import { Input } from '../ui/base/input';
import { Button } from "../ui/base/button";

export interface TableConfig<T> {
    headers: {
        label: string;
        key: keyof T;
        isSortable?: boolean;
        renderCell?: (item: T) => React.ReactNode; // Custom cell rendering
    }[];
    actions?: {
        label: string;
        buttons: (item: T) => React.ReactNode; // Function to render action buttons
    };
}

// Reusable CustomTable Component
export const TableComponent = <T,>({
    data,
    config,
    title,
    description,
    onEdit,
    onDelete
}: {
    data: T[];
    config: TableConfig<T>;
    title?: string;
    description?: string;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    const filteredData = data.filter((item) => {
        return config.headers.some((header) => {
            const cellValue = item[header.key];
            if (typeof cellValue === 'string') {
                return cellValue.toLowerCase().includes(searchTerm.toLowerCase());
            }
            // Handle other data types if needed (e.g., numbers, dates)
            return false;
        });
    });

    const sortedData = React.useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig;
            sortableItems.sort((a, b) => {
                const valueA = a[key];
                const valueB = b[key];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return direction === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return direction === 'asc' ? valueA - valueB : valueB - valueA;
                } else {
                    return 0;
                }
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof T) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null; // Or an up/down arrow without specific direction
        }
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title || 'Data Table'}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="p-0">
                {/* Search Bar */}
                <div className="p-4">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {config.headers.map((header) => (
                                <TableHead key={header.key as string}>
                                    {header.isSortable ? (
                                        <Button
                                            variant="ghost"
                                            className="p-0 h-auto text-left hover:text-blue-600"
                                            onClick={() => requestSort(header.key)}
                                        >
                                            {header.label} {getSortIcon(header.key)}
                                        </Button>
                                    ) : (
                                        header.label
                                    )}
                                </TableHead>
                            ))}
                            {config.actions && <TableHead className="text-right">{config.actions.label}</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {sortedData.map((item, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {config.headers.map((header) => (
                                        <TableCell key={header.key as string}>
                                            {header.renderCell
                                                ? header.renderCell(item)
                                                : (item[header.key] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                    {config.actions && (
                                        <TableCell className="text-right space-x-2">
                                            {config.actions.buttons(item)}
                                        </TableCell>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};