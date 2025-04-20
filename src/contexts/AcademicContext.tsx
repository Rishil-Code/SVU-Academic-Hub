
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { retrieveUsers } from '@/utils/storage';
import { 
  storeAcademicRecords, 
  retrieveAcademicRecords, 
  storeProjects,
  retrieveProjects,
  storeInternships,
  retrieveInternships
} from '@/utils/storage';

// Academic record types
export interface Subject {
  name: string;
  mid1: number | null;
  mid2: number | null;
  semExam: number | null;
  credits: number;
}

export interface Laboratory {
  name: string;
  marks: number | null;
  credits: number;
}

export interface SemesterRecord {
  semester: number;
  subjects: Subject[];
  labs: Laboratory[];
  sgpa: number | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  studentId: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  studentId: string;
}

interface AcademicContextType {
  academicRecords: Record<string, SemesterRecord[]>; // studentId -> records
  projects: Project[];
  internships: Internship[];
  addSemesterRecord: (studentId: string, record: SemesterRecord) => void;
  updateMarks: (studentId: string, semester: number, subjects: Subject[], labs: Laboratory[]) => void;
  calculateSGPA: (subjects: Subject[], labs: Laboratory[]) => number;
  calculateCGPA: (studentId: string) => number;
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (projectId: string) => void;
  getVisibleProjects: () => Project[];
  addInternship: (internship: Omit<Internship, 'id'>) => void;
  deleteInternship: (internshipId: string) => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Initialize academic records from localStorage
  const [academicRecords, setAcademicRecords] = useState<Record<string, SemesterRecord[]>>(() => {
    return retrieveAcademicRecords();
  });
  
  // Initialize projects from localStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    return retrieveProjects();
  });
  
  // Initialize internships from localStorage
  const [internships, setInternships] = useState<Internship[]>(() => {
    return retrieveInternships();
  });

  // Save academicRecords to localStorage whenever they change
  useEffect(() => {
    storeAcademicRecords(academicRecords);
  }, [academicRecords]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    storeProjects(projects);
  }, [projects]);

  // Save internships to localStorage whenever they change
  useEffect(() => {
    storeInternships(internships);
  }, [internships]);

  const addSemesterRecord = (studentId: string, record: SemesterRecord) => {
    setAcademicRecords(prev => {
      const studentRecords = prev[studentId] || [];
      // Check if semester already exists
      const semesterExists = studentRecords.some(r => r.semester === record.semester);
      
      if (semesterExists) {
        toast.error("Semester record already exists. Please use update instead.");
        return prev;
      }
      
      const updatedRecords = [...studentRecords, record];
      return { ...prev, [studentId]: updatedRecords };
    });
    
    toast.success("Semester record added successfully!");
  };

  const updateMarks = (studentId: string, semester: number, subjects: Subject[], labs: Laboratory[]) => {
    setAcademicRecords(prev => {
      const studentRecords = [...(prev[studentId] || [])];
      const semesterIndex = studentRecords.findIndex(r => r.semester === semester);
      
      // Calculate SGPA
      const sgpa = calculateSGPA(subjects, labs);
      
      if (semesterIndex >= 0) {
        // Update existing record
        studentRecords[semesterIndex] = {
          ...studentRecords[semesterIndex],
          subjects,
          labs,
          sgpa,
        };
      } else {
        // Add new record
        studentRecords.push({
          semester,
          subjects,
          labs,
          sgpa,
        });
      }
      
      return { ...prev, [studentId]: studentRecords };
    });
    
    toast.success("Marks updated successfully!");
  };

  const calculateSGPA = (subjects: Subject[], labs: Laboratory[]): number => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    
    // Calculate for subjects
    subjects.forEach(subject => {
      if (subject.mid1 !== null && subject.mid2 !== null && subject.semExam !== null) {
        const totalMarks = (subject.mid1 + subject.mid2) / 2 + subject.semExam;
        let grade = 0;
        
        if (totalMarks >= 90) grade = 10;
        else if (totalMarks >= 80) grade = 9;
        else if (totalMarks >= 70) grade = 8;
        else if (totalMarks >= 60) grade = 7;
        else if (totalMarks >= 50) grade = 6;
        else if (totalMarks >= 40) grade = 5;
        else grade = 0;
        
        totalGradePoints += grade * subject.credits;
        totalCredits += subject.credits;
      }
    });
    
    // Calculate for labs
    labs.forEach(lab => {
      if (lab.marks !== null) {
        let grade = 0;
        
        if (lab.marks >= 90) grade = 10;
        else if (lab.marks >= 80) grade = 9;
        else if (lab.marks >= 70) grade = 8;
        else if (lab.marks >= 60) grade = 7;
        else if (lab.marks >= 50) grade = 6;
        else if (lab.marks >= 40) grade = 5;
        else grade = 0;
        
        totalGradePoints += grade * lab.credits;
        totalCredits += lab.credits;
      }
    });
    
    return totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;
  };

  const calculateCGPA = (studentId: string): number => {
    const studentRecords = academicRecords[studentId] || [];
    
    if (studentRecords.length === 0) return 0;
    
    let totalSGPA = 0;
    let completedSemesters = 0;
    
    studentRecords.forEach(record => {
      if (record.sgpa !== null) {
        totalSGPA += record.sgpa;
        completedSemesters++;
      }
    });
    
    return completedSemesters > 0 ? parseFloat((totalSGPA / completedSemesters).toFixed(2)) : 0;
  };

  // Project management
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    
    setProjects(prev => [...prev, newProject]);
    toast.success("Project added successfully!");
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(proj => proj.id !== projectId));
    toast.success("Project deleted successfully!");
  };

  // Get visible projects based on user role and department
  const getVisibleProjects = (): Project[] => {
    if (!user) return [];
    
    // Get all users to check departments
    const allUsers = retrieveUsers() || [];
    
    if (user.role === 'student') {
      // Students can only see their own projects
      return projects.filter(project => project.studentId === user.id);
    } else if (user.role === 'teacher') {
      // Teachers can see projects from students in their department
      return projects.filter(project => {
        const studentUser = allUsers.find(u => u.id === project.studentId);
        return studentUser && studentUser.department === user.department;
      });
    } else if (user.role === 'admin') {
      // Admins can see all projects
      return projects;
    }
    
    return [];
  };

  // Internship management
  const addInternship = (internshipData: Omit<Internship, 'id'>) => {
    const newInternship: Internship = {
      ...internshipData,
      id: `intern-${Date.now()}`,
    };
    
    setInternships(prev => [...prev, newInternship]);
    toast.success("Internship added successfully!");
  };

  const deleteInternship = (internshipId: string) => {
    setInternships(prev => prev.filter(intern => intern.id !== internshipId));
    toast.success("Internship deleted successfully!");
  };

  return (
    <AcademicContext.Provider value={{
      academicRecords,
      projects,
      internships,
      addSemesterRecord,
      updateMarks,
      calculateSGPA,
      calculateCGPA,
      addProject,
      deleteProject,
      getVisibleProjects,
      addInternship,
      deleteInternship,
    }}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (context === undefined) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
