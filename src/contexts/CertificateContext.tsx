
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Certificate, User } from '@/types/user';
import { storeCertificates, retrieveCertificates } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';

interface CertificateContextType {
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  deleteCertificate: (certificateId: string) => void;
  getUserCertificates: (userId: string) => Certificate[];
  getVisibleCertificates: () => Certificate[];
  uploadCertificateFile: (file: File) => Promise<string>;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      return retrieveCertificates();
    } catch (error) {
      console.error("Error loading certificates from storage:", error);
      return [];
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save certificates to localStorage whenever they change
  useEffect(() => {
    try {
      storeCertificates(certificates);
    } catch (error) {
      console.error("Error saving certificates to storage:", error);
      setError("Failed to save certificates. Please try again.");
    }
  }, [certificates]);

  const addCertificate = (certificateData: Omit<Certificate, 'id'>) => {
    try {
      const newCertificate: Certificate = {
        ...certificateData,
        id: `cert-${Date.now()}`,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      
      setCertificates(prev => [...prev, newCertificate]);
      toast.success("Certificate added successfully!");
    } catch (error) {
      console.error("Error adding certificate:", error);
      setError("Failed to add certificate. Please try again.");
      toast.error("Failed to add certificate. Please try again.");
    }
  };

  const deleteCertificate = (certificateId: string) => {
    try {
      setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError("Failed to delete certificate. Please try again.");
      toast.error("Failed to delete certificate. Please try again.");
    }
  };

  const getUserCertificates = (userId: string): Certificate[] => {
    try {
      return certificates.filter(cert => cert.userId === userId);
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      setError("Failed to fetch certificates. Please try again.");
      return [];
    }
  };

  // Get certificates based on user role
  const getVisibleCertificates = (): Certificate[] => {
    if (!user) return [];
    
    if (user.role === 'student') {
      // Students can only see their own certificates
      return getUserCertificates(user.id);
    } else if (user.role === 'teacher') {
      // Teachers can see certificates from students in their department
      return certificates.filter(cert => {
        const certUserData = cert.userData;
        return certUserData && certUserData.department === user.department;
      });
    } else if (user.role === 'admin') {
      // Admins can see all certificates
      return certificates;
    }
    
    return [];
  };

  // Simulated file upload function with improved error handling
  const uploadCertificateFile = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for upload
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          const fileUrl = `file-${Date.now()}-${file.name}`;
          toast.success("File uploaded successfully!");
          resolve(fileUrl);
        }, 1500);
      });
    } catch (error) {
      setIsLoading(false);
      const errorMessage = "Failed to upload file. Please try again.";
      console.error("Error uploading file:", error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <CertificateContext.Provider value={{
      certificates,
      isLoading,
      error,
      addCertificate,
      deleteCertificate,
      getUserCertificates,
      getVisibleCertificates,
      uploadCertificateFile,
    }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
};
