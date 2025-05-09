"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/base/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/base/table';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/base/card';
import { Badge } from '@/components/ui/base/badge';
import {
    Plus,
    FileText,
    Search,
    CalendarDays,
    Users,
    Briefcase,
    Coins,
    Edit,
    Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/base/dialog"
import { Textarea } from "@/components/ui/base/textarea"
import { Label } from "@/components/ui/base/label"
import moment from 'moment';

interface Payroll {
    id: string;
    employeeName: string;
    employeeId: string;
    department: string;
    designation: string;
    salary: number;
    payDate: string;
    status: 'Paid' | 'Pending';
    deductions: number;
    netPay: number;
}

interface TableConfig<T> {
    headers: {
        label: string;
        key: keyof T;
        isSortable?: boolean;
        renderCell?: (item: T) => React.ReactNode;
    }[];
    actions?: {
        label: string;
        buttons: (item: T) => React.ReactNode;
    };
}

const getStatusBadgeVariant = (status: Payroll['status']) => {
    switch (status) {
        case 'Paid':
            return 'default';
        case 'Pending':
            return 'secondary';
        default:
            return 'outline';
    }
};

const CustomTable = <T,>({
    data,
    config,
    title,
    description,
    onEdit,
    onDelete,
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
            if (typeof cellValue === 'string' || typeof cellValue === 'number') {
                return String(cellValue).toLowerCase().includes(searchTerm.toLowerCase());
            }
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
            return null;
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

const PayrollsPage = () => {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Payroll>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState<Partial<Payroll>>({
        status: 'Pending', // Set a default value
    });

    useEffect(() => {
        const dummyData: Payroll[] = [
            {
                id: '1',
                employeeName: 'John Doe',
                employeeId: 'JD123',
                department: 'Sales',
                designation: 'Sales Manager',
                salary: 50000,
                payDate: '2024-01-25',
                status: 'Paid',
                deductions: 500,
                netPay: 49500,
            },
            {
                id: '2',
                employeeName: 'Jane Smith',
                employeeId: 'JS456',
                department: 'Marketing',
                designation: 'Marketing Executive',
                salary: 40000,
                payDate: '2024-01-25',
                status: 'Pending',
                deductions: 200,
                netPay: 39800,
            },
            {
                id: '3',
                employeeName: 'Bob Johnson',
                employeeId: 'BJ789',
                department: 'HR',
                designation: 'HR Manager',
                salary: 60000,
                payDate: '2024-02-25',
                status: 'Pending',
                deductions: 0,
                netPay: 60000,
            },
            {
                id: '4',
                employeeName: 'Alice Brown',
                employeeId: 'AB101',
                department: 'Finance',
                designation: 'Accountant',
                salary: 45000,
                payDate: '2024-02-25',
                status: 'Paid',
                deductions: 1000,
                netPay: 44000,
            },
            {
                id: '5',
                employeeName: 'Michael Davis',
                employeeId: 'MD202',
                department: 'IT',
                designation: 'Software Engineer',
                salary: 55000,
                payDate: '2024-03-25',
                status: 'Pending',
                deductions: 300,
                netPay: 54700,
            },
        ];

        const timer = setTimeout(() => {
            setPayrolls(dummyData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // --- CRUD Operations ---
    const handleEdit = (payroll: Payroll) => {
        setSelectedPayroll(payroll);
        setEditFormData({
            employeeName: payroll.employeeName,
            employeeId: payroll.employeeId,
            department: payroll.department,
            designation: payroll.designation,
            salary: payroll.salary,
            payDate: payroll.payDate,
            status: payroll.status,
            deductions: payroll.deductions,
            netPay: payroll.netPay
        });
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selectedPayroll) return;

        const updatedPayroll: Payroll = {
            ...selectedPayroll,
            employeeName: editFormData.employeeName || selectedPayroll.employeeName,
            employeeId: editFormData.employeeId || selectedPayroll.employeeId,
            department: editFormData.department || selectedPayroll.department,
            designation: editFormData.designation || selectedPayroll.designation,
            salary: editFormData.salary || selectedPayroll.salary,
            payDate: editFormData.payDate || selectedPayroll.payDate,
            status: editFormData.status || selectedPayroll.status,
            deductions: editFormData.deductions || selectedPayroll.deductions,
            netPay: editFormData.netPay || selectedPayroll.netPay
        };

        setPayrolls(
            payrolls.map((p) => (p.id === updatedPayroll.id ? updatedPayroll : p))
        );
        setIsEditDialogOpen(false);
        setSelectedPayroll(null);
        setEditFormData({});
    };

    const handleDelete = (payroll: Payroll) => {
        setSelectedPayroll(payroll);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedPayroll) return;
        setPayrolls(payrolls.filter((p) => p.id !== selectedPayroll.id));
        setIsDeleteDialogOpen(false);
        setSelectedPayroll(null);
    };

    const handleCreate = () => {
        if (
            !createFormData.employeeName ||
            !createFormData.employeeId ||
            !createFormData.department ||
            !createFormData.designation ||
            !createFormData.salary ||
            !createFormData.payDate
        ) {
            alert('Please fill in all required fields.'); // Basic validation
            return;
        }

        const newPayroll: Payroll = {
            id: crypto.randomUUID(),
            employeeName: createFormData.employeeName,
            employeeId: createFormData.employeeId,
            department: createFormData.department,
            designation: createFormData.designation,
            salary: createFormData.salary,
            payDate: createFormData.payDate,
            status: 'Pending', // Default status
            deductions: createFormData.deductions || 0,
            netPay: (createFormData.salary || 0) - (createFormData.deductions || 0),
        };

        setPayrolls([...payrolls, newPayroll]);
        setIsCreateDialogOpen(false);
        setCreateFormData({ status: 'Pending' }); // Reset form
    };

    const payrollTableConfig: TableConfig<Payroll> = {
        headers: [
            { label: 'Employee Name', key: 'employeeName', isSortable: true },
            { label: 'Employee ID', key: 'employeeId', isSortable: true },
            { label: 'Department', key: 'department', isSortable: true },
            { label: 'Designation', key: 'designation', isSortable: true },
            {
                label: 'Salary', key: 'salary', isSortable: true, renderCell: (payroll) => (
                    <span>${payroll.salary.toFixed(2)}</span>
                )
            },
            {
                label: 'Pay Date', key: 'payDate', isSortable: true, renderCell: (payroll) => (
                    moment(new Date(payroll.payDate)).format('MMMM DD, YYYY')
                )
            },
            {
                label: 'Status', key: 'status', renderCell: (payroll) => (
                    <Badge
                        variant={getStatusBadgeVariant(payroll.status)}
                        className={twMerge(
                            payroll.status === 'Paid' && 'bg-green-100 text-green-800 border-green-300',
                            payroll.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                        )}
                    >
                        {payroll.status}
                    </Badge>
                )
            },
            {
                label: 'Deductions', key: 'deductions', isSortable: true, renderCell: (payroll) => (
                    <span>${payroll.deductions.toFixed(2)}</span>
                )
            },
            {
                label: 'Net Pay', key: 'netPay', isSortable: true, renderCell: (payroll) => (
                    <span>${payroll.netPay.toFixed(2)}</span>
                )
            },
        ],
        actions: {
            label: 'Actions',
            buttons: (payroll) => (
                <>
                    <Button
                        variant="link"
                        size="default"
                        onClick={() => handleEdit(payroll)}
                        className="text-blue-500 hover:bg-blue-50/50"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="link"
                        size="default"
                        onClick={() => handleDelete(payroll)}
                        className="text-red-500 hover:bg-red-50/50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </>
            ),
        },
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Coins className="w-6 h-6 text-green-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Payrolls</h1>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Generate Payroll
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    {/* Replace with your actual loading indicator */}
                    <p>Loading...</p>
                </div>
            ) : (
                <CustomTable
                    data={payrolls}
                    config={payrollTableConfig}
                    title="Payrolls"
                    description={`${payrolls.length} payrolls found`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Edit Payroll Dialog */}
            <AnimatePresence>
                {isEditDialogOpen && selectedPayroll && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Edit Payroll</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-employeeName" className="block text-sm font-medium text-gray-700">
                                        Employee Name
                                    </Label>
                                    <Input
                                        id="edit-employeeName"
                                        value={editFormData.employeeName || selectedPayroll.employeeName}
                                        onChange={(e) => setEditFormData({ ...editFormData, employeeName: e.target.value })}
                                        className="mt-1"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-employeeId" className="block text-sm font-medium text-gray-700">
                                        Employee ID
                                    </Label>
                                    <Input
                                        id="edit-employeeId"
                                        value={editFormData.employeeId || selectedPayroll.employeeId}
                                        onChange={(e) => setEditFormData({ ...editFormData, employeeId: e.target.value })}
                                        className="mt-1"
                                        disabled
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
                                            Department
                                        </Label>
                                        <Input
                                            id="edit-department"
                                            value={editFormData.department || selectedPayroll.department}
                                            onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-designation" className="block text-sm font-medium text-gray-700">
                                            Designation
                                        </Label>
                                        <Input
                                            id="edit-designation"
                                            value={editFormData.designation || selectedPayroll.designation}
                                            onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="edit-salary" className="block text-sm font-medium text-gray-700">
                                        Salary
                                    </Label>
                                    <Input
                                        id="edit-salary"
                                        type="number"
                                        value={editFormData.salary || selectedPayroll.salary}
                                        onChange={(e) => setEditFormData({ ...editFormData, salary: parseFloat(e.target.value) })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-payDate" className="block text-sm font-medium text-gray-700">
                                        Pay Date
                                    </Label>
                                    <Input
                                        id="edit-payDate"
                                        type="date"
                                        value={editFormData.payDate || selectedPayroll.payDate}
                                        onChange={(e) => setEditFormData({ ...editFormData, payDate: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </Label>
                                    <select
                                        id="edit-status"
                                        value={editFormData.status || selectedPayroll.status}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                status: e.target.value as Payroll['status'],
                                            })
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>Pending</option>
                                        <option>Paid</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-deductions" className="block text-sm font-medium text-gray-700">
                                        Deductions
                                    </Label>
                                    <Input
                                        id="edit-deductions"
                                        type="number"
                                        value={editFormData.deductions || selectedPayroll.deductions}
                                        onChange={(e) => setEditFormData({ ...editFormData, deductions: parseFloat(e.target.value) })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-netPay" className="block text-sm font-medium text-gray-700">
                                        Net Pay
                                    </Label>
                                    <Input
                                        id="edit-netPay"
                                        type="number"
                                        value={editFormData.netPay || selectedPayroll.netPay}
                                        onChange={(e) => setEditFormData({ ...editFormData, netPay: parseFloat(e.target.value) })}
                                        className="mt-1"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedPayroll(null);
                                        setEditFormData({});
                                    }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>Save</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {isDeleteDialogOpen && selectedPayroll && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Delete Payroll</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Are you sure you want to delete this payroll?
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button variant="link" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Payroll Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Generate Payroll</DialogTitle>
                        <DialogDescription>
                            Create a new payroll record.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-employeeName" className="text-right">
                                Employee Name
                            </Label>
                            <Input
                                id="create-employeeName"
                                value={createFormData.employeeName || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, employeeName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-employeeId" className="text-right">
                                Employee ID
                            </Label>
                            <Input
                                id="create-employeeId"
                                value={createFormData.employeeId || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, employeeId: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-department" className="text-right">
                                Department
                            </Label>
                            <Input
                                id="create-department"
                                value={createFormData.department || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, department: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-designation" className="text-right">
                                Designation
                            </Label>
                            <Input
                                id="create-designation"
                                value={createFormData.designation || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, designation: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-salary" className="text-right">
                                Salary
                            </Label>
                            <Input
                                id="create-salary"
                                type="number"
                                value={createFormData.salary || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, salary: parseFloat(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-payDate" className="text-right">
                                Pay Date
                            </Label>
                            <Input
                                id="create-payDate"
                                type="date"
                                value={createFormData.payDate || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, payDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-deductions" className="text-right">
                                Deductions
                            </Label>
                            <Input
                                id="create-deductions"
                                type="number"
                                value={createFormData.deductions || 0}
                                onChange={(e) => setCreateFormData({ ...createFormData, deductions: parseFloat(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PayrollsPage;

