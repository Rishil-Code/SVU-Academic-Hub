import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code2, Calendar, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { api, Project } from '../utils/api';

interface ProjectFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export default function TempProjects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadProjects();
        }
    }, [user?.id]);

    const loadProjects = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const data = await api.getProjects(Number(user.id));
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setIsSubmitting(true);
        try {
            const response = await api.addProject({
                ...formData,
                user_id: Number(user.id),
            });

            if (response.success) {
                const newProject: Project = {
                    id: response.id,
                    title: formData.title,
                    description: formData.description,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    user_id: Number(user.id)
                };
                
                setProjects(prev => [...prev, newProject]);
                setOpen(false);
                setFormData({
                    title: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                });
                toast.success('Project added successfully');
            }
        } catch (error) {
            console.error("Error adding project:", error);
            toast.error("Failed to add project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Dialog open={open} onOpenChange={setOpen}>
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
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Project Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g., E-commerce Website, Mobile App, etc."
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-white dark:bg-gray-800"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate" className="text-gray-800 dark:text-gray-200">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="input-field bg-white dark:bg-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate" className="text-gray-800 dark:text-gray-200">End Date</Label>
                                        <Input
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            required
                                            className="input-field bg-white dark:bg-gray-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your project, technologies used, and your role..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-white dark:bg-gray-800"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="btn-sakura" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Project'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                    <Code2 className="h-12 w-12 text-[#D6A4A4] mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No projects yet</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Add your first project to showcase your skills
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
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-3 w-3" />
                                        <span className="text-xs">
                                            {format(new Date(project.startDate), 'MMM yyyy')} - {format(new Date(project.endDate), 'MMM yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{project.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 