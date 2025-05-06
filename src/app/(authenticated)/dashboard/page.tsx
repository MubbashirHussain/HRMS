'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/base/card';
import { Badge } from '@/components/ui/base/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/base/alert';
import { AlertCircle, Users, Briefcase, CheckCircle, Clock, XCircle, List, BarChart, PieChart, Calendar } from 'lucide-react'; // Added icons
import { twMerge } from 'tailwind-merge';
import { ScrollArea } from '@/components/ui/base/scroll-area';
import { Button } from "@/components/ui/base/button"
import { Separator } from "@/components/ui/base/separator"
import moment from 'moment';
import Heading from '@/components/ui/base/heading';
import Paragraph from '@/components/ui/base/paragraph';

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'error';
    createdAt: Date;
}

interface Stat {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string; // Tailwind color class (e.g., 'text-blue-500')
    description?: string;
}

interface Employee {
    id: string;
    name: string;
    department: string;
    hireDate: Date;
}

interface Task {
    id: string;
    title: string;
    dueDate: Date;
    status: 'pending' | 'in progress' | 'completed';
}

// ===============================
// Dummy Data
// ===============================

const generateRandomEmployees = (count: number): Employee[] => {
    const departments = ['HR', 'Engineering', 'Marketing', 'Sales', 'Finance'];
    const employees: Employee[] = [];
    for (let i = 0; i < count; i++) {
        employees.push({
            id: `emp-${i}`,
            name: `Employee ${i + 1}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            hireDate: new Date(Date.now() - Math.random() * 31536000000), // Random date within a year
        });
    }
    return employees;
};

const generateTasks = (count: number): Task[] => {
    const statuses: ('pending' | 'in progress' | 'completed')[] = ['pending', 'in progress', 'completed'];
    const tasks: Task[] = [];
    for (let i = 0; i < count; i++) {
        tasks.push({
            id: `task-${i}`,
            title: `Task ${i + 1}`,
            dueDate: new Date(Date.now() + Math.random() * 2592000000),  // Random date within 30 days
            status: statuses[Math.floor(Math.random() * statuses.length)],
        });
    }
    return tasks;
};

const dummyAnnouncements: Announcement[] = [
    {
        id: '1',
        title: 'Welcome to Zenith HR',
        content: 'We are excited to launch our new HR management system. Please explore the new features!',
        type: 'info',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
        id: '2',
        title: 'Office Closure',
        content: 'The office will be closed on July 4th for Independence Day.',
        type: 'warning',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
    },
    {
        id: '3',
        title: 'New Health Insurance Policy',
        content: 'Please review the updated health insurance policy documents.',
        type: 'info',
        createdAt: new Date(),
    },
    {
        id: '4',
        title: 'Performance Reviews',
        content: 'Performance review cycle begins next week.  Please schedule your meetings.',
        type: 'warning',
        createdAt: new Date(),
    },
    {
        id: '5',
        title: 'Employee of the Month',
        content: 'Congratulations to Sarah Johnson for being awarded Employee of the Month!',
        type: 'info',
        createdAt: new Date(),
    },
];

const dummyStats: Stat[] = [
    {
        title: 'Total Employees',
        value: 125,
        icon: <Users className="w-5 h-5 text-blue-500" />,
        color: 'text-blue-500',
        description: 'Total number of active employees',
    },
    {
        title: 'Departments',
        value: 10,
        icon: <Briefcase className="w-5 h-5 text-green-500" />,
        color: 'text-green-500',
        description: 'Number of departments in the company',
    },
    {
        title: 'Pending Applications',
        value: 7,
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
        color: 'text-yellow-500',
        description: 'Number of pending leave or other applications',
    },
    {
        title: 'Avg. Employee Age',
        value: '32 years', // Made value a string
        icon: <Calendar className="w-5 h-5 text-purple-500" />,
        color: 'text-purple-500',
        description: 'Average age of all employees',
    },
    {
        title: 'Revenue (YTD)',
        value: '$2.5M',  // Made value a string
        icon: <BarChart className="w-5 h-5 text-emerald-500" />,
        color: 'text-emerald-500',
        description: 'Year-to-date revenue',
    },
    {
        title: 'Employee Satisfaction',
        value: '85%', // Made value a string
        icon: <PieChart className="w-5 h-5 text-orange-500" />,
        color: 'text-orange-500',
        description: 'Average employee satisfaction rating',
    },
];

// ===============================
// Components
// ===============================

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    const getAlertType = (): { variant: 'default' | 'destructive' | 'warning', icon: React.ReactNode } => {
            switch (announcement.type) {
                case 'info':
                    return { variant: 'default', icon: null };
                case 'warning':
                    return { variant: 'warning', icon: <AlertCircle className="h-4 w-4 text-yellow-400" /> };
                case 'error':
                    return { variant: 'destructive', icon: <AlertCircle className="h-4 w-4 text-red-500" /> };
                default:
                    return { variant: 'default', icon: null };
            }
        };

    const alertType = getAlertType();
    const timeAgo = getTimeAgo(announcement.createdAt);

    return (
        <Alert
            variant={alertType.variant as any}
            className={twMerge(
                "mb-4 bg-white/80 backdrop-blur-md border rounded-lg",
                alertType.variant === 'destructive'
                    ? 'border-red-300 text-red-800'
                    : alertType.variant === 'warning'
                        ? 'border-yellow-300 text-yellow-800'
                        : 'border-blue-200 text-blue-800'
            )}
        >
            {alertType.icon}
            <AlertTitle className={twMerge(
                alertType.variant === 'destructive' ? 'text-red-700' :
                    alertType.variant === 'warning' ? 'text-yellow-700' : 'text-blue-700'
            )}>
                {announcement.title}
            </AlertTitle>
            <AlertDescription className="text-gray-600">
                {announcement.content}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {timeAgo}
                </p>
            </AlertDescription>
        </Alert>
    );
};

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => (
    <Card
        className={twMerge(
            "shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 rounded-lg",
            "bg-white/80 backdrop-blur-md border border-blue-200/50"
        )}
    >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
                {stat.title}
            </CardTitle>
            <div className={twMerge(stat.color, "text-3xl")}>
                {stat.icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className={twMerge("text-2xl font-bold", stat.color)}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            {stat.description && (
                <CardDescription className="text-sm text-gray-500 mt-1">
                    {stat.description}
                </CardDescription>
            )}
        </CardContent>
    </Card>
);

const EmployeeCard: React.FC<{ employee: Employee }> = ({ employee }) => (
    <Card className="bg-white/80 backdrop-blur-md border border-blue-200/50 shadow-md rounded-lg transition-all duration-200 hover:shadow-lg">
        <CardHeader>
            <CardTitle className="text-blue-700">{employee.name}</CardTitle>
            <CardDescription className="text-gray-500">
                {employee.department}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-600">
                Hire Date: {moment(employee.hireDate).format('PPP')}
            </p>
        </CardContent>
    </Card>
);

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const getStatusStyles = () => {
        switch (task.status) {
            case 'pending':
                return 'bg-red-100 text-red-500';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-500';
            case 'completed':
                return 'bg-green-100 text-green-500';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    }

    return (
        <Card className="bg-white/80 backdrop-blur-md border border-blue-200/50 shadow-md rounded-lg transition-all duration-200 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="text-blue-700">{task.title}</CardTitle>
                <CardDescription className="text-gray-500">
                    Due: {moment(task.dueDate).format('PPP')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Badge className={twMerge("px-2 py-1 rounded-full text-xs font-semibold", getStatusStyles())}>
                    {task.status}
                </Badge>
            </CardContent>
        </Card>
    );
};

// ===============================
// Helper Functions
// ===============================

const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor(Math.abs(now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 2592000) {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else if (diffInSeconds < 31536000) {
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    } else {
        return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    }
};

// ===============================
// Main Component
// ===============================

const DashboardPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Simulate fetching data
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAnnouncements(dummyAnnouncements);
            setStats(dummyStats);
            setEmployees(generateRandomEmployees(5)); // Generate 5 employees
            setTasks(generateTasks(5));
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-blue-50/50 min-h-screen">  {/* Lightest blue background */}
            <Heading level={1} className="text-3xl font-bold mb-8 text-blue-800 dark:text-blue-200">Dashboard</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <StatCard key={stat.title} stat={stat} />
                ))}
            </div>

            <Separator className="my-8 bg-blue-200" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Announcements Section */}
                <div>
                    <Heading level={2} className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Announcements</Heading>
                    <ScrollArea className="h-[400px] w-full rounded-md">
                        <div className="p-4">
                            {announcements.length > 0 ? (
                                announcements.map((announcement) => (
                                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                                ))
                            ) : (
                                <Paragraph className="text-gray-500 dark:text-gray-400">No announcements at this time.</Paragraph>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Employee and Task Section */}
                <div>
                    <div className="mb-8">
                        <Heading level={2} className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Employees</Heading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {employees.map((employee) => (
                                <EmployeeCard key={employee.id} employee={employee} />
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" className="text-blue-500 hover:bg-blue-50/50 hover:text-blue-600">
                                View All Employees
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Heading level={2} className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">Tasks</Heading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" className="text-blue-500 hover:bg-blue-50/50 hover:text-blue-600">
                                View All Tasks
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
