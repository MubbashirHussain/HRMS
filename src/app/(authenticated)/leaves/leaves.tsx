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
    Edit,
    Trash2,
    Search,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/base/dialog"
import { Textarea } from "@/components/ui/base/textarea"
import { Label } from "@/components/ui/base/label"
import moment from 'moment';

interface LeaveRequest {
    id: string;
    employeeName: string;
    startDate: string;
    endDate: string;
    type: 'Annual' | 'Sick' | 'Casual' | 'Other';
    status: 'Pending' | 'Approved' | 'Rejected';
    reason: string;
    notes?: string;
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

const getStatusBadgeVariant = (status: LeaveRequest['status']) => {
    switch (status) {
        case 'Approved':
            return 'default';
        case 'Rejected':
            return 'destructive';
        case 'Pending':
            return 'secondary';
        default:
            return 'outline';
    }
};

const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
        case 'Approved':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Rejected':
            return <XCircle className="h-4 w-4 text-red-500" />;
        case 'Pending':
            return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
        default:
            return null;
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
            if (typeof cellValue === 'string') {
                return cellValue.toLowerCase().includes(searchTerm.toLowerCase());
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

const LeavesPage = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<LeaveRequest>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState<Partial<LeaveRequest>>({
        type: 'Annual', // Set a default value
        status: 'Pending',
    });


    useEffect(() => {
        const dummyData: LeaveRequest[] = [
            {
                id: '1',
                employeeName: 'John Doe',
                startDate: '2024-01-15',
                endDate: '2024-01-22',
                type: 'Annual',
                status: 'Approved',
                reason: 'Annual leave for vacation.',
            },
            {
                id: '2',
                employeeName: 'Jane Smith',
                startDate: '2024-02-05',
                endDate: '2024-02-07',
                type: 'Sick',
                status: 'Pending',
                reason: 'Sick leave due to illness.',
            },
            {
                id: '3',
                employeeName: 'Bob Johnson',
                startDate: '2024-03-10',
                endDate: '2024-03-12',
                type: 'Casual',
                status: 'Rejected',
                reason: 'Casual leave for personal reasons.',
            },
            {
                id: '4',
                employeeName: 'Alice Brown',
                startDate: '2024-04-01',
                endDate: '2024-04-10',
                type: 'Annual',
                status: 'Approved',
                reason: 'Annual leave for family trip',
                notes: 'Please approve this leave.',
            },
            {
                id: '5',
                employeeName: 'Michael Davis',
                startDate: '2024-05-15',
                endDate: '2024-05-15',
                type: 'Sick',
                status: 'Pending',
                reason: 'Sudden illness',
            },
        ];

        const timer = setTimeout(() => {
            setLeaveRequests(dummyData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // --- CRUD Operations ---
    const handleEdit = (request: LeaveRequest) => {
        setSelectedRequest(request);
        setEditFormData({
            employeeName: request.employeeName,
            startDate: request.startDate,
            endDate: request.endDate,
            type: request.type,
            status: request.status,
            reason: request.reason,
            notes: request.notes
        });
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selectedRequest) return;

        const updatedRequest: LeaveRequest = {
            ...selectedRequest,
            employeeName: editFormData.employeeName || selectedRequest.employeeName,
            startDate: editFormData.startDate || selectedRequest.startDate,
            endDate: editFormData.endDate || selectedRequest.endDate,
            type: editFormData.type || selectedRequest.type,
            status: editFormData.status || selectedRequest.status,
            reason: editFormData.reason || selectedRequest.reason,
            notes: editFormData.notes || selectedRequest.notes,
        };

        setLeaveRequests(
            leaveRequests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
        );
        setIsEditDialogOpen(false);
        setSelectedRequest(null);
        setEditFormData({});
    };

    const handleDelete = (request: LeaveRequest) => {
        setSelectedRequest(request);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedRequest) return;
        setLeaveRequests(leaveRequests.filter((req) => req.id !== selectedRequest.id));
        setIsDeleteDialogOpen(false);
        setSelectedRequest(null);
    };

    const handleCreate = () => {
        if (
            !createFormData.employeeName ||
            !createFormData.startDate ||
            !createFormData.endDate ||
            !createFormData.type ||
            !createFormData.reason
        ) {
            alert('Please fill in all required fields.'); // Basic validation
            return;
        }

        const newRequest: LeaveRequest = {
            id: crypto.randomUUID(),
            employeeName: createFormData.employeeName,
            startDate: createFormData.startDate,
            endDate: createFormData.endDate,
            type: createFormData.type,
            status: 'Pending', // Default status
            reason: createFormData.reason,
            notes: createFormData.notes,
        };

        setLeaveRequests([...leaveRequests, newRequest]);
        setIsCreateDialogOpen(false);
        setCreateFormData({ type: 'Annual', status: 'Pending' }); // Reset form
    };

    const leaveTableConfig: TableConfig<LeaveRequest> = {
        headers: [
            { label: 'Employee', key: 'employeeName', isSortable: true },
            {
                label: 'Start Date', key: 'startDate', isSortable: true, renderCell: (request) => {
                    const formattedDate = moment(new Date(request.startDate)).format('PPP');
                    return <span>{formattedDate}</span>;
                }
            },
            {
                label: 'End Date', key: 'endDate', isSortable: true, renderCell: (request) => {
                    const formattedDate = moment(new Date(request.endDate)).format('PPP');
                    return <span>{formattedDate}</span>;
                }
            },
            { label: 'Type', key: 'type', isSortable: true },
            {
                label: 'Status', key: 'status', renderCell: (request) => (
                    <div className='flex items-center gap-2'>
                        {getStatusIcon(request.status)}
                        <Badge
                            variant={getStatusBadgeVariant(request.status)}
                            className={twMerge(
                                request.status === 'Approved' && 'bg-green-100 text-green-800 border-green-300',
                                request.status === 'Rejected' && 'bg-red-100 text-red-800 border-red-300',
                                request.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                            )}
                        >
                            {request.status}
                        </Badge>
                    </div>

                )
            },
            { label: 'Reason', key: 'reason', isSortable: false },
        ],
        actions: {
            label: 'Actions',
            buttons: (request) => (
                <>
                    <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleEdit(request)}
                        className="text-blue-500 hover:bg-blue-50/50"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(request)}
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
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Request Leave
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    {/* Replace with your actual loading indicator */}
                    <p>Loading...</p>
                </div>
            ) : (
                <CustomTable
                    data={leaveRequests}
                    config={leaveTableConfig}
                    title="Leave Requests"
                    description={`${leaveRequests.length} leave requests found`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Edit Leave Request Dialog */}
            <AnimatePresence>
                {isEditDialogOpen && selectedRequest && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Edit Leave Request</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-employeeName" className="block text-sm font-medium text-gray-700">
                                        Employee Name
                                    </Label>
                                    <Input
                                        id="edit-employeeName"
                                        value={editFormData.employeeName || selectedRequest.employeeName}
                                        onChange={(e) => setEditFormData({ ...editFormData, employeeName: e.target.value })}
                                        className="mt-1"
                                        disabled
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-startDate" className="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </Label>
                                        <Input
                                            id="edit-startDate"
                                            type="date"
                                            value={editFormData.startDate || selectedRequest.startDate}
                                            onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-endDate" className="block text-sm font-medium text-gray-700">
                                            End Date
                                        </Label>
                                        <Input
                                            id="edit-endDate"
                                            type="date"
                                            value={editFormData.endDate || selectedRequest.endDate}
                                            onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">
                                        Type
                                    </Label>
                                    <select
                                        id="edit-type"
                                        value={editFormData.type || selectedRequest.type}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                type: e.target.value as LeaveRequest['type'],
                                            })
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>Annual</option>
                                        <option>Sick</option>
                                        <option>Casual</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </Label>
                                    <select
                                        id="edit-status"
                                        value={editFormData.status || selectedRequest.status}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                status: e.target.value as LeaveRequest['status'],
                                            })
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>Pending</option>
                                        <option>Approved</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-reason" className="block text-sm font-medium text-gray-700">
                                        Reason
                                    </Label>
                                    <Textarea
                                        id="edit-reason"
                                        value={editFormData.reason || selectedRequest.reason}
                                        onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="edit-notes"
                                        value={editFormData.notes || selectedRequest.notes}
                                        onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedRequest(null);
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
                {isDeleteDialogOpen && selectedRequest && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Delete Leave Request</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Are you sure you want to delete this leave request?
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

            {/* Create Leave Request Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Request Leave</DialogTitle>
                        <DialogDescription>
                            Create a new leave request.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Employee Name
                            </Label>
                            <Input
                                id="name"
                                value={createFormData.employeeName || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, employeeName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={createFormData.startDate || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, startDate: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                                End Date
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={createFormData.endDate || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, endDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <select
                                id="type"
                                value={createFormData.type || 'Annual'}
                                onChange={(e) =>
                                    setCreateFormData({
                                        ...createFormData,
                                        type: e.target.value as LeaveRequest['type'],
                                    })
                                }
                                className="col-span-3 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option>Annual</option>
                                <option>Sick</option>
                                <option>Casual</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">
                                Reason
                            </Label>
                            <Textarea
                                id="reason"
                                value={createFormData.reason || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, reason: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={createFormData.notes || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, notes: e.target.value })}
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

export default LeavesPage;

