const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date_issued: string;
    user_id: number;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    user_id: number;
}

export interface Internship {
    id: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
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

    getCertificates: async (userId: number): Promise<Certificate[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/certificates?user_id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch certificates');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching certificates:', error);
            throw error;
        }
    },

    addCertificate: async (certificate: Omit<Certificate, 'id'>): Promise<{ success: boolean; id: number }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/certificates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...certificate,
                    user_id: certificate.user_id.toString(),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add certificate');
            }
            return response.json();
        } catch (error) {
            console.error('Error adding certificate:', error);
            throw error;
        }
    },

    getProjects: async (userId: number | 'all'): Promise<Project[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects?user_id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    addProject: async (project: Omit<Project, 'id'>): Promise<{ success: boolean; id: number }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...project,
                    user_id: project.user_id.toString(),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add project');
            }
            return response.json();
        } catch (error) {
            console.error('Error adding project:', error);
            throw error;
        }
    },

    getInternships: async (userId: number | 'all'): Promise<Internship[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/internships?user_id=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch internships');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching internships:', error);
            throw error;
        }
    },

    addInternship: async (internship: Omit<Internship, 'id'>): Promise<{ success: boolean; id: number }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/internships`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...internship,
                    user_id: internship.user_id.toString(),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add internship');
            }
            return response.json();
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
}; 