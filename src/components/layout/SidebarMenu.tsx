
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  BookOpen, 
  Award, 
  Briefcase, 
  FileCheck, 
  Settings, 
  LogOut,
  GraduationCap
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        active 
          ? "bg-[#D6A4A4] text-white dark:bg-[#D6A4A4] dark:text-white" 
          : "text-gray-700 dark:text-gray-300 hover:bg-[#D6A4A4]/20 dark:hover:bg-[#D6A4A4]/20"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

export function SidebarMenu() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  // Define menu items based on user role
  const getMenuItems = () => {
    const path = location.pathname;
    
    const commonItems = [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: Settings, label: "Account Settings", href: "/settings" },
    ];
    
    const adminItems = [
      { icon: Users, label: "User Management", href: "/users" },
    ];
    
    const teacherItems = [
      { icon: BookOpen, label: "Student Records", href: "/students" },
      { icon: FileCheck, label: "Grade Management", href: "/grades" },
      { icon: Award, label: "Certificates", href: "/certificates" },
    ];
    
    const studentItems = [
      { icon: BookOpen, label: "Results", href: "/results" },
      { icon: Award, label: "Projects", href: "/projects" },
      { icon: Briefcase, label: "Internships", href: "/internships" },
      { icon: Award, label: "Certificates", href: "/certificates" },
    ];
    
    switch (user.role) {
      case "admin":
        return [...commonItems, ...adminItems];
      case "teacher":
        return [...commonItems, ...teacherItems];
      case "student":
        return [...commonItems, ...studentItems];
      default:
        return commonItems;
    }
  };
  
  const menuItems = getMenuItems();
  
  return (
    <div className="space-y-1 px-2 py-4">
      {/* SVU Management label with better contrast */}
      <div className="mb-4 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h3 className="text-base font-bold text-gray-800 dark:text-white bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-2 py-1 rounded-lg inline-block">SVU Management</h3>
      </div>
      
      {menuItems.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={location.pathname === item.href}
        />
      ))}
      
      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
