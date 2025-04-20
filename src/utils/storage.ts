
import { User } from "@/types/user";
import { Certificate } from "@/types/user";
import { SemesterRecord, Project, Internship } from "@/contexts/AcademicContext";

// User storage helpers
export const storeUser = (user: User): void => {
  localStorage.setItem('svu_user', JSON.stringify(user));
};

export const retrieveUser = (): User | null => {
  const storedUser = localStorage.getItem('svu_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Users list storage helpers
export const storeUsers = (users: User[]): void => {
  localStorage.setItem('svu_users', JSON.stringify(users));
};

export const retrieveUsers = (): User[] | null => {
  const storedUsers = localStorage.getItem('svu_users');
  return storedUsers ? JSON.parse(storedUsers) : null;
};

// Certificate storage helpers
export const storeCertificates = (certificates: Certificate[]): void => {
  localStorage.setItem('svu_certificates', JSON.stringify(certificates));
};

export const retrieveCertificates = (): Certificate[] => {
  const storedCertificates = localStorage.getItem('svu_certificates');
  return storedCertificates ? JSON.parse(storedCertificates) : [];
};

// Academic records storage helpers
export const storeAcademicRecords = (records: Record<string, SemesterRecord[]>): void => {
  localStorage.setItem('svu_academic_records', JSON.stringify(records));
};

export const retrieveAcademicRecords = (): Record<string, SemesterRecord[]> => {
  const storedRecords = localStorage.getItem('svu_academic_records');
  return storedRecords ? JSON.parse(storedRecords) : {};
};

// Projects storage helpers
export const storeProjects = (projects: Project[]): void => {
  localStorage.setItem('svu_projects', JSON.stringify(projects));
};

export const retrieveProjects = (): Project[] => {
  const storedProjects = localStorage.getItem('svu_projects');
  return storedProjects ? JSON.parse(storedProjects) : [];
};

// Internships storage helpers
export const storeInternships = (internships: Internship[]): void => {
  localStorage.setItem('svu_internships', JSON.stringify(internships));
};

export const retrieveInternships = (): Internship[] => {
  const storedInternships = localStorage.getItem('svu_internships');
  return storedInternships ? JSON.parse(storedInternships) : [];
};

// Clear all storage
export const clearStorage = (): void => {
  localStorage.removeItem('svu_user');
  localStorage.removeItem('svu_users');
  localStorage.removeItem('svu_certificates');
  localStorage.removeItem('svu_academic_records');
  localStorage.removeItem('svu_projects');
  localStorage.removeItem('svu_internships');
};
