import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code2, Calendar, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";
import { api, Project } from "../utils/api";

interface ProjectFormData {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
}

const Projects: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        title: '',
        description: '',
        start_date: '',
        end_date: ''
    });

    const loadProjects = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getProjects(Number(user.id));
            setProjects(data);
        } catch (err) {
            console.error('Error loading projects:', err);
            setError('Failed to load projects. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error('User not found. Please try logging in again.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.addProject({
                ...formData,
                user_id: Number(user.id)
            });

            if (response.success) {
                toast.success('Project added successfully');
                setFormData({
                    title: '',
                    description: '',
                    start_date: '',
                    end_date: ''
                });
                setIsDialogOpen(false);
                await loadProjects();
            } else {
                throw new Error('Failed to add project');
            }
        } catch (err) {
            console.error('Error adding project:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to add project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async (id: number) => {
        try {
            const result = await api.deleteProject(id);
            if (result.success) {
                setProjects(projects.filter(project => project.id !== id));
                toast.success('Project deleted successfully');
            } else {
                throw new Error(result.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete project');
        }
    };

    if (!user) {
        return (
            <MainLayout>
                <div className="bg-[#F4F4F9]/50 dark:bg-[#282836]/50 p-6 rounded-lg text-center">
                    <p className="text-gray-700 dark:text-gray-300">Please log in to view this page.</p>
                </div>
            </MainLayout>
        );
    }

    const getPageTitle = () => {
        if (user.role === 'student') {
            return "My Projects";
        } else if (user.role === 'teacher') {
            return "Student Projects";
        } else {
            return "All Projects";
        }
    };

    const getPageDescription = () => {
        if (user.role === 'student') {
            return "Track your project portfolio and achievements";
        } else if (user.role === 'teacher') {
            return "View student project portfolios";
        } else {
            return "View all student projects";
        }
    };

    return (
        <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
            <MainLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-4 py-1 rounded-full inline-block text-gray-800 dark:text-white">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-300 mt-1 ml-2">
                                {getPageDescription()}
                            </p>
                        </div>
                        {user.role === 'student' && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="btn-sakura">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sakura-card sm:max-w-[550px]">
                                    <form onSubmit={handleSubmit}>
                                        <DialogHeader>
                                            <DialogTitle className="text-gray-800 dark:text-white">Add New Project</DialogTitle>
                                            <DialogDescription>
                                                Enter details about your project
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Project Title</Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    required
                                                    className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    required
                                                    className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="start_date" className="text-gray-800 dark:text-gray-200">Start Date</Label>
                                                    <Input
                                                        id="start_date"
                                                        name="start_date"
                                                        type="date"
                                                        value={formData.start_date}
                                                        onChange={handleChange}
                                                        required
                                                        className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="end_date" className="text-gray-800 dark:text-gray-200">End Date</Label>
                                                    <Input
                                                        id="end_date"
                                                        name="end_date"
                                                        type="date"
                                                        value={formData.end_date}
                                                        onChange={handleChange}
                                                        required
                                                        className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="btn-sakura"
                                            >
                                                {isSubmitting && (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                )}
                                                Add Project
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {error ? (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-red-700 dark:text-red-300">{error}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => loadProjects()}
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D6A4A4]"></div>
                            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading projects...</span>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                            <Code2 className="h-12 w-12 text-[#D6A4A4] mb-4" />
                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No projects yet</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {user.role === 'student' 
                                    ? "Add your first project to showcase your work" 
                                    : "No projects have been added yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <Card key={project.id} className="sakura-card bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                                    <CardHeader className="pb-2 bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <Code2 className="h-5 w-5 text-[#D6A4A4]" />
                                                    <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{project.title}</CardTitle>
                                                </div>
                                                {(user.role === 'teacher' || user.role === 'admin') && project.user && (
                                                    <CardDescription className="text-sm font-medium mt-1 flex items-center text-[#D6A4A4]">
                                                        By {project.user.username}
                                                    </CardDescription>
                                                )}
                                                <CardDescription className="text-sm font-medium mt-1 flex items-center text-gray-600 dark:text-gray-300">
                                                    {format(new Date(project.start_date), 'MMM yyyy')} - {format(new Date(project.end_date), 'MMM yyyy')}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 pb-6 bg-white/50 dark:bg-gray-800/50">
                                        <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{project.description}</p>
                                    </CardContent>
                                    {user.role === 'student' && (
                                        <div className="bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                                            <div className="flex justify-center border-t border-gray-100 dark:border-gray-700">
                                                <div 
                                                    className="flex items-center gap-2 text-[#FF6B6B] p-4 cursor-pointer hover:opacity-80"
                                                    onClick={() => handleDeleteProject(project.id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                    <span>Delete</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </MainLayout>
        </ProtectedRoute>
    );
};

export default Projects;
