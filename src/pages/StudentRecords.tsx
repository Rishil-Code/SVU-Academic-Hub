import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { Search, Info, AlertCircle, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api, Project, Internship } from "@/utils/api";

export default function StudentRecords() {
  const { users, user: currentUser } = useAuth();
  const { academicRecords, calculateCGPA } = useAcademic();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Filter students by department if teacher is viewing
  const studentUsers = users.filter(user => {
    if (user.role !== "student") return false;
    
    // If current user is a teacher, only show students from the same department
    if (currentUser?.role === "teacher" && currentUser.department) {
      return user.branch === currentUser.department;
    }
    
    return true;
  });
  
  const filteredStudents = studentUsers.filter(
    student => student.name.toLowerCase().includes(search.toLowerCase()) ||
              (student.rollNo || "").toLowerCase().includes(search.toLowerCase())
  );

  // Load student data when selected
  useEffect(() => {
    const loadStudentData = async () => {
      if (!selectedStudent) {
        setProjects([]);
        setInternships([]);
        return;
      }

      setIsLoadingData(true);
      try {
        const [projectsData, internshipsData] = await Promise.all([
          api.getProjects(Number(selectedStudent)),
          api.getInternships(Number(selectedStudent))
        ]);
        setProjects(projectsData);
        setInternships(internshipsData);
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadStudentData();
  }, [selectedStudent]);
  
  // Use effect to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const COLORS = ['#F4A261', '#2B3A67', '#F9C784', '#1A1F2C', '#E76F51'];
  
  // Get the selected student's data
  const selectedStudentData = selectedStudent 
    ? studentUsers.find(s => s.id === selectedStudent)
    : null;
    
  const studentAcademicRecords = selectedStudent 
    ? academicRecords[selectedStudent] || []
    : [];
    
  const cgpa = selectedStudent ? calculateCGPA(selectedStudent) : 0;
  
  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/40 dark:bg-[#D6A4A4]/40 px-4 py-1 rounded-full inline-block text-gray-800 dark:text-white">Student Records</h1>
              <p className="text-gray-500 dark:text-gray-300 mt-1 ml-2">
                View detailed academic records for all students
              </p>
            </div>
            
            {currentUser?.role === "teacher" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm flex items-start max-w-xs">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-300">
                  You're seeing students from your department: <span className="font-semibold">{currentUser.department}</span>
                </p>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading student records...</span>
            </div>
          ) : filteredStudents.length === 0 && currentUser?.role === "teacher" ? (
            <Card className="p-8 text-center bg-[#F4F4F9]/50 dark:bg-[#282836]/50">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#F4F4F9] dark:bg-gray-800 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-[#D6A4A4]" />
              </div>
              <h3 className="text-lg font-medium mb-2 bg-[#D6A4A4]/40 dark:bg-[#D6A4A4]/40 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">No students found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                There are no students in your department yet. Students will appear here once they are assigned to your department.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Student List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search students..."
                        className="pl-8 bg-white dark:bg-gray-800"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                          <Button
                            key={student.id}
                            variant="outline"
                            className={`w-full justify-start text-left ${selectedStudent === student.id ? 'bg-[#D6A4A4]/20 border-[#D6A4A4] text-gray-800 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                            onClick={() => setSelectedStudent(student.id)}
                          >
                            <div className="h-6 w-6 rounded-full bg-[#D6A4A4] text-white flex items-center justify-center text-xs font-medium mr-2">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{student.rollNo} - {student.branch}</p>
                            </div>
                          </Button>
                        ))
                      ) : (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                          No students found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                {selectedStudentData ? (
                  <Tabs defaultValue="academic">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedStudentData.name}</CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {selectedStudentData.program} - {selectedStudentData.branch} | Roll No: {selectedStudentData.rollNo}
                          </p>
                        </div>
                        <div className="bg-[#D6A4A4]/40 text-[#8C4F4F] dark:text-white px-3 py-1 rounded-full text-sm font-medium">
                          CGPA: {cgpa}
                        </div>
                      </div>
                      <TabsList className="mt-4">
                        <TabsTrigger value="academic">Academic Records</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="internships">Internships</TabsTrigger>
                      </TabsList>
                    </CardHeader>
                    
                    <CardContent>
                      <TabsContent value="academic">
                        {studentAcademicRecords.length > 0 ? (
                          <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Semester Performance</h3>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={studentAcademicRecords.map(record => ({
                                        semester: `Sem ${record.semester}`,
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
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Subject Distribution</h3>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={studentAcademicRecords[0]?.subjects.map(subject => ({
                                          name: subject.name,
                                          value: subject.mid1 && subject.mid2 && subject.semExam 
                                            ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
                                            : 0
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name }) => name}
                                      >
                                        {studentAcademicRecords[0]?.subjects.map((_, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                      </Pie>
                                      <Tooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Semester Details</h3>
                              <Table>
                                <TableHeader className="bg-[#F4F4F9]/50 dark:bg-gray-800/50">
                                  <TableRow>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead>Labs</TableHead>
                                    <TableHead className="text-right">SGPA</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {studentAcademicRecords.map(record => (
                                    <TableRow key={record.semester} className="hover:bg-[#F4F4F9]/70 dark:hover:bg-gray-800/30">
                                      <TableCell className="font-medium text-gray-700 dark:text-gray-300">Semester {record.semester}</TableCell>
                                      <TableCell className="text-gray-600 dark:text-gray-400">{record.subjects.length}</TableCell>
                                      <TableCell className="text-gray-600 dark:text-gray-400">{record.labs.length}</TableCell>
                                      <TableCell className="text-right font-bold text-gray-800 dark:text-white">{record.sgpa}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                            <div className="mx-auto w-12 h-12 rounded-full bg-[#F4F4F9] dark:bg-gray-800 flex items-center justify-center mb-4">
                              <AlertCircle className="h-6 w-6 text-[#D6A4A4]" />
                            </div>
                            <h3 className="text-lg font-medium mb-2 bg-[#D6A4A4]/40 dark:bg-[#D6A4A4]/40 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">No academic records</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              No academic records found for this student.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="projects">
                        {isLoadingData ? (
                          <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
                            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading projects...</span>
                          </div>
                        ) : projects.length > 0 ? (
                          <div className="space-y-4">
                            {projects.map(project => (
                              <div 
                                key={project.id}
                                className="p-4 border rounded-md bg-[#F4F4F9]/70 dark:bg-[#282836]/70"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium text-gray-800 dark:text-white">{project.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-xs px-2 py-1 rounded-full bg-[#D6A4A4]/40 text-[#8C4F4F] dark:text-white">
                                    Project
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                            <div className="mx-auto w-12 h-12 rounded-full bg-[#F4F4F9] dark:bg-gray-800 flex items-center justify-center mb-4">
                              <AlertCircle className="h-6 w-6 text-[#D6A4A4]" />
                            </div>
                            <h3 className="text-lg font-medium mb-2 bg-[#D6A4A4]/40 dark:bg-[#D6A4A4]/40 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">No projects</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              No projects found for this student.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="internships">
                        {isLoadingData ? (
                          <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
                            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading internships...</span>
                          </div>
                        ) : internships.length > 0 ? (
                          <div className="space-y-4">
                            {internships.map(internship => (
                              <div 
                                key={internship.id}
                                className="p-4 border rounded-md bg-[#F4F4F9]/70 dark:bg-[#282836]/70"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium text-gray-800 dark:text-white">{internship.company}</h3>
                                    <p className="text-sm font-medium text-[#D6A4A4]">
                                      {internship.position}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(internship.start_date).toLocaleDateString()} - {new Date(internship.end_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-xs px-2 py-1 rounded-full bg-[#D6A4A4]/40 text-[#8C4F4F] dark:text-white">
                                    Internship
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{internship.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
                            <div className="mx-auto w-12 h-12 rounded-full bg-[#F4F4F9] dark:bg-gray-800 flex items-center justify-center mb-4">
                              <AlertCircle className="h-6 w-6 text-[#D6A4A4]" />
                            </div>
                            <h3 className="text-lg font-medium mb-2 bg-[#D6A4A4]/40 dark:bg-[#D6A4A4]/40 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">No internships</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              No internships found for this student.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                ) : (
                  <CardContent className="flex items-center justify-center h-full min-h-[300px]">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a student to view their records
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
