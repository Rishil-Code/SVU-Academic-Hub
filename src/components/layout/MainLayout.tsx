import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarMenu } from "./SidebarMenu";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import volleyballLogo from "@/assets/volleyball-logo.svg";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F4F4F9] to-white dark:from-[#1E1E2F] dark:to-[#282836] overflow-hidden relative">
      {/* Cherry Blossom Petals (fewer for the dashboard) */}
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      
      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200 lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 sakura-sidebar border-r border-[#E2E2E7] shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#E2E2E7]/30">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-full bg-white/20 dark:bg-white/30 flex items-center justify-center text-white font-bold">
              <img src={volleyballLogo} alt="SVU Logo" className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white">SVU Management</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="py-4">
          <SidebarMenu />
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#6D6875]/80 backdrop-blur-sm border-b border-[#E2E2E7]/30 shadow-sm flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:bg-white/10"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <span className="text-lg font-semibold hidden sm:inline-block text-white bg-[#6D6875]/60 px-3 py-1 rounded-full">
              SVU Student Management
            </span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white/90 hidden sm:block bg-[#6D6875]/60 px-3 py-1 rounded-full">
                {user.name} <span className="text-xs text-white/70 capitalize">({user.role})</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-medium shadow-inner">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
