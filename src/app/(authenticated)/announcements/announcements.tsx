'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/base/input';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/base/card';
import {
    Plus,
    Bell,
    Search,
    Calendar,
    Users,
    Briefcase,
    AlertCircle,
    Edit,
    Trash2,
    Zap,
    AlertTriangle,
    Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/base/dialog"
import { Textarea } from "@/components/ui/base/textarea"
import { Label } from "@/components/ui/base/label"
import moment from 'moment';

type AnnouncementType = 'Announcement' | 'Warning' | 'Important';

interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    department?: string;
    type: AnnouncementType;
}

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Announcement>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState<Partial<Announcement>>({
        type: 'Announcement', // default
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const dummyData: Announcement[] = [
            {
                id: '1',
                title: 'Company Holiday - New Year',
                content: 'All offices will be closed on January 1st for the New Year holiday.',
                date: '2023-12-20',
                author: 'HR Department',
                department: 'All',
                type: 'Announcement',
            },
            {
                id: '2',
                title: 'Q4 Performance Review',
                content: 'Quarterly performance reviews will be held in the last week of December.',
                date: '2023-12-01',
                author: 'Management',
                department: 'All',
                type: 'Announcement',
            },
            {
                id: '3',
                title: 'New Health Insurance Plan',
                content: 'Details about the new health insurance plan are now available on the company website.',
                date: '2023-11-15',
                author: 'HR Department',
                department: 'All',
                type: 'Announcement',
            },
            {
                id: '4',
                title: 'Office Renovation',
                content: 'The second floor will be closed for renovation from January 5th to January 12th.',
                date: '2024-01-03',
                author: 'Facilities Management',
                department: 'All',
                type: 'Warning',
            },
            {
                id: '5',
                title: 'Mandatory Training Session',
                content: 'Mandatory training session for all employees on January 20th.',
                date: '2024-01-10',
                author: 'Training Department',
                department: 'All',
                type: 'Important',
            },
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
            department: announcement.department,
            type: announcement.type,
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
            department: editFormData.department || selectedAnnouncement.department,
            type: editFormData.type || selectedAnnouncement.type,
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
            department: createFormData.department,
            type: createFormData.type,
        };

        setAnnouncements([...announcements, newAnnouncement]);
        setIsCreateDialogOpen(false);
        setCreateFormData({ type: 'Announcement' }); // Reset form
    };

    const getAnnouncementIcon = (type: AnnouncementType) => {
        switch (type) {
            case 'Warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />;
            case 'Important':
                return <Zap className="w-5 h-5 text-red-500 mr-2" />;
            default:
                return <Info className="w-5 h-5 text-blue-500 mr-2" />;
        }
    };

    const filteredAnnouncements = announcements.filter(announcement =>
        Object.values(announcement).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
            <div className="p-4">
                <Input
                    type="text"
                    placeholder="Search Announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-300 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    {/* Replace with your actual loading indicator */}
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredAnnouncements.map((announcement) => (
                            <motion.div
                                key={announcement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                                    <CardHeader>
                                        <div className="flex items-center">
                                            {getAnnouncementIcon(announcement.type)}
                                            <CardTitle className="text-lg font-semibold">{announcement.title}</CardTitle>
                                        </div>
                                        <CardDescription className="text-sm text-gray-500">
                                            {moment(new Date(announcement.date)).format('MMMM DD, YYYY')}
                                            <span className="ml-2">by {announcement.author}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 leading-relaxed">
                                            {announcement.content}
                                        </p>
                                        {announcement.department && (
                                            <div className="mt-4">
                                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                    {announcement.department}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="link"
                                                size="icon"
                                                onClick={() => handleEdit(announcement)}
                                                className="text-blue-500 hover:bg-blue-50/50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="link"
                                                size="icon"
                                                onClick={() => handleDelete(announcement)}
                                                className="text-red-500 hover:bg-red-50/50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredAnnouncements.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            No announcements found.
                        </div>
                    )}
                </div>
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
                                        disabled
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
                                    <Label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">
                                        Type
                                    </Label>
                                    <select
                                        id="edit-type"
                                        value={editFormData.type || selectedAnnouncement.type}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                type: e.target.value as AnnouncementType,
                                            })
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>Announcement</option>
                                        <option>Warning</option>
                                        <option>Important</option>
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
                                <Button variant="link" onClick={confirmDelete}>
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
                            Post a new announcement.
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
                                disabled
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
                            <Label htmlFor="create-type" className="text-right">
                                Type
                            </Label>
                            <select
                                id="create-type"
                                value={createFormData.type || 'Announcement'}
                                onChange={(e) =>
                                    setCreateFormData({
                                        ...createFormData,
                                        type: e.target.value as AnnouncementType,
                                    })
                                }
                                className="col-span-3 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option>Announcement</option>
                                <option>Warning</option>
                                <option>Important</option>
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

