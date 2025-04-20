
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { User, UserRole } from '@/types/user';
import { getSampleUsers } from '@/utils/sampleData';
import { storeUser, retrieveUser, storeUsers, retrieveUsers, clearStorage } from '@/utils/storage';

// Define admin privileges interface
export interface AdminPrivileges {
  canManageUsers: boolean;
  canViewAllRecords: boolean;
  canGradeStudents: boolean;
  canAccessAnalytics: boolean;
}

// Update User interface to include admin privileges
export interface ExtendedUser extends User {
  adminPrivileges?: AdminPrivileges;
}

interface AuthContextType {
  user: ExtendedUser | null;
  login: (id: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  createUser: (userData: Omit<User, 'id'> & { id: string, password: string }) => void;
  users: ExtendedUser[];
  updateUserPassword: (userId: string, newPassword: string) => boolean;
  deleteUser: (userId: string) => boolean;
  updateUserProfile: (userId: string, updatedData: Partial<ExtendedUser>) => boolean;
  getStudentsByDepartment: (department: string) => ExtendedUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<ExtendedUser[]>(() => {
    return retrieveUsers() || getSampleUsers();
  });
  
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const storedUser = retrieveUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    storeUsers(users);
  }, [users]);

  const login = (id: string, password: string, role: UserRole): boolean => {
    console.log(`Attempting login with id: ${id}, role: ${role}`);
    console.log('Available users:', users);
    
    const foundUser = users.find(u => u.id === id && u.role === role);
    console.log('Found user:', foundUser);
    
    if (foundUser && foundUser.password === password) {
      console.log('User login successful');
      setUser(foundUser);
      storeUser(foundUser);
      toast.success(`Welcome, ${foundUser.name}!`);
      return true;
    }
    
    console.log('Login failed - invalid credentials');
    toast.error("Invalid credentials. Please try again.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('svu_user');
    toast.info("You have been logged out.");
  };

  // Helper to normalize department names for comparison
  const normalizeDepartment = (department: string): string => {
    return department.trim().toLowerCase();
  };

  // Get students filtered by department (case-insensitive)
  const getStudentsByDepartment = (department: string): ExtendedUser[] => {
    const normalizedDepartment = normalizeDepartment(department);
    return users.filter(u => 
      u.role === "student" && 
      u.branch && 
      normalizeDepartment(u.branch) === normalizedDepartment
    );
  };

  const createUser = (userData: Omit<User, 'id'> & { id: string, password: string }) => {
    if (users.some(u => u.id === userData.id)) {
      toast.error("User ID already exists. Please choose another.");
      return;
    }
    
    const newUser = {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      password: userData.password,
      gender: userData.gender || "other",
      ...(userData.role === "teacher" ? {
        department: userData.department || "",
      } : {}),
      ...(userData.role === "student" ? {
        rollNo: userData.rollNo || "",
        program: userData.program || "BTech",
        branch: userData.branch || "",
      } : {}),
      email: userData.email || "",
      github: userData.github || "",
      linkedin: userData.linkedin || "",
      phone: userData.phone || "",
      address: userData.address || "",
      profilePic: userData.profilePic || "",
      adminPrivileges: undefined,
    };
    
    console.log('Creating new user:', newUser);
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    storeUsers(newUsers);
    toast.success(`New ${userData.role} account created successfully!`);
  };

  const updateUserPassword = (userId: string, newPassword: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      toast.error("User not found.");
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    setUsers(updatedUsers);
    storeUsers(updatedUsers);
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      storeUser(updatedUser);
    }
    
    toast.success("Password updated successfully.");
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    if (userId === 'rishil') {
      toast.error("Cannot delete the admin account.");
      return false;
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      toast.error("User not found.");
      return false;
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    storeUsers(updatedUsers);
    
    toast.success("User deleted successfully.");
    return true;
  };

  const updateUserProfile = (userId: string, updatedData: Partial<ExtendedUser>): boolean => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      toast.error("User not found.");
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updatedData
    };

    setUsers(updatedUsers);
    storeUsers(updatedUsers);
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      storeUser(updatedUser);
    }
    
    toast.success("Profile updated successfully.");
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      createUser, 
      users,
      updateUserPassword,
      deleteUser,
      updateUserProfile,
      getStudentsByDepartment
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { ExtendedUser as User };
