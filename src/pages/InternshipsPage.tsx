import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import type { Internship, InternshipFormData } from '@/utils/api';

export default function InternshipsPage() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<InternshipFormData, 'user_id'>>({
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  const loadInternships = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await api.getInternships(Number(user.id));
      setInternships(data);
    } catch (error) {
      console.error('Error loading internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadInternships();
  }, [loadInternships]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await api.addInternship({
        ...formData,
        user_id: Number(user.id)
      });
      toast.success('Internship added successfully!');
      setShowForm(false);
      setFormData({
        company: '',
        position: '',
        start_date: '',
        end_date: '',
        description: ''
      });
      loadInternships();
    } catch (error) {
      console.error('Error adding internship:', error);
      toast.error('Failed to add internship');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Internships</h1>
        <Button onClick={() => setShowForm(true)}>Add Internship</Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : internships.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No internships added yet.</p>
          <Button onClick={() => setShowForm(true)}>Add Your First Internship</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {internships.map((internship) => (
            <div key={internship.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-semibold">{internship.position}</h3>
              <p className="text-gray-600 dark:text-gray-300">{internship.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {internship.start_date} - {internship.end_date}
              </p>
              <p className="mt-2 text-sm">{internship.description}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Internship</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 