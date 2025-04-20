
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";

interface TeacherFormProps {
  formData: {
    id: string;
    name: string;
    password: string;
    department: string;
    gender: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  availableDepartments: string[];
}

export function TeacherForm({
  formData,
  handleChange,
  handleSelectChange,
  showPassword,
  togglePasswordVisibility,
  availableDepartments
}: TeacherFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id" className="text-gray-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-800/60 px-2 py-1 rounded-md">Teacher ID</Label>
          <Input
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="teacher1"
            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-800/60 px-2 py-1 rounded-md">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-800/60 px-2 py-1 rounded-md">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20 pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department" className="text-gray-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-800/60 px-2 py-1 rounded-md">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => handleSelectChange("department", value)}
          >
            <SelectTrigger id="department" className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {availableDepartments.map(department => (
                <SelectItem key={department} value={department}>{department}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-gray-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-800/60 px-2 py-1 rounded-md">Gender</Label>
          <RadioGroup
            defaultValue={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
            className="flex space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" className="text-[#D6A4A4] border-[#D6A4A4]" />
              <Label htmlFor="male" className="text-gray-700 dark:text-gray-200">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" className="text-[#D6A4A4] border-[#D6A4A4]" />
              <Label htmlFor="female" className="text-gray-700 dark:text-gray-200">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" className="text-[#D6A4A4] border-[#D6A4A4]" />
              <Label htmlFor="other" className="text-gray-700 dark:text-gray-200">Other</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );
}
