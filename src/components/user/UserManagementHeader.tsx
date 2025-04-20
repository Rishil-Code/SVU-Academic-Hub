import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateUserDialog } from "@/components/user/CreateUserDialog";

interface UserManagementHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UserManagementHeader({ open, setOpen }: UserManagementHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-4 bg-gradient-to-r from-gray-100/90 to-gray-200/90 dark:from-[#1E1E2F]/90 dark:to-[#2B2D42]/90 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">User Management</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Create and manage student and teacher accounts</p>
      <Button 
        className="bg-[#D6A4A4] hover:bg-[#C98C8C] text-white w-full max-w-[200px] mt-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create User
      </Button>
      <CreateUserDialog open={open} setOpen={setOpen} />
    </div>
  );
}
