
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { GraduationCap, Loader2, AlertCircle, FileSpreadsheet } from "lucide-react";

export default function Results() {
  const { user } = useAuth();
  const { academicRecords, calculateCGPA } = useAcademic();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Force reload academic records when the component mounts
  useEffect(() => {
    try {
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Force a re-render to get latest data
        setSelectedSemester("");
      }, 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error loading academic records:", err);
      setError("Failed to load academic records. Please refresh the page.");
      setIsLoading(false);
    }
  }, []);

  console.log("Academic Records:", academicRecords);
  console.log("User ID:", user?.id);
  
  // Ensure we're getting the correct student records
  const studentRecords = user ? (academicRecords[user.id] || []) : [];
  console.log("Student Records:", studentRecords);
  
  const cgpa = user ? calculateCGPA(user.id) : 0;
  
  // Get the selected semester record
  const semesterRecord = selectedSemester 
    ? studentRecords.find(record => record.semester === parseInt(selectedSemester))
    : studentRecords.length > 0 ? studentRecords[0] : null;

  // Set first semester as default if no selection and we have records
  useEffect(() => {
    if (studentRecords.length > 0 && !selectedSemester) {
      setSelectedSemester(studentRecords[0].semester.toString());
    }
  }, [studentRecords, selectedSemester]);
    
  // Prepare data for pie chart
  const getPerformanceData = () => {
    if (!semesterRecord) return [];
    
    const subjectPerformance = semesterRecord.subjects.map(subject => {
      const totalMarks = subject.mid1 !== null && subject.mid2 !== null && subject.semExam !== null
        ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
        : 0;
      return {
        name: subject.name,
        value: totalMarks,
      };
    });
    
    return subjectPerformance;
  };
  
  const COLORS = ['#D6A4A4', '#6D6875', '#B392AC', '#F4A9A8', '#8785A2'];
  
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <MainLayout>
        <div className="space-y-6 w-full max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/40 dark:bg-[#D6A4A4]/40 px-4 py-1 rounded-full inline-block text-gray-800 dark:text-white">Academic Results</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 ml-2">
                View your semester-wise academic performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-[#F4F4F9]/80 dark:bg-[#282836]/80 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your CGPA:</span>{" "}
                <span className="text-lg font-bold text-[#D6A4A4] dark:text-[#D6A4A4]">{cgpa}</span>
              </div>
              <DarkModeToggle />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading your academic records...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center max-w-md">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : studentRecords && studentRecords.length > 0 ? (
            <>
              <Card className="sakura-card bg-white dark:bg-[#282836]">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white bg-[#D6A4A4]/30 px-2 py-1 rounded-lg inline-block">Select Semester</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">Choose a semester to view detailed results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="w-full sm:w-[200px] input-field bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {studentRecords.map(record => (
                        <SelectItem 
                          key={record.semester} 
                          value={record.semester.toString()}
                          className="text-gray-800 dark:text-gray-200"
                        >
                          Semester {record.semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              {semesterRecord ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="sakura-card bg-white dark:bg-[#282836]">
                    <CardHeader className="bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/30 border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-gray-800 dark:text-white bg-[#D6A4A4]/30 px-2 py-1 rounded-lg inline-block">Marks Breakdown</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        Semester {semesterRecord.semester} - 
                        <span className="ml-1 font-medium text-[#D6A4A4]">SGPA: {semesterRecord.sgpa}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader className="bg-[#F4F4F9]/50 dark:bg-gray-800/50">
                          <TableRow>
                            <TableHead className="text-gray-700 dark:text-gray-300">Subject</TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300">Mid 1</TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300">Mid 2</TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300">Sem Exam</TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semesterRecord.subjects.map((subject, index) => {
                            const totalMarks = subject.mid1 !== null && subject.mid2 !== null && subject.semExam !== null
                              ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
                              : null;
                              
                            return (
                              <TableRow key={index} className="hover:bg-[#F4F4F9]/70 dark:hover:bg-gray-800/30">
                                <TableCell className="font-medium text-gray-700 dark:text-gray-300">{subject.name}</TableCell>
                                <TableCell className="text-right text-gray-600 dark:text-gray-400">{subject.mid1 ?? 'N/A'}</TableCell>
                                <TableCell className="text-right text-gray-600 dark:text-gray-400">{subject.mid2 ?? 'N/A'}</TableCell>
                                <TableCell className="text-right text-gray-600 dark:text-gray-400">{subject.semExam ?? 'N/A'}</TableCell>
                                <TableCell className="text-right font-bold text-gray-800 dark:text-white">
                                  {totalMarks ? totalMarks.toFixed(0) : 'N/A'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-6">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white px-2 py-1 rounded bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/20 inline-block">Laboratory Exams</h3>
                        {semesterRecord.labs && semesterRecord.labs.length > 0 ? (
                          <Table>
                            <TableHeader className="bg-[#F4F4F9]/50 dark:bg-gray-800/50">
                              <TableRow>
                                <TableHead className="text-gray-700 dark:text-gray-300">Lab</TableHead>
                                <TableHead className="text-right text-gray-700 dark:text-gray-300">Marks</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {semesterRecord.labs.map((lab, index) => (
                                <TableRow key={index} className="hover:bg-[#F4F4F9]/70 dark:hover:bg-gray-800/30">
                                  <TableCell className="font-medium text-gray-700 dark:text-gray-300">{lab.name}</TableCell>
                                  <TableCell className="text-right text-gray-800 dark:text-white font-semibold">{lab.marks ?? 'N/A'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="empty-state p-4">
                            <p className="text-gray-600 dark:text-gray-400">No laboratory courses for this semester</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="sakura-card bg-white dark:bg-[#282836]">
                    <CardHeader className="bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/30 border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-gray-800 dark:text-white bg-[#D6A4A4]/30 px-2 py-1 rounded-lg inline-block">Performance Analysis</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">Visual representation of your marks</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {getPerformanceData().length > 0 ? (
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getPerformanceData()}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {getPerformanceData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#333' }} />
                              <Legend formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <p className="text-gray-600 dark:text-gray-300">Not enough data for visualization</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="sakura-card bg-white dark:bg-[#282836]">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      {studentRecords.length > 0 
                        ? "Please select a semester to view results" 
                        : "No academic records found"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="sakura-card bg-[#F4F4F9]/50 dark:bg-[#282836]/50">
              <CardContent className="p-8 text-center">
                <div className="empty-state">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#F4F4F9] dark:bg-gray-800 flex items-center justify-center mb-4">
                    <FileSpreadsheet className="h-6 w-6 text-[#D6A4A4]" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">No results found yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mt-2">
                    Your academic records have not been added yet. Please check back later or contact your teacher.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
