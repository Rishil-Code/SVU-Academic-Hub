
// Define user roles
export type UserRole = 'admin' | 'teacher' | 'student';

// Define program types
export type Program = 'BTech' | 'MTech' | 'BSc' | 'MSc' | 'BCA' | 'MCA' | 'BBA' | 'MBA' | 'BA' | 'MA' | 'Diploma';

// Define admin privileges
export interface AdminPrivileges {
  canManageUsers: boolean;
  canViewAllRecords: boolean;
  canGradeStudents: boolean;
  canAccessAnalytics: boolean;
}

// Define user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string;
  department?: string;
  rollNo?: string;
  program?: Program;
  branch?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  github?: string;
  linkedin?: string;
  phone?: string;
  address?: string;
  profilePic?: string;
  adminPrivileges?: AdminPrivileges;
}

// Define certificate interface
export interface Certificate {
  id: string;
  userId: string;
  name: string;
  issuingAuthority: string;
  issueDate: string;
  fileUrl?: string;
  uploadDate?: string; // Adding upload date for better tracking
  description?: string; // Optional description field
  userData?: Partial<User>; // Add userData to store user information
}
