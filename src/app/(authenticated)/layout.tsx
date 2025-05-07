"use client";
import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Menu,
    ChevronLeft,
    ChevronRight,
    Circle,
    Settings,
    Users,
    LogOut,
    FileText,
    ListChecks,
    AlertTriangle,
    CheckCircle,
    LucideCalendarX,
} from "lucide-react";
import { Button } from "@/components/ui/base/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/base/sheet";
import { ScrollArea } from "@/components/ui/base/scroll-area";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

interface NavItem {
    name: string;
    navigateTo?: string;
    icon?: React.ReactNode;
    children?: NavItem[];
    isCollapsible?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    isNavigateDisable?: boolean; // New prop
}

interface ThemeConfig {
    primaryColor: string;
    menuBgColor: string;
    menuTextColor: string;
    menuActiveTextColor: string;
    menuActiveBgColor: string;
    logo?: React.ReactNode;
    fontFamily: string;
}

interface DashboardLayoutProps {
    children: ReactNode;
    onLogout?: () => void;
    showSettings?: boolean;
    showLogout?: boolean;
    initialPath?: string;
    onNavigate?: (path: string) => void;
}

const defaultTheme: ThemeConfig = {
    primaryColor: "#6366f1",
    menuBgColor: "#f9fafb",
    menuTextColor: "#4b5563",
    menuActiveTextColor: "#6366f1",
    menuActiveBgColor: "#edf2f7",
    logo: <span className="font-bold text-xl text-blue-600">Zenith HR</span>,
    fontFamily: "Inter, sans-serif",
};

const navConfig: NavItem[] = [
    {
        name: "Dashboard",
        navigateTo: "/dashboard",
        icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
    },
    {
        name: "Employees",
        navigateTo: "/employees",
        icon: <Users className="w-4 h-4 text-blue-500" />,
    },
    {
        name: "Leaves",
        navigateTo: "/leaves",
        icon: <LucideCalendarX className="w-4 h-4 text-blue-500" />,
    },
    {
        name: "Payrolls",
        navigateTo: "/payrolls",
        icon: <LucideCalendarX className="w-4 h-4 text-blue-500" />,
    },
    {
        name: "Announcements",
        navigateTo: "/announcements",
        icon: <LucideCalendarX className="w-4 h-4 text-blue-500" />,
    },
    {
        name: "Settings",
        navigateTo: "/settings",
        icon: <Settings className="w-4 h-4 text-blue-500" />,
    },
    {
        name: "Logout",
        icon: <LogOut className="w-4 h-4 text-blue-500" />,
        onClick: () => {
            alert("Logging out...");
        },
    },
];

const NavItemComponent: React.FC<{
    item: NavItem;
    theme: ThemeConfig;
    isCollapsed: boolean;
    onItemClick?: (item: NavItem) => void;
    isActive: boolean;
}> = ({ item, theme, isCollapsed, onItemClick, isActive }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = useCallback(() => {
        if (item.isDisabled) return;

        if (item.isCollapsible) {
            setIsOpen(!isOpen);
        }
        if (item.onClick) {
            item.onClick();
        } else if (item.navigateTo && !item.isNavigateDisable) { // added condition
            onItemClick?.(item);
        }
    }, [item, isOpen, onItemClick]);

    return (
        <div className="w-full">
            <motion.div
                className={twMerge(
                    "flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full cursor-pointer",
                    "hover:bg-blue-100 hover:text-blue-600",
                    item.isCollapsible ? "justify-between" : "justify-start",
                    isActive && "bg-blue-100 text-blue-600 font-semibold",
                    item.isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit"
                )}
                style={{
                    color: theme.menuTextColor,
                    backgroundColor: theme.menuBgColor,
                }}
                onClick={handleClick}
            >
                <div className="flex items-center gap-3">
                    {item.icon}
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>
                {item.isCollapsible && !isCollapsed && (
                    <motion.div
                        animate={{
                            rotate: isOpen ? 90 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                    </motion.div>
                )}
            </motion.div>
            <AnimatePresence>
                {isOpen && item.children && !isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="ml-6 space-y-1">
                            {item.children.map((child, index) => (
                                <div
                                    key={index}
                                    className={twMerge(
                                        "flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full cursor-pointer",
                                        "hover:bg-blue-100 hover:text-blue-600",
                                        isActive && "bg-blue-100 text-blue-600 font-semibold"
                                    )}
                                    style={{
                                        color: theme.menuTextColor,
                                        backgroundColor: theme.menuBgColor,
                                    }}
                                    onClick={() => {
                                        onItemClick?.(child);
                                    }}
                                >
                                    <Circle className="w-3 h-3 text-blue-500" />
                                    <span className="truncate">{child.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    onLogout,
    showSettings = true,
    showLogout = true,
    initialPath = "/dashboard",
    onNavigate,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activePath, setActivePath] = useState(initialPath);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationTitle, setConfirmationTitle] = useState("");
    const [confirmationText, setConfirmationText] = useState("");
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
    const [confirmationType, setConfirmationType] = useState<
        "warning" | "success"
    >("warning");

    const router = useRouter();

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty("--primary-color", theme.primaryColor);
        root.style.setProperty("--menu-bg-color", theme.menuBgColor);
        root.style.setProperty("--menu-text-color", theme.menuTextColor);
        root.style.setProperty(
            "--menu-active-text-color",
            theme.menuActiveTextColor
        );
        root.style.setProperty("--menu-active-bg-color", theme.menuActiveBgColor);
        root.style.fontFamily = theme.fontFamily;
    }, [theme]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (item: NavItem) => {
        console.log(`Navigating to: ${item.navigateTo}`);
        setActivePath(item.navigateTo || '');
        if (item.navigateTo) {
            router.push(item.navigateTo);
            if (onNavigate) {
                onNavigate(item.navigateTo);
            }
        }

        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        setConfirmationTitle("Are you sure?");
        setConfirmationText("Do you want to log out?");
        setConfirmationType("warning");
        setOnConfirm(() => {
            if (onLogout) {
                onLogout();
            } else {
                window.location.href = "/login";
            }
            setShowConfirmation(false);
        });
        setShowConfirmation(true);
    };

    const showConfirmationDialog = (
        title: string,
        text: string,
        type: "warning" | "success",
        onConfirmAction: () => void
    ) => {
        setConfirmationTitle(title);
        setConfirmationText(text);
        setConfirmationType(type);
        setOnConfirm(() => {
            onConfirmAction();
            setShowConfirmation(false);
        });
        setShowConfirmation(true);
    };

    const closeConfirmationDialog = () => {
        setShowConfirmation(false);
        setOnConfirm(null);
    };

    useEffect(() => {
        if (showLogout) {
            const logoutItem = {
                name: "Logout",
                icon: <LogOut className="w-4 h-4 text-blue-500" />,
                onClick: handleLogout,
            };

            const logoutConfig = navConfig.find((item) => item.name === "Logout");
            if (!logoutConfig) {
                navConfig.push(logoutItem);
            }
        }
    }, [showLogout, handleLogout]);

    useEffect(() => {
        if (showSettings) {
            const settingsItem = {
                name: "Settings",
                navigateTo: "/settings",
                icon: <Settings className="w-4 h-4 text-blue-500" />,
            };

            const settingsConfig = navConfig.find((item) => item.name === "Settings");
            if (!settingsConfig) {
                navConfig.push(settingsItem);
            }
        }
    }, [showSettings]);

    useEffect(() => {
        if (initialPath) {
            setActivePath(initialPath);
        }
    }, [initialPath]);

    return (
        <div className="flex h-screen" style={{ fontFamily: theme.fontFamily }}>
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md border-blue-200 text-blue-700"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                {isMobileMenuOpen && (
                    <SheetContent
                        onOpenChange={setIsMobileMenuOpen}
                        side="left"
                        className="w-64 bg-white p-0 z-20 dark:bg-gray-900 border-r border-blue-200 dark:border-blue-800"
                    >
                        <div className="flex flex-col h-full">
                            {/* Logo */}
                            <div
                                className={twMerge(
                                    "flex items-center justify-center h-16 p-4 transition-all duration-300",
                                    "border-b border-blue-200 dark:border-blue-800",
                                    "bg-blue-50/50 dark:bg-blue-950"
                                )}
                                style={{ backgroundColor: theme.menuBgColor }}
                            >
                                {theme.logo}
                            </div>

                            <ScrollArea className="flex-1">
                                <div
                                    className="p-4 space-y-2"
                                    style={{ backgroundColor: theme.menuBgColor }}
                                >
                                    {navConfig.map((item, index) => (
                                        <NavItemComponent
                                            key={index}
                                            item={item}
                                            theme={theme}
                                            isCollapsed={false}
                                            onItemClick={handleItemClick}
                                            isActive={activePath === (item.navigateTo || '')}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </SheetContent>
                )}
            </Sheet>

            {/* Desktop Sidebar */}
            <motion.div
                className={twMerge(
                    "hidden md:flex flex-col h-screen transition-all duration-300",
                    "border-r border-blue-200 ",
                    "bg-white dark:bg-gray-900",
                    isCollapsed ? "w-20" : "w-50"
                )}
                style={{
                    backgroundColor: theme.menuBgColor,
                }}
                animate={{
                    width: isCollapsed ? 80 : 240,
                }}
            >
                {/* Logo */}
                <div
                    className={twMerge(
                        "flex items-center justify-center h-16 p-4 transition-all duration-300",
                        "border-b border-blue-200 ",
                        "bg-blue-50/50 dark:bg-blue-950"
                    )}
                    style={{ backgroundColor: theme.menuBgColor }}
                >
                    {!isCollapsed && theme.logo}
                    {isCollapsed && <Menu className="w-6 h-6 text-blue-500" />}
                </div>

                <ScrollArea className="flex-1">
                    <div
                        className="p-4 space-y-2"
                        style={{ backgroundColor: theme.menuBgColor }}
                    >
                        {navConfig.map((item, index) => (
                            <NavItemComponent
                                key={index}
                                item={item}
                                theme={theme}
                                isCollapsed={isCollapsed}
                                onItemClick={handleItemClick}
                                isActive={activePath === (item.navigateTo || '')}
                            />
                        ))}
                    </div>
                </ScrollArea>

                {/* Collapse Button */}
                <motion.div
                    className={twMerge(
                        "flex items-center justify-center h-16 p-4 transition-all duration-300 cursor-pointer",
                        "border-t border-blue-200 ",
                        "hover:bg-blue-100 dark:hover:bg-blue-900",
                        "flex items-center justify-end"
                    )}
                    onClick={toggleCollapse}
                    style={{ backgroundColor: theme.menuBgColor }}
                    title={isCollapsed ? "Expand" : "Collapse"}
                    animate={{
                        justifyContent: isCollapsed ? "center" : "flex-end",
                    }}
                >
                    {isCollapsed ? (
                        <>
                            <ChevronRight className="w-6 h-6 text-blue-500" />
                            <ChevronRight className="w-6 h-6 text-blue-500" />
                        </>
                    ) : (
                        <ChevronLeft className="w-6 h-6 text-blue-500" />
                    )}
                </motion.div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-100 to-white ">{children}</div>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {showConfirmation && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className={twMerge(
                                "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md",
                                confirmationType === "warning"
                                    ? "border border-yellow-400"
                                    : "border border-green-500"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                {confirmationType === "warning" ? (
                                    <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />
                                ) : (
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                                )}

                                <div className="space-y-2">
                                    <h2
                                        className={twMerge(
                                            "text-lg font-semibold",
                                            confirmationType === "warning"
                                                ? "text-yellow-700 dark:text-yellow-300"
                                                : "text-green-700 dark:text-green-300"
                                        )}
                                    >
                                        {confirmationTitle}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {confirmationText}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={closeConfirmationDialog}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (onConfirm) {
                                            onConfirm();
                                        }
                                    }}
                                    className={
                                        confirmationType === "warning"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-green-500 hover:bg-green-600 text-white"
                                    }
                                >
                                    Confirm
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
