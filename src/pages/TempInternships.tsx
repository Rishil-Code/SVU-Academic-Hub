import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Calendar, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { api, Internship } from '../utils/api';

interface InternshipFormData {
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
}

export default function TempInternships() {
    const { user } = useAuth();
    const [internships, setInternships] = useState<Internship[]>([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<InternshipFormData>({
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadInternships();
        }
    }, [user?.id]);

    const loadInternships = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const data = await api.getInternships(Number(user.id));
            setInternships(data);
        } catch (error) {
            console.error('Error loading internships:', error);
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
            const response = await api.addInternship({
                ...formData,
                user_id: Number(user.id),
            });

            if (response.success) {
                const newInternship: Internship = {
                    id: response.id,
                    company: formData.company,
                    position: formData.position,
                    description: formData.description,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    user_id: Number(user.id)
                };
                
                setInternships(prev => [...prev, newInternship]);
                setOpen(false);
                setFormData({
                    company: "",
                    position: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                });
                toast.success('Internship added successfully');
            }
        } catch (error) {
            console.error("Error adding internship:", error);
            toast.error("Failed to add internship. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Internships</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="btn-sakura">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Internship
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sakura-card sm:max-w-[550px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-gray-800 dark:text-white">Add New Internship</DialogTitle>
                                <DialogDescription>
                                    Enter details about your internship experience
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-gray-800 dark:text-gray-200">Company Name</Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        placeholder="e.g., Google, Microsoft, etc."
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-white dark:bg-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position" className="text-gray-800 dark:text-gray-200">Position</Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        placeholder="e.g., Software Engineer Intern"
                                        value={formData.position}
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
                                        placeholder="Describe your responsibilities and achievements..."
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
                                        'Add Internship'
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
            ) : internships.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                    <Briefcase className="h-12 w-12 text-[#D6A4A4] mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No internships yet</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Add your first internship to showcase your experience
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {internships.map((internship) => (
                        <Card key={internship.id} className="sakura-card bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-2 bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <Briefcase className="h-5 w-5 text-[#D6A4A4]" />
                                            <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{internship.position}</CardTitle>
                                        </div>
                                        <CardDescription className="text-sm font-medium mt-1 flex items-center text-gray-600 dark:text-gray-300">
                                            {internship.company}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-3 w-3" />
                                        <span className="text-xs">
                                            {format(new Date(internship.startDate), 'MMM yyyy')} - {format(new Date(internship.endDate), 'MMM yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{internship.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 