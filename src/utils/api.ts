const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
    id: number;
    username: string;
    role: string;
    name: string;
}

export interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date_issued: string;
    user_id: number;
    user?: {
        id: number;
        username: string;
        role: string;
        name: string;
    };
}

export interface Project {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    user_id: number;
    user?: {
        id: number;
        username: string;
        role: string;
        name: string;
    };
}

export interface Internship {
    id: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
    user_id: number;
    user?: {
        id: number;
        username: string;
        role: string;
        name: string;
    };
}

export interface InternshipFormData {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
    user_id: number;
}

export interface ProjectFormData {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    user_id: number;
}

export const api = {
    login: async (username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return response.json();
    },

    getCertificates: async (userId: number | undefined): Promise<Certificate[]> => {
        try {
            if (!userId) {
                console.warn('No user ID provided for certificates fetch');
                return [];
            }
            const response = await fetch(`${API_BASE_URL}/certificates?user_id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch certificates');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching certificates:', error);
            return [];
        }
    },

    addCertificate: async (certificate: Omit<Certificate, 'id'>): Promise<{ success: boolean; id: number }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/certificates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(certificate),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add certificate');
            }
            return data;
        } catch (error) {
            console.error('Error adding certificate:', error);
            throw error;
        }
    },

    getProjects: async (userId: number | undefined): Promise<Project[]> => {
        try {
            if (userId === undefined) {
                console.warn('No user ID provided for projects fetch');
                return [];
            }
            const url = userId === 0 
                ? `${API_BASE_URL}/projects?view=all` 
                : `${API_BASE_URL}/projects?user_id=${userId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },

    addProject: async (project: Omit<Project, 'id'>): Promise<{ success: boolean; id: number }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add project');
            }
            return data;
        } catch (error) {
            console.error('Error adding project:', error);
            throw error;
        }
    },

    getInternships: async (userId: number | undefined): Promise<Internship[]> => {
        try {
            if (userId === undefined) {
                console.warn('No user ID provided for internships fetch');
                return [];
            }
            const url = userId === 0 
                ? `${API_BASE_URL}/internships?view=all` 
                : `${API_BASE_URL}/internships?user_id=${userId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch internships');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching internships:', error);
            return [];
        }
    },

    addInternship: async (internship: Omit<Internship, 'id'>): Promise<{ success: boolean; id: number }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/internships`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(internship),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add internship');
            }
            return data;
        } catch (error) {
            console.error('Error adding internship:', error);
            throw error;
        }
    },

    deleteCertificate: async (id: number): Promise<{ success: boolean }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete certificate');
            }
            return response.json();
        } catch (error) {
            console.error('Error deleting certificate:', error);
            throw error;
        }
    },

    deleteProject: async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error deleting project:', error);
            return { success: false, message: 'Failed to delete project' };
        }
    },

    deleteInternship: async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete internship');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error deleting internship:', error);
            return { success: false, message: 'Failed to delete internship' };
        }
    },
}; 