import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

// ===============================
// Table Component
// ===============================
const Table = forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <table ref={ref} className={twMerge('w-full', className)} {...props}></table>
));
Table.displayName = 'Table';

// ===============================
// TableHeader Component
// ===============================
const TableHeader = forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={twMerge('', className)} {...props}></thead>
));
TableHeader.displayName = 'TableHeader';

// ===============================
// TableBody Component
// ===============================
const TableBody = forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody ref={ref} className={twMerge('', className)} {...props}></tbody>
));
TableBody.displayName = 'TableBody';

// ===============================
// TableRow Component
// ===============================
const TableRow = forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr ref={ref} className={twMerge('', className)} {...props}></tr>
));
TableRow.displayName = 'TableRow';

// ===============================
// TableHead Component
// ===============================
const TableHead = forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={twMerge(
            'h-10 px-4 text-left align-middle font-medium text-sm',
            className
        )}
        {...props}
    ></th>
));
TableHead.displayName = 'TableHead';

// ===============================
// TableCell Component
// ===============================
const TableCell = forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={twMerge(
            'p-4 align-middle',
            className
        )}
        {...props}
    ></td>
));
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
