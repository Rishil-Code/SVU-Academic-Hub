import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/utils/api';

interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  user_id: number;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const loadProjects = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await api.getProjects(user.id);
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await api.addProject({
        ...formData,
        user_id: user.id
      });
      toast.success('Project added successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: ''
      });
      loadProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setShowForm(true)}>Add Project</Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No projects added yet.</p>
          <Button onClick={() => setShowForm(true)}>Add Your First Project</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project.start_date} - {project.end_date}
              </p>
              <p className="mt-2 text-sm">{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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