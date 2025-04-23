import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcademic } from "@/contexts/AcademicContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, Award, Users, GraduationCap, Briefcase, Code2 } from "lucide-react";
import { api, Project, Internship } from "@/utils/api";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function Dashboard() {
  const { user } = useAuth();
  const { academicRecords, calculateCGPA } = useAcademic();
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [internshipsData, setInternshipsData] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        if (user.role === 'teacher') {
          // For teachers, fetch all students' data
          const [projectsData, internshipsData] = await Promise.all([
            api.getProjects(0),  // Using 0 to indicate all projects
            api.getInternships(0)  // Using 0 to indicate all internships
          ]);
          setProjectsData(projectsData);
          setInternshipsData(internshipsData);
        } else {
          // For students, fetch only their own data
          const [projectsData, internshipsData] = await Promise.all([
            api.getProjects(Number(user.id)),
            api.getInternships(Number(user.id))
          ]);
          setProjectsData(projectsData);
          setInternshipsData(internshipsData);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);
  
  if (!user) return null;
  
  // Admin Dashboard
  const AdminDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-[#D6A4A4] mr-2" />
                <div className="text-2xl font-bold">1</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 text-[#D6A4A4] mr-2" />
                <div className="text-2xl font-bold">1</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="sakura-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System activity in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 text-muted-foreground">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Teacher Dashboard
  const TeacherDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-[#D6A4A4]" />
                <div className="text-2xl font-bold">{projectsData.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Internships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-[#D6A4A4]" />
                <div className="text-2xl font-bold">{internshipsData.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {Math.max(projectsData.length, internshipsData.length) > 0 ? (
                  <div className="space-y-1">
                    {projectsData[projectsData.length - 1] && (
                      <div>New project: {projectsData[projectsData.length - 1].title}</div>
                    )}
                    {internshipsData[internshipsData.length - 1] && (
                      <div>New internship: {internshipsData[internshipsData.length - 1].company}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No recent updates</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="sakura-card">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest student projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No projects added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {projectsData.slice(-3).reverse().map(project => (
                    <div key={project.id} className="flex items-start space-x-3">
                      <Code2 className="h-5 w-5 text-[#D6A4A4] mt-0.5" />
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="sakura-card">
            <CardHeader>
              <CardTitle>Recent Internships</CardTitle>
              <CardDescription>Latest student internships</CardDescription>
            </CardHeader>
            <CardContent>
              {internshipsData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No internships added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {internshipsData.slice(-3).reverse().map(internship => (
                    <div key={internship.id} className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-[#D6A4A4] mt-0.5" />
                      <div>
                        <div className="font-medium">{internship.position}</div>
                        <div className="text-sm text-muted-foreground">
                          {internship.company} • {new Date(internship.start_date).toLocaleDateString()} - {new Date(internship.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Student Dashboard
  const StudentDashboard = () => {
    const studentRecords = academicRecords[user.id] || [];
    const cgpa = calculateCGPA(user.id);
    
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Student ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{user.id}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold capitalize">{user.role}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                CGPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cgpa}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-[#D6A4A4]" />
                <div className="text-2xl font-bold">{projectsData.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Internships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-[#D6A4A4]" />
                <div className="text-2xl font-bold">{internshipsData.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="sakura-card">
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>SGPA across semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={studentRecords.map(record => ({
                      semester: `Semester ${record.semester}`,
                      sgpa: record.sgpa || 0
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="sgpa" fill="#D6A4A4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest technical achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No projects added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {projectsData.slice(-3).reverse().map(project => (
                    <div key={project.id} className="flex items-start space-x-3">
                      <Code2 className="h-5 w-5 text-[#D6A4A4] mt-0.5" />
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Render dashboard based on user role
  const getDashboardByRole = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="hidden md:block">
            <DarkModeToggle />
          </div>
        </div>
        
        {getDashboardByRole()}
      </div>
    </MainLayout>
  );
}
