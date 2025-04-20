
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import volleyballLogo from "@/assets/volleyball-logo.svg";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function Login() {
  const { user } = useAuth();

  // Add dark mode check on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F4F9] to-white dark:from-[#1E1E2F] dark:to-[#282836] p-4 relative overflow-hidden">
      {/* Cherry Blossom Petals */}
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      
      <div className="mb-8 text-center animate-fade-in relative z-10">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 shadow-lg border border-[#D6A4A4]/30 animate-float">
            <img src={volleyballLogo} alt="SVU Logo" className="h-12 w-12" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-2 rounded-full bg-[#D6A4A4]/70 dark:bg-[#D6A4A4]/40 backdrop-blur-sm inline-block">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              SVU Student Hub
            </h1>
          </div>
          <p className="mt-1 text-lg text-gray-700 dark:text-gray-300 bg-gray-100/70 dark:bg-[#282836]/70 px-4 py-1 rounded-full inline-block">
            Academic Management System
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <LoginForm />
      </div>
      
      <div className="mt-12 text-center relative z-10">
        <div className="w-32 h-1 bg-[#D6A4A4]/30 mx-auto mb-4 rounded-full"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/30 dark:bg-[#282836]/70 px-3 py-1 rounded-full inline-block">
          Powered by SVU © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
