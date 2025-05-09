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
    Settings,
    User,
    LogOut,
    Shield,
    KeyRound,
    Languages,
    HelpCircle,
    Bell
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/base/dialog"
import { Textarea } from "@/components/ui/base/textarea"
import { Label } from "@/components/ui/base/label"
import { Switch } from "@/components/ui/base/switch"

interface SettingOption {
    id: string;
    title: string;
    description: string;
    category: string;
    content: React.ReactNode;
}

const SettingsPage = () => {
    const [settings, setSettings] = useState<SettingOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
    const [profileEditMode, setProfileEditMode] = useState(false);
    const [profileFormData, setProfileFormData] =  useState<{ name: string; email: string }>({ name: '', email: '' });
    const [activeTab, setActiveTab] = useState('Account');

    useEffect(() => {
        const dummyData: SettingOption[] = [
            {
                id: '1',
                title: 'Profile',
                description: 'Update your profile information.',
                category: 'Account',
                content: (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">Profile Information</span>
                        </div>
                        {profileEditMode ? (
                            <>
                                <div>
                                    <Label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={profileFormData.name}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={profileFormData.email}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                                        className="mt-1"
                                        disabled
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <Button variant="outline" onClick={() => setProfileEditMode(false)}>Cancel</Button>
                                    <Button onClick={() => {
                                        // Save logic here
                                        setProfileEditMode(false);
                                    }}>Save</Button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-gray-700">Name: John Doe</p>
                                <p className="text-gray-700">Email: john.doe@example.com</p>
                                <Button onClick={() => {
                                    setProfileEditMode(true);
                                    setProfileFormData({ name: 'John Doe', email: 'john.doe@example.com' });
                                }} className="mt-4">Edit Profile</Button>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                id: '2',
                title: 'Account Security',
                description: 'Manage your account security settings.',
                category: 'Account',
                content: (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Shield className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">Account Security</span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsResetPasswordDialogOpen(true)}
                        >
                            <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                        </Button>
                    </div>
                ),
            },
            {
                id: '3',
                title: 'Notifications',
                description: 'Configure your notification preferences.',
                category: 'Preferences',
                content: (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">Notification Preferences</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Email Notifications</span>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Push Notifications</span>
                            <Switch />
                        </div>
                    </div>
                ),
            },
            {
                id: '4',
                title: 'Language',
                description: 'Set your preferred language.',
                category: 'Preferences',
                content: (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Languages className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">Language</span>
                        </div>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>English</option>
                            <option>Español</option>
                            <option>Français</option>
                        </select>
                    </div>
                ),
            },
            {
                id: '5',
                title: 'Help & Support',
                description: 'Get help and support.',
                category: 'Support',
                content: (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <HelpCircle className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">Help and Support</span>
                        </div>
                        <p className="text-gray-700">
                            Contact our support team at support@example.com or visit our
                            <a href="#" className="text-blue-500 hover:underline">
                                Help Center
                            </a>
                            .
                        </p>
                    </div>
                )
            }
        ]

        const timer = setTimeout(() => {
            setSettings(dummyData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [profileEditMode, profileFormData]);

    const handleLogout = () => {
        // Implement your logout logic here (e.g., clear session, redirect)
        console.log('Logging out...');
        setIsLogoutDialogOpen(false); // Close the dialog
    };

    const handleResetPassword = () => {
        // Implement password reset logic (e.g., send reset link)
        console.log('Resetting password...');
        setIsResetPasswordDialogOpen(false);
    };

    const categories = ['Account', 'Preferences', 'Support'];

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Settings className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    {/* Replace with your actual loading indicator */}
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant='ghost'
                                onClick={() => setActiveTab(category)}
                                className="px-6 py-3 text-sm font-medium rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    {settings
                        .filter((setting) => setting.category === activeTab)
                        .map((setting) => (
                            <Card key={setting.id} className="w-full shadow-md border-0">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{setting.title}</CardTitle>
                                    <CardDescription className="text-gray-500 dark:text-gray-400">{setting.description}</CardDescription>
                                </CardHeader>
                                <CardContent>{setting.content}</CardContent>
                            </Card>
                        ))}
                </div>
            )}

            {/* Logout Confirmation Dialog */}
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-4">
                            <LogOut className="w-5 h-5 text-red-500" />
                            <p className="text-gray-700">
                                You will be logged out of your account.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsLogoutDialogOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button variant="link" onClick={handleLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Do you want to reset your password? A reset link will be sent to your email address.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-4">
                            <KeyRound className="w-5 h-5 text-blue-500" />
                            <p className="text-gray-700">
                                A password reset link will be sent to your email.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsResetPasswordDialogOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleResetPassword}>
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SettingsPage;

