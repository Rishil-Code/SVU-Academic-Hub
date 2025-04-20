
import { User, UserRole } from "@/types/user";

// Sample users for development
export const getSampleUsers = (): User[] => {
  const admin = {
    id: 'rishil',
    name: 'Rishil (Admin)',
    role: 'admin' as UserRole,
    password: 'rishil12', // Fixed admin password
  };

  const teacher = {
    id: 'teacher1',
    name: 'Dr. Sugawara',
    role: 'teacher' as UserRole,
    department: 'Computer Science',
    gender: 'male' as 'male' | 'female' | 'other',
    password: 'password123',
    email: 'sugawara@svu.edu',
    phone: '9876543210',
  };

  const student = {
    id: 'student1',
    name: 'Hinata Shoyo',
    role: 'student' as UserRole,
    rollNo: 'CS2021001',
    program: 'BTech' as 'BTech',
    branch: 'Computer Science',
    password: 'password123',
    email: 'hinata@svu.edu',
    github: 'github.com/hinata',
  };

  return [admin, teacher, student];
};
