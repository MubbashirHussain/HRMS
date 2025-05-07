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
    Bell,
    Search,
    Calendar,
    Users,
    Briefcase,
    AlertCircle,
    Edit,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/base/dialog"
import { Textarea } from "@/components/ui/base/textarea"
import { Label } from "@/components/ui/base/label"
import moment from 'moment';

interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    department?: string;
    type: 'General' | 'Event' | 'Holiday' | 'Update';
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

const getAnnouncementBadgeVariant = (type: Announcement['type']) => {
    switch (type) {
        case 'General':
            return 'default';
        case 'Event':
            return 'primary';
        case 'Holiday':
            return 'destructive';
        case 'Update':
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

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Announcement>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState<Partial<Announcement>>({
        type: 'General', // Set a default value
    });

    useEffect(() => {
        const dummyData: Announcement[] = [
            {
                id: '1',
                title: 'Welcome New Employees',
                content: 'A warm welcome to all our new team members! We are excited to have you join us.',
                date: '2024-01-20',
                author: 'HR Department',
                type: 'General',
            },
            {
                id: '2',
                title: 'Office Holiday - Christmas',
                content: 'All offices will be closed on December 25th for Christmas Day.',
                date: '2023-12-20',
                author: 'Management',
                type: 'Holiday',
            },
            {
                id: '3',
                title: 'Upcoming Company Event',
                content: 'Join us for our annual company picnic on July 15th at Central Park.',
                date: '2024-07-01',
                author: 'Event Team',
                type: 'Event',
            },
            {
                id: '4',
                title: 'System Maintenance',
                content: 'The company network will be down for maintenance on Saturday, June 10th, from 8 AM to 12 PM.',
                date: '2024-06-08',
                author: 'IT Department',
                type: 'Update',
            },
            {
                id: '5',
                title: 'New Health Benefits',
                content: 'We are pleased to announce enhanced health benefits starting January 1st, 2024.  See HR for details.',
                date: '2023-12-15',
                author: 'HR Department',
                type: 'General'
            }
        ];

        const timer = setTimeout(() => {
            setAnnouncements(dummyData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // --- CRUD Operations ---
    const handleEdit = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setEditFormData({
            title: announcement.title,
            content: announcement.content,
            date: announcement.date,
            author: announcement.author,
            type: announcement.type,
            department: announcement.department
        });
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
        if (!selectedAnnouncement) return;

        const updatedAnnouncement: Announcement = {
            ...selectedAnnouncement,
            title: editFormData.title || selectedAnnouncement.title,
            content: editFormData.content || selectedAnnouncement.content,
            date: editFormData.date || selectedAnnouncement.date,
            author: editFormData.author || selectedAnnouncement.author,
            type: editFormData.type || selectedAnnouncement.type,
            department: editFormData.department || selectedAnnouncement.department
        };

        setAnnouncements(
            announcements.map((a) => (a.id === updatedAnnouncement.id ? updatedAnnouncement : a))
        );
        setIsEditDialogOpen(false);
        setSelectedAnnouncement(null);
        setEditFormData({});
    };

    const handleDelete = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedAnnouncement) return;
        setAnnouncements(announcements.filter((a) => a.id !== selectedAnnouncement.id));
        setIsDeleteDialogOpen(false);
        setSelectedAnnouncement(null);
    };

    const handleCreate = () => {
        if (
            !createFormData.title ||
            !createFormData.content ||
            !createFormData.date ||
            !createFormData.author ||
            !createFormData.type
        ) {
            alert('Please fill in all required fields.'); // Basic validation
            return;
        }

        const newAnnouncement: Announcement = {
            id: crypto.randomUUID(),
            title: createFormData.title,
            content: createFormData.content,
            date: createFormData.date,
            author: createFormData.author,
            type: createFormData.type,
            department: createFormData.department,
        };

        setAnnouncements([...announcements, newAnnouncement]);
        setIsCreateDialogOpen(false);
        setCreateFormData({ type: 'General' }); // Reset form
    };

    const announcementTableConfig: TableConfig<Announcement> = {
        headers: [
            { label: 'Title', key: 'title', isSortable: true },
            { label: 'Content', key: 'content', isSortable: false },
            {
                label: 'Date', key: 'date', isSortable: true, renderCell: (announcement) => (
                    moment(new Date(announcement.date)).format('MMMM DD, YYYY')
                )
            },
            { label: 'Author', key: 'author', isSortable: true },
            { label: 'Department', key: 'department', isSortable: true },
            {
                label: 'Type', key: 'type', renderCell: (announcement) => (
                    <Badge variant={getAnnouncementBadgeVariant(announcement.type)}>
                        {announcement.type}
                    </Badge>
                )
            },
        ],
        actions: {
            label: 'Actions',
            buttons: (announcement) => (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(announcement)}
                        className="text-blue-500 hover:bg-blue-50/50"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(announcement)}
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
                    <Bell className="w-6 h-6 text-orange-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Announcement
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    {/* Replace with your actual loading indicator */}
                    <p>Loading...</p>
                </div>
            ) : (
                <CustomTable
                    data={announcements}
                    config={announcementTableConfig}
                    title="Announcements"
                    description={`${announcements.length} announcements found`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Edit Announcement Dialog */}
            <AnimatePresence>
                {isEditDialogOpen && selectedAnnouncement && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Edit Announcement</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                                        Title
                                    </Label>
                                    <Input
                                        id="edit-title"
                                        value={editFormData.title || selectedAnnouncement.title}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-content" className="block text-sm font-medium text-gray-700">
                                        Content
                                    </Label>
                                    <Textarea
                                        id="edit-content"
                                        value={editFormData.content || selectedAnnouncement.content}
                                        onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </Label>
                                    <Input
                                        id="edit-date"
                                        type="date"
                                        value={editFormData.date || selectedAnnouncement.date}
                                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-author" className="block text-sm font-medium text-gray-700">
                                        Author
                                    </Label>
                                    <Input
                                        id="edit-author"
                                        value={editFormData.author || selectedAnnouncement.author}
                                        onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
                                        Department
                                    </Label>
                                    <Input
                                        id="edit-department"
                                        value={editFormData.department || selectedAnnouncement.department}
                                        onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">
                                        Type
                                    </Label>
                                    <select
                                        id="edit-type"
                                        value={editFormData.type || selectedAnnouncement.type}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                type: e.target.value as Announcement['type'],
                                            })
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>General</option>
                                        <option>Event</option>
                                        <option>Holiday</option>
                                        <option>Update</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedAnnouncement(null);
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
                {isDeleteDialogOpen && selectedAnnouncement && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">Delete Announcement</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Are you sure you want to delete this announcement?
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

            {/* Create Announcement Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                        <DialogDescription>
                            Create a new announcement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="create-title"
                                value={createFormData.title || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="create-content" className="text-right mt-2">
                                Content
                            </Label>
                            <Textarea
                                id="create-content"
                                value={createFormData.content || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, content: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-date" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="create-date"
                                type="date"
                                value={createFormData.date || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, date: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="create-author" className="text-right">
                                Author
                            </Label>
                            <Input
                                id="create-author"
                                value={createFormData.author || ''}
                                onChange={(e) => setCreateFormData({ ...createFormData, author: e.target.value })}
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
                            <Label htmlFor="create-type" className="text-right">
                                Type
                            </Label>
                            <select
                                id="create-type"
                                value={createFormData.type || 'General'}
                                onChange={(e) =>
                                    setCreateFormData({
                                        ...createFormData,
                                        type: e.target.value as Announcement['type'],
                                    })
                                }
                                className="col-span-3 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option>General</option>
                                <option>Event</option>
                                <option>Holiday</option>
                                <option>Update</option>
                            </select>
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

export default AnnouncementsPage;
