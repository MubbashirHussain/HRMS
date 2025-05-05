import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/base/button"; // Assuming Button is correctly located
import { twMerge } from "tailwind-merge";
import { ScrollArea, Sheet, SheetContent, SheetTrigger } from "../base/sheet";

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
}> = ({ item, theme, isCollapsed, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (item.isCollapsible) {
      setIsOpen(!isOpen);
    }
    onItemClick?.(item);
  }, [item, isOpen, onItemClick]);

  return (
    <div className="w-full">
      <div
        className={twMerge(
          "flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full cursor-pointer", // Added cursor-pointer
          "hover:bg-blue-100 hover:text-blue-600", // Themed hover
          item.isCollapsible ? "justify-between" : "justify-start"
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
          <div>
            <ChevronRight className="w-4 h-4 text-blue-500" />{" "}
            {/* Themed chevron */}
          </div>
        )}
      </div>
      {isOpen && item.children && !isCollapsed && (
        <div className="overflow-hidden">
          <div className="ml-6 space-y-1">
            {item.children.map((child, index) => (
              <div
                key={index}
                className={twMerge(
                  "flex items-center gap-3 p-2 rounded-md transition-colors duration-200 w-full cursor-pointer", // Added cursor-pointer
                  "hover:bg-blue-100 hover:text-blue-600" // Themed hover
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
        </div>
      )}
    </div>
  );
};

// ===============================
// Main Component
// ===============================

const DashboardSidebarDrawer = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [isOpen, setIsOpen] = useState(false); // For mobile menu

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
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md border-blue-200 text-blue-700" // Themed button
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          onOpenChange={() => {}}
          side="left"
          className="w-64 bg-white p-0 dark:bg-gray-900 border-r border-blue-200 dark:border-blue-800" // Themed border
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
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={twMerge(
          "hidden md:flex flex-col h-screen transition-all duration-300",
          "border-r border-blue-200 dark:border-blue-800", // Themed border
          "bg-white dark:bg-gray-900",
          isCollapsed ? "w-20" : "w-64"
        )}
        style={{
          backgroundColor: theme.menuBgColor,
        }}
      >
        {/* Logo */}
        <div
          className={twMerge(
            "flex items-center justify-center h-16 p-4 transition-all duration-300",
            "border-b border-blue-200 dark:border-blue-800", // Themed border
            "bg-blue-50/50 dark:bg-blue-950" // Themed background
          )}
          style={{ backgroundColor: theme.menuBgColor }}
        >
          {!isCollapsed && theme.logo}
          {isCollapsed && <Menu className="w-6 h-6 text-blue-500" />}{" "}
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
              />
            ))}
          </div>
        </ScrollArea>

        {/* Collapse Button */}
        <div
          className={twMerge(
            "flex items-center justify-center h-16 p-4 transition-all duration-300 cursor-pointer",
            "border-t border-blue-200 dark:border-blue-800", // Themed border
            "hover:bg-blue-100 dark:hover:bg-blue-900", // Themed hover
            "flex items-center justify-end" // Aligns items to the end (right in LTR)
          )}
          onClick={toggleCollapse}
          style={{ backgroundColor: theme.menuBgColor }}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-6 h-6 text-blue-500" /> // Themed chevron
          ) : (
            <ChevronLeft className="w-6 h-6 text-blue-500" /> // Themed chevron
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardSidebarDrawer;
