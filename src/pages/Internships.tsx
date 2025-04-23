import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Calendar, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";
import { api, Internship } from '../utils/api';

interface InternshipFormData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  user_id: number;
}

export default function Internships() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InternshipFormData>({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    user_id: 0
  });

  const loadInternships = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getInternships(Number(user.id));
      setInternships(data);
    } catch (err) {
      console.error('Error loading internships:', err);
      setError('Failed to load internships. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
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
    if (!user) return;

    try {
      setIsSubmitting(true);
      const response = await api.addInternship({
        ...formData,
        user_id: Number(user.id)
      });
      
      if (response.success) {
        toast.success('Internship added successfully');
        setFormData({
          company: '',
          position: '',
          description: '',
          start_date: '',
          end_date: '',
          user_id: 0
        });
        loadInternships();
      }
    } catch (err) {
      console.error('Error adding internship:', err);
      toast.error('Failed to add internship. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInternship = async (id: number) => {
    if (!user) return;

    try {
      const response = await api.deleteInternship(id);
      if (response.success) {
        toast.success('Internship deleted successfully');
        loadInternships();
      }
    } catch (err) {
      console.error('Error deleting internship:', err);
      toast.error('Failed to delete internship. Please try again.');
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-4 py-1 rounded-full inline-block text-gray-800 dark:text-white">
              {user.role === 'student' ? "My Internships" : "Student Internships"}
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1 ml-2">
              {user.role === 'student' 
                ? "Track your internship experiences and professional growth" 
                : "View student internship experiences"}
            </p>
          </div>
          {user.role === 'student' && (
            <Dialog>
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
                        <Label htmlFor="start_date" className="text-gray-800 dark:text-gray-200">Start Date</Label>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={handleChange}
                          required
                          className="input-field bg-white dark:bg-gray-800"
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
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                onClick={loadInternships}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
          </div>
        ) : internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
            <Briefcase className="h-12 w-12 text-[#D6A4A4] mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No internships yet</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.role === 'student' 
                ? "Add your first internship to showcase your experience" 
                : "No internships have been added yet"}
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
                      {(user.role === 'teacher' || user.role === 'admin') && internship.user && (
                        <CardDescription className="text-sm font-medium mt-1 flex items-center text-[#D6A4A4]">
                          By {internship.user.username}
                        </CardDescription>
                      )}
                      <CardDescription className="text-sm font-medium mt-1 flex items-center text-gray-600 dark:text-gray-300">
                        {internship.company}
                      </CardDescription>
                      <CardDescription className="text-sm font-medium mt-1 flex items-center text-gray-500 dark:text-gray-400">
                        {format(new Date(internship.start_date), 'MMM yyyy')} - {format(new Date(internship.end_date), 'MMM yyyy')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-6 bg-white/50 dark:bg-gray-800/50">
                  <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{internship.description}</p>
                </CardContent>
                {user.role === 'student' && (
                  <div className="bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                    <div className="flex justify-center border-t border-gray-100 dark:border-gray-700">
                      <div 
                        className="flex items-center gap-2 text-[#FF6B6B] p-4 cursor-pointer hover:opacity-80"
                        onClick={() => handleDeleteInternship(internship.id)}
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
  );
}
