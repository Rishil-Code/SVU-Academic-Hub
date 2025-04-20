
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AccountSettings from "@/pages/AccountSettings";
import StudentRecords from "@/pages/StudentRecords";
import GradeManagement from "@/pages/GradeManagement";
import UserManagement from "@/pages/UserManagement";
import Projects from "@/pages/Projects";
import Internships from "@/pages/Internships";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";
import Certificates from "@/pages/Certificates";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";
import { AcademicProvider } from "@/contexts/AcademicContext";
import { CertificateProvider } from "@/contexts/CertificateContext";

// Style
import "./index.css";
import "./App.css";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <AcademicProvider>
          <CertificateProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/students" element={<StudentRecords />} />
                <Route path="/grades" element={<GradeManagement />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/internships" element={<Internships />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster position="top-center" richColors />
          </CertificateProvider>
        </AcademicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
