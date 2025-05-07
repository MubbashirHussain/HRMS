'use client'
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
} from '@/components/ui/base/table'; // Corrected import path
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
    Edit,
    Trash2,
    Search,
    Users,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
 // Utility for combining class names

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    joiningDate: string;
    status: 'Active' | 'Inactive' | 'Pending';
}

interface TableConfig<T> {
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

const getStatusBadgeVariant = (status: Employee['status']) => {
    switch (status) {
        case 'Active':
            return 'default';
        case 'Inactive':
            return 'destructive';
        case 'Pending':
            return 'secondary';
        default:
            return 'outline';
    }
};

// Reusable CustomTable Component
const CustomTable = <T,>({
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
                                <TableHead key={header.key}>
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
                                        <TableCell key={header.key}>
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

const EmployeesPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Employee>>({});

    // Dummy employee data for initial setup and testing
    useEffect(() => {
        const dummyData: Employee[] = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                department: 'Engineering',
                joiningDate: '2022-01-15',
                status: 'Active',
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                department: 'Marketing',
                joiningDate: '2021-11-01',
                status: 'Active',
            },
            {
                id: '3',
                name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                department: 'Sales',
                joiningDate: '2023-03-20',
                status: 'Pending',
            },
            {
                id: '4',
                name: 'Alice Brown',
                email: 'alice.brown@example.com',
                department: 'HR',
                joiningDate: '2022-08-01',
                status: 'Inactive',
            },
            {
                id: '5',
                name: 'Michael Davis',
                email: 'michael.davis@example.com',
                department: 'Engineering',
                joiningDate: '2023-05-10',
                status: 'Active',
            },
        ];

        // Simulate API call delay
        const timer = setTimeout(() => {
            setEmployees(dummyData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);



    // --- CRUD Operations ---
    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditFormData({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            joiningDate: employee.joiningDate,
            status: employee.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selectedEmployee) return;

        const updatedEmployee: Employee = {
            ...selectedEmployee,
            name: editFormData.name || selectedEmployee.name,
            email: editFormData.email || selectedEmployee.email,
            department: editFormData.department || selectedEmployee.department,
            joiningDate: editFormData.joiningDate || selectedEmployee.joiningDate,
            status: editFormData.status || selectedEmployee.status,
        };

        setEmployees(
            employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
        setIsEditDialogOpen(false);
        setSelectedEmployee(null);
        setEditFormData({});
    };

    const handleDelete = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedEmployee) return;
        setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
        setIsDeleteDialogOpen(false);
        setSelectedEmployee(null);
    };



    const employeeTableConfig: TableConfig<Employee> = {
        headers: [
            { label: 'Name', key: 'name', isSortable: true },
            { label: 'Email', key: 'email', isSortable: true },
            { label: 'Department', key: 'department', isSortable: true },
            { label: 'Joining Date', key: 'joiningDate', isSortable: true },
            {
                label: 'Status', key: 'status', renderCell: (employee) => (
                    <Badge
                        variant={getStatusBadgeVariant(employee.status)}
                        className={twMerge(
                            employee.status === 'Active' && 'bg-green-100 text-green-800 border-green-300',
                            employee.status === 'Inactive' && 'bg-red-100 text-red-800 border-red-300',
                            employee.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                        )}
                    >
                        {employee.status}
                    </Badge>
                )
            },
        ],
        actions: {
            label: 'Actions',
            buttons: (employee) => (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(employee)}
                        className="text-blue-500 hover:bg-blue-50/50"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(employee)}
                        className="text-red-500 hover:bg-red-50/50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </>
            )
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Users className="w-6 h-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            {/* Employee Table */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            ) : (
                <CustomTable
                    data={employees}
                    config={employeeTableConfig}
                    title="Employee List"
                    description={`${employees.length} employees found`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Edit Employee Dialog */}
            <AnimatePresence>
                {isEditDialogOpen && selectedEmployee && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Edit Employee</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <Input
                                        id="edit-name"
                                        value={editFormData.name || selectedEmployee.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editFormData.email || selectedEmployee.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
                                        Department
                                    </label>
                                    <Input
                                        id="edit-department"
                                        value={editFormData.department || selectedEmployee.department}
                                        onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-joining-date" className="block text-sm font-medium text-gray-700">
                                        Joining Date
                                    </label>
                                    <Input
                                        id="edit-joining-date"
                                        type="date"
                                        value={editFormData.joiningDate || selectedEmployee.joiningDate}
                                        onChange={(e) => setEditFormData({ ...editFormData, joiningDate: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="edit-status"
                                        value={editFormData.status || selectedEmployee.status}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                status: e.target.value as Employee['status'],
                                            })
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedEmployee(null);
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
                {isDeleteDialogOpen && selectedEmployee && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Delete Employee</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Are you sure you want to delete {selectedEmployee.name}?
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
                                <Button variant="destructive" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeesPage;
