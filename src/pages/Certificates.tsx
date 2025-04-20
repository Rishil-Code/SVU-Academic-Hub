import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { api, Certificate } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, Award, School, Calendar } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { format } from 'date-fns';

interface CertificateFormData {
    title: string;
    issuer: string;
    date_issued: string;
}

const Certificates: React.FC = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCertificate, setNewCertificate] = useState<CertificateFormData>({
        title: '',
        issuer: '',
        date_issued: '',
    });

    useEffect(() => {
        if (user?.id) {
            loadCertificates();
        }
    }, [user?.id]);

    const loadCertificates = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const data = await api.getCertificates(Number(user.id));
            setCertificates(data);
        } catch (error) {
            console.error('Error loading certificates:', error);
            toast({
                title: 'Error',
                description: 'Failed to load certificates',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setIsSubmitting(true);
        try {
            const response = await api.addCertificate({
                ...newCertificate,
                user_id: Number(user.id),
            });

            if (response.success) {
                await loadCertificates();
                setNewCertificate({ title: '', issuer: '', date_issued: '' });
                setIsDialogOpen(false);
                toast({
                    title: 'Success',
                    description: 'Certificate added successfully',
                });
            }
        } catch (error) {
            console.error('Error adding certificate:', error);
            toast({
                title: 'Error',
                description: 'Failed to add certificate',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCertificate = async (id: number) => {
        try {
            const response = await api.deleteCertificate(id);
            if (response.success) {
                setCertificates(certificates.filter(cert => cert.id !== id));
                toast({
                    title: 'Success',
                    description: 'Certificate deleted successfully',
                });
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete certificate',
                variant: 'destructive',
            });
        }
    };

    const getPageTitle = () => {
        if (user?.role === 'student') {
            return "My Certificates";
        } else if (user?.role === 'teacher') {
            return "Student Certificates";
        } else {
            return "All Certificates";
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D6A4A4]"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Loading certificates...</span>
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
                            {getPageTitle()}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-300 mt-1 ml-2">
                            {user?.role === 'student' 
                                ? "Manage your professional certifications and achievements" 
                                : "View student certifications and achievements"}
                        </p>
                    </div>
                    {user?.role === 'student' && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="btn-sakura">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Certificate
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sakura-card bg-white dark:bg-gray-800 sm:max-w-[550px]">
                                <DialogHeader>
                                    <DialogTitle className="text-gray-800 dark:text-white">Add New Certificate</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddCertificate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Certificate Title</Label>
                                        <Input
                                            id="title"
                                            value={newCertificate.title}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                            required
                                            className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="issuer" className="text-gray-800 dark:text-gray-200">Issuing Authority</Label>
                                        <Input
                                            id="issuer"
                                            value={newCertificate.issuer}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                                            required
                                            className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_issued" className="text-gray-800 dark:text-gray-200">Issue Date</Label>
                                        <Input
                                            id="date_issued"
                                            type="date"
                                            value={newCertificate.date_issued}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, date_issued: e.target.value })}
                                            required
                                            className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full btn-sakura"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Certificate'
                                        )}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {certificates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                        <Award className="h-12 w-12 text-[#D6A4A4] mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No certificates yet</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {user?.role === 'student' 
                                ? "Add your first certificate to showcase your achievements" 
                                : "No certificates have been added yet"}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {certificates.map((certificate) => (
                            <Card key={certificate.id} className="sakura-card bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-2 bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <Award className="h-5 w-5 text-[#D6A4A4]" />
                                                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{certificate.title}</CardTitle>
                                            </div>
                                            <CardDescription className="text-sm font-medium mt-1 flex items-center text-gray-600 dark:text-gray-300">
                                                <School className="h-3 w-3 mr-1" />
                                                {certificate.issuer}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-xs">
                                                {format(new Date(certificate.date_issued), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {user?.role === 'student' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                            onClick={() => handleDeleteCertificate(certificate.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Certificates;
