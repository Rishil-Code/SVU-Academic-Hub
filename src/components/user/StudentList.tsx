
import React from "react";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface StudentListProps {
  students: User[];
}

export function StudentList({ students }: StudentListProps) {
  const { deleteUser } = useAuth();

  const handleDeleteUser = (userId: string) => {
    if (deleteUser(userId)) {
      toast.success("Student deleted successfully");
    }
  };

  if (students.length === 0) {
    return (
      <div className="text-center p-6 text-purple-200">
        No students found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-3 rounded-md bg-purple-700/30 border border-purple-500/30"
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-haikyu-orange text-white flex items-center justify-center font-medium">
              {student.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-white">{student.name}</p>
              <p className="text-sm text-purple-200">
                {student.program} - {student.branch}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-purple-200">Roll: {student.rollNo}</div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-purple-700/50 hover:text-red-300">
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Student</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {student.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteUser(student.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
