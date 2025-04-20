import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = login(userId, password, role);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-white shadow-md rounded-2xl border border-[#E2E2E7]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#2B2D42]">Login</CardTitle>
          <CardDescription className="text-[#6D6875]">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-base text-[#2B2D42] font-medium">Select Role</Label>
            <RadioGroup
              defaultValue={role}
              onValueChange={(value) => setRole(value as UserRole)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" className="text-[#D6A4A4] border-[#D6A4A4]" />
                <Label htmlFor="admin" className="text-[#2B2D42]">Administrator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" className="text-[#D6A4A4] border-[#D6A4A4]" />
                <Label htmlFor="teacher" className="text-[#2B2D42]">Teacher</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" className="text-[#D6A4A4] border-[#D6A4A4]" />
                <Label htmlFor="student" className="text-[#2B2D42]">Student</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-base text-[#2B2D42] font-medium">User ID</Label>
            <Input
              id="userId"
              placeholder={role === 'admin' ? 'administrator1' : `${role}1`}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              required
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base text-[#2B2D42] font-medium">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={role === 'admin' ? 'password123' : "password123"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="input-field pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D6875] hover:text-[#2B2D42]"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {role === 'admin' && (
            <p className="text-xs text-[#6D6875]">
              Administrator credentials: ID: administrator1, Password: password123
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#D6A4A4] hover:bg-[#C98C8C] text-white font-medium rounded-xl px-4 py-2"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
