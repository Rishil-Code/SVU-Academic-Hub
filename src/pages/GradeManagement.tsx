
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic, Subject, Laboratory } from "@/contexts/AcademicContext";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Switch } from "@/components/ui/switch";

export default function GradeManagement() {
  const { users } = useAuth();
  const { updateMarks } = useAcademic();
  
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", mid1: null, mid2: null, semExam: null, credits: 4 }
  ]);
  const [labs, setLabs] = useState<Laboratory[]>([
    { name: "", marks: null, credits: 2 }
  ]);
  const [includeLabs, setIncludeLabs] = useState(true);
  
  const studentUsers = users.filter(user => user.role === "student");
  
  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", mid1: null, mid2: null, semExam: null, credits: 4 }]);
  };
  
  const handleRemoveSubject = (index: number) => {
    if (subjects.length > 1) {
      const updatedSubjects = [...subjects];
      updatedSubjects.splice(index, 1);
      setSubjects(updatedSubjects);
    }
  };
  
  const handleSubjectChange = (index: number, field: keyof Subject, value: string) => {
    const updatedSubjects = [...subjects];
    
    if (field === 'name') {
      updatedSubjects[index][field] = value;
    } else if (field === 'credits') {
      updatedSubjects[index][field] = parseInt(value) || 0;
    } else {
      // For marks fields (mid1, mid2, semExam)
      const numValue = value === "" ? null : parseInt(value);
      updatedSubjects[index][field] = numValue as any;
    }
    
    setSubjects(updatedSubjects);
  };
  
  const handleAddLab = () => {
    setLabs([...labs, { name: "", marks: null, credits: 2 }]);
  };
  
  const handleRemoveLab = (index: number) => {
    if (labs.length > 1) {
      const updatedLabs = [...labs];
      updatedLabs.splice(index, 1);
      setLabs(updatedLabs);
    }
  };
  
  const handleLabChange = (index: number, field: keyof Laboratory, value: string) => {
    const updatedLabs = [...labs];
    
    if (field === 'name') {
      updatedLabs[index][field] = value;
    } else if (field === 'credits') {
      updatedLabs[index][field] = parseInt(value) || 0;
    } else {
      // For marks field
      const numValue = value === "" ? null : parseInt(value);
      updatedLabs[index][field] = numValue as any;
    }
    
    setLabs(updatedLabs);
  };
  
  const handleSubmit = () => {
    if (!selectedStudent || !semester) {
      toast.error("Please select a student and semester");
      return;
    }
    
    // Validate subjects
    const invalidSubjects = subjects.some(subject => !subject.name);
    
    if (invalidSubjects) {
      toast.error("Please fill in all subject names");
      return;
    }
    
    // Validate labs only if includeLabs is true
    if (includeLabs) {
      const invalidLabs = labs.some(lab => !lab.name);
      if (invalidLabs) {
        toast.error("Please fill in all lab names or disable labs");
        return;
      }
    }
    
    // Use empty labs array if includeLabs is false
    const labsToSave = includeLabs ? labs : [];
    
    updateMarks(selectedStudent, parseInt(semester), subjects, labsToSave);
  };

  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Grade Management</h1>
          <p className="text-gray-500">
            Upload and manage student marks for each semester
          </p>
          
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-haikyu-orange">
            <CardHeader>
              <CardTitle className="text-white">Select Student and Semester</CardTitle>
              <CardDescription className="text-gray-300">Choose a student and semester to enter or update marks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="student" className="text-white">Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                  >
                    <SelectTrigger id="student" className="bg-slate-700 text-white border-slate-600">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-700">
                      {studentUsers.map(student => (
                        <SelectItem key={student.id} value={student.id} className="hover:bg-slate-700">
                          {student.name} ({student.rollNo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="semester" className="text-white">Semester</Label>
                  <Select
                    value={semester}
                    onValueChange={setSemester}
                  >
                    <SelectTrigger id="semester" className="bg-slate-700 text-white border-slate-600">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-700">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()} className="hover:bg-slate-700">
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedStudent && semester && (
            <>
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-haikyu-orange">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Theory Subjects</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSubject}
                      className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Subject
                    </Button>
                  </div>
                  <CardDescription className="text-gray-300">Enter marks for each subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.map((subject, index) => (
                      <div key={index} className="grid gap-4 sm:grid-cols-12 items-center bg-slate-700/50 p-3 rounded-md">
                        <div className="sm:col-span-4">
                          <Label htmlFor={`subject-${index}`} className="text-white">Subject Name</Label>
                          <Input
                            id={`subject-${index}`}
                            placeholder="e.g., Python Programming"
                            value={subject.name}
                            onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                            className="bg-slate-700 text-white border-slate-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`mid1-${index}`} className="text-white">Mid 1</Label>
                          <Input
                            id={`mid1-${index}`}
                            type="number"
                            placeholder="Max 30"
                            value={subject.mid1 === null ? "" : subject.mid1.toString()}
                            onChange={(e) => handleSubjectChange(index, 'mid1', e.target.value)}
                            min="0"
                            max="30"
                            className="bg-slate-700 text-white border-slate-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`mid2-${index}`} className="text-white">Mid 2</Label>
                          <Input
                            id={`mid2-${index}`}
                            type="number"
                            placeholder="Max 30"
                            value={subject.mid2 === null ? "" : subject.mid2.toString()}
                            onChange={(e) => handleSubjectChange(index, 'mid2', e.target.value)}
                            min="0"
                            max="30"
                            className="bg-slate-700 text-white border-slate-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`sem-${index}`} className="text-white">Sem Exam</Label>
                          <Input
                            id={`sem-${index}`}
                            type="number"
                            placeholder="Max 70"
                            value={subject.semExam === null ? "" : subject.semExam.toString()}
                            onChange={(e) => handleSubjectChange(index, 'semExam', e.target.value)}
                            min="0"
                            max="70"
                            className="bg-slate-700 text-white border-slate-600"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <Label htmlFor={`credits-${index}`} className="text-white">Credits</Label>
                          <Input
                            id={`credits-${index}`}
                            type="number"
                            value={subject.credits.toString()}
                            onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                            min="1"
                            max="5"
                            className="bg-slate-700 text-white border-slate-600"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSubject(index)}
                            disabled={subjects.length <= 1}
                            className="text-red-400 hover:text-red-300 hover:bg-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-haikyu-orange">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <CardTitle className="text-white">Laboratory Exams</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="include-labs" 
                          checked={includeLabs} 
                          onCheckedChange={setIncludeLabs} 
                        />
                        <Label htmlFor="include-labs" className="text-white">Include Labs</Label>
                      </div>
                    </div>
                    {includeLabs && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddLab}
                        className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Lab
                      </Button>
                    )}
                  </div>
                  <CardDescription className="text-gray-300">
                    {includeLabs 
                      ? "Enter marks for each lab" 
                      : "Labs are disabled for this semester"
                    }
                  </CardDescription>
                </CardHeader>
                {includeLabs && (
                  <CardContent>
                    <div className="space-y-4">
                      {labs.map((lab, index) => (
                        <div key={index} className="grid gap-4 sm:grid-cols-12 items-center bg-slate-700/50 p-3 rounded-md">
                          <div className="sm:col-span-6">
                            <Label htmlFor={`lab-${index}`} className="text-white">Lab Name</Label>
                            <Input
                              id={`lab-${index}`}
                              placeholder="e.g., Python Lab"
                              value={lab.name}
                              onChange={(e) => handleLabChange(index, 'name', e.target.value)}
                              className="bg-slate-700 text-white border-slate-600"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Label htmlFor={`lab-marks-${index}`} className="text-white">Marks</Label>
                            <Input
                              id={`lab-marks-${index}`}
                              type="number"
                              placeholder="Max 100"
                              value={lab.marks === null ? "" : lab.marks.toString()}
                              onChange={(e) => handleLabChange(index, 'marks', e.target.value)}
                              min="0"
                              max="100"
                              className="bg-slate-700 text-white border-slate-600"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor={`lab-credits-${index}`} className="text-white">Credits</Label>
                            <Input
                              id={`lab-credits-${index}`}
                              type="number"
                              value={lab.credits.toString()}
                              onChange={(e) => handleLabChange(index, 'credits', e.target.value)}
                              min="1"
                              max="3"
                              className="bg-slate-700 text-white border-slate-600"
                            />
                          </div>
                          <div className="sm:col-span-1 flex items-end justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveLab(index)}
                              disabled={labs.length <= 1}
                              className="text-red-400 hover:text-red-300 hover:bg-slate-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
              
              <div className="flex justify-end">
                <Button className="btn-haikyu" onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Marks
                </Button>
              </div>
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
