
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole } from "@/types/user";

interface RoleSelectorProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function RoleSelector({ role, setRole }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-lg font-semibold text-slate-800 dark:text-gray-100">Select Role</Label>
      <RadioGroup
        value={role}
        onValueChange={(value) => setRole(value as UserRole)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="role-teacher" className="text-[#D6A4A4] border-[#D6A4A4]" />
          <Label htmlFor="role-teacher" className="text-[#2B2D42] dark:text-gray-200">Teacher</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="role-student" className="text-[#D6A4A4] border-[#D6A4A4]" />
          <Label htmlFor="role-student" className="text-[#2B2D42] dark:text-gray-200">Student</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
