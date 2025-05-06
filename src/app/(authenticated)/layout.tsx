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
  AlertTriangle, // Added for error/logout confirmation
  CheckCircle, // Added for success/confirmation
} from "lucide-react";
import { Button } from "@/components/ui/base/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/base/sheet";
import { ScrollArea } from "@/components/ui/base/scroll-area";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

// ===============================
// Types & Interfaces
// ===============================

interface NavItem {
  name: string;
  navigateTo: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  isCollapsible?: boolean;
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
  onLogout?: () => void; // Optional logout handler
  showSettings?: boolean; // Option to show/hide settings
  showLogout?: boolean;
  initialPath?: string;
  onNavigate?: (path: string) => void;
}

// ===============================
// Dummy Data & Config
// ===============================

const defaultTheme: ThemeConfig = {
  primaryColor: "#6366f1", // Tailwind indigo-500
  menuBgColor: "#f9fafb", // Tailwind gray-50
  menuTextColor: "#4b5563", // Tailwind gray-600
  menuActiveTextColor: "#6366f1", // Tailwind indigo-500
  menuActiveBgColor: "#edf2f7", // Tailwind gray-100
  logo: <span className="font-bold text-xl text-blue-600">Zenith HR</span>, // themed logo
  fontFamily: "Inter, sans-serif",
};

const navConfig: NavItem[] = [
  {
    name: "Dashboard",
    navigateTo: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />, // themed icon
  },
  {
    name: "Employees",
    navigateTo: "/employees",
    icon: <Users className="w-4 h-4 text-blue-500" />, // themed icon
  },
  {
    name: "Reports",
    navigateTo: "/reports",
    icon: <FileText className="w-4 h-4 text-blue-500" />, // themed icon
    isCollapsible: true,
    children: [
      { name: "Attendance", navigateTo: "/reports/attendance" },
      { name: "Payroll", navigateTo: "/reports/payroll" },
    ],
  },
  {
    name: "Tasks",
    navigateTo: "/tasks",
    icon: <ListChecks className="w-4 h-4 text-blue-500" />, // themed icon
    isCollapsible: true,
    children: [
      { name: "My Tasks", navigateTo: "/tasks/my-tasks" },
      { name: "All Tasks", navigateTo: "/tasks/all-tasks" },
    ],
  },
  {
    name: "Settings",
    navigateTo: "/settings",
    icon: <Settings className="w-4 h-4 text-blue-500" />, // themed icon
  },
  {
    name: "Logout",
    navigateTo: "/logout",
    icon: <LogOut className="w-4 h-4 text-blue-500" />, // themed icon
  },
];

// ===============================
// Helper Components
// ===============================

const NavItemComponent: React.FC<{
  item: NavItem;
  theme: ThemeConfig;
  isCollapsed: boolean;
  onItemClick?: (item: NavItem) => void;
  isActive: boolean; // Added prop to track active state
}> = ({ item, theme, isCollapsed, onItemClick, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (item.isCollapsible) {
      setIsOpen(!isOpen);
    }
    onItemClick?.(item);
  }, [item, isOpen, onItemClick]);

  return (
    <div className="w-full">
      <motion.div
        className={twMerge(
          "flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full cursor-pointer", // Added cursor-pointer
          "hover:bg-blue-100 hover:text-blue-600", // Themed hover
          item.isCollapsible ? "justify-between" : "justify-start",
          isActive && "bg-blue-100 text-blue-600 font-semibold" // Apply active styles
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
            <ChevronRight className="w-4 h-4 text-blue-500" />{" "}
            {/* Themed chevron */}
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
                    "flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full cursor-pointer", // Added cursor-pointer
                    "hover:bg-blue-100 hover:text-blue-600", // Themed hover
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
                  <Circle className="w-3 h-3 text-blue-500" />{" "}
                  {/* Themed circle */}
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

// ===============================
// Main Component
// ===============================

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile menu
  const [activePath, setActivePath] = useState(initialPath); // Track active path, initialize with props
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [confirmationType, setConfirmationType] = useState<
    "warning" | "success"
  >("warning"); // 'warning' or 'success'

  const router = useRouter();
  // Apply theme to root
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
    setActivePath(item.navigateTo); // Update active path
    router.push(item.navigateTo);
    setIsMobileMenuOpen(false); // Close mobile menu on item click
  };

  const handleLogout = () => {
    setConfirmationTitle("Are you sure?");
    setConfirmationText("Do you want to log out?");
    setConfirmationType("warning");
    setOnConfirm(() => {
      if (onLogout) {
        onLogout(); // Call provided logout handler
      } else {
        //  basic redirect
        window.location.href = "/login";
      }
      setShowConfirmation(false); // Close the dialog
    });
    setShowConfirmation(true);
  };

  // Function to show a custom confirmation dialog
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
      setShowConfirmation(false); // Close dialog on confirm
    });
    setShowConfirmation(true);
  };

  // Function to close confirmation
  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setOnConfirm(null); // Clear
  };

  // Add Logout to navConfig
  useEffect(() => {
    if (showLogout) {
      const logoutItem = {
        name: "Logout",
        navigateTo: "/logout",
        icon: <LogOut className="w-4 h-4 text-blue-500" />, // Themed icon
      };

      const logoutConfig = navConfig.find((item) => item.name === "Logout");
      if (!logoutConfig) {
        navConfig.push(logoutItem);
      }
    }
  }, [showLogout]);

  // Add Settings
  useEffect(() => {
    if (showSettings) {
      const settingsItem = {
        name: "Settings",
        navigateTo: "/settings",
        icon: <Settings className="w-4 h-4 text-blue-500" />, // Themed icon
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
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md border-blue-200 text-blue-700" // Themed button
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        {isMobileMenuOpen && (
          <SheetContent
            onOpenChange={setIsMobileMenuOpen}
            side="left"
            className="w-64 bg-white p-0 z-20 dark:bg-gray-900 border-r border-blue-200 dark:border-blue-800" // Themed border
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div
                className={twMerge(
                  "flex items-center justify-center h-16 p-4 transition-all duration-300",
                  "border-b border-blue-200 dark:border-blue-800", // Themed border
                  "bg-blue-50/50 dark:bg-blue-950" // Themed background
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
                      isCollapsed={false} // Always expanded in mobile view
                      onItemClick={handleItemClick}
                      isActive={activePath === item.navigateTo}
                    />
                  ))}
                  {showLogout && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:bg-red-50/50 hover:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  )}
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
          "border-r border-blue-200 ", // Themed border
          "bg-white dark:bg-gray-900",
          isCollapsed ? "w-20" : "w-64"
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
            "border-b border-blue-200 ", // Themed border
            "bg-blue-50/50 dark:bg-blue-950" // Themed background
          )}
          style={{ backgroundColor: theme.menuBgColor }}
        >
          {!isCollapsed && theme.logo}
          {isCollapsed && <Menu className="w-6 h-6 text-blue-500" />}
          {/* Themed menu icon */}
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
                isActive={activePath === item.navigateTo} // Pass active state
              />
            ))}
            {showLogout && (
              <Button
                variant="ghost"
                className={twMerge(
                  "w-full justify-start text-red-500 hover:bg-red-50/50 hover:text-red-600",
                  isCollapsed && "px-2"
                )}
                onClick={handleLogout}
              >
                <LogOut
                  className={twMerge("w-4 h-4 mr-2", isCollapsed && "hidden")}
                />
                {!isCollapsed && "Logout"}
              </Button>
            )}
          </div>
        </ScrollArea>

        {/* Collapse Button */}
        <motion.div
          className={twMerge(
            "flex items-center justify-center h-16 p-4 transition-all duration-300 cursor-pointer",
            "border-t border-blue-200 ", // Themed border
            "hover:bg-blue-100 dark:hover:bg-blue-900", // Themed hover
            "flex items-center justify-end" // Aligns items to the end (right in LTR)
          )}
          onClick={toggleCollapse}
          style={{ backgroundColor: theme.menuBgColor }}
          title={isCollapsed ? "Expand" : "Collapse"}
          animate={{
            justifyContent: isCollapsed ? "center" : "flex-end", // Horizontal alignment
          }}
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="w-6 h-6 text-blue-500" />{" "}
              {/* Themed chevron */}
              <ChevronRight className="w-6 h-6 text-blue-500" />{" "}
              {/* Themed chevron */}
            </>
          ) : (
            <ChevronLeft className="w-6 h-6 text-blue-500" /> // Themed chevron
          )}
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-blue-50/50">{children}</div>

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
