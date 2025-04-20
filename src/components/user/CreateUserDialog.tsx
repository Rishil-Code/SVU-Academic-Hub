
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, Program } from "@/types/user";
import { toast } from "sonner";
import { RoleSelector } from "@/components/user/forms/RoleSelector";
import { TeacherForm } from "@/components/user/forms/TeacherForm";
import { StudentForm } from "@/components/user/forms/StudentForm";
import { useUserForm } from "@/hooks/useUserForm";

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Define program and department structure
const programDepartments = {
  "BTech": [
    "Computer Science and Engineering (CSE)",
    "Information Technology (IT)",
    "Electronics and Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical Engineering",
    "Civil Engineering",
    "Artificial Intelligence & Data Science",
    "Agriculture Engineering"
  ],
  "MTech": [
    "Computer Science and Engineering (CSE)",
    "VLSI",
    "Structural Engineering",
    "Power Systems"
  ],
  "BSc": [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biotechnology"
  ],
  "MSc": [
    "Computer Science",
    "Mathematics",
    "Organic Chemistry",
    "Physics"
  ],
  "BCA": ["General"],
  "MCA": ["General"],
  "BBA": ["General", "Business Administration"],
  "MBA": [
    "HR",
    "Finance",
    "Marketing"
  ],
  "BA": [
    "English",
    "History",
    "Political Science"
  ],
  "MA": [
    "English",
    "Public Administration"
  ],
  "Diploma": [
    "Electronics and Communication Engineering (ECE)",
    "Mechanical Engineering",
    "Civil Engineering",
    "Computer Science and Engineering (CSE)"
  ]
};

export function CreateUserDialog({ open, setOpen }: CreateUserDialogProps) {
  const { createUser } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const { formData, handleChange, handleSelectChange, resetForm, showPassword, togglePasswordVisibility } = useUserForm();
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  // Update available departments when program changes
  useEffect(() => {
    if (role === "student" && formData.program) {
      const departments = programDepartments[formData.program as keyof typeof programDepartments] || [];
      setAvailableDepartments(departments);
      // If the current branch is not in the new list of departments, reset it
      if (formData.branch && !departments.includes(formData.branch)) {
        handleSelectChange("branch", departments.length > 0 ? departments[0] : "");
      }
    } else if (role === "teacher") {
      // Combine all departments for teachers
      const allDepartments = Object.values(programDepartments).flat();
      // Remove duplicates
      setAvailableDepartments([...new Set(allDepartments)]);
    }
  }, [role, formData.program]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast.error("User ID is required");
      return;
    }
    
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    
    if (!formData.gender) {
      toast.error("Gender is required");
      return;
    }
    
    if (role === "teacher" && !formData.department) {
      toast.error("Department is required for teachers");
      return;
    }
    
    if (role === "student") {
      if (!formData.rollNo) {
        toast.error("Roll Number is required for students");
        return;
      }
      if (!formData.branch) {
        toast.error("Branch is required for students");
        return;
      }
    }
    
    const userData = {
      ...formData,
      role,
      program: formData.program as Program, // Cast to Program type
      gender: formData.gender as "male" | "female" | "other",
    };
    
    createUser(userData);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-[#282836] shadow-md rounded-2xl p-6 text-[#2B2D42] dark:text-gray-200 max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-white bg-[#D6A4A4]/30 px-3 py-1 rounded-full inline-block">Create New User</DialogTitle>
            <DialogDescription className="text-[#6D6875] dark:text-gray-300">
              Add a new teacher or student account to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RoleSelector role={role} setRole={setRole} />
            
            {role === "teacher" ? 
              <TeacherForm 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                availableDepartments={availableDepartments}
              /> : 
              <StudentForm 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                programDepartments={programDepartments}
                availableDepartments={availableDepartments}
              />
            }
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#D6A4A4] hover:bg-[#C98C8C] text-white font-medium rounded-xl px-4 py-2">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
