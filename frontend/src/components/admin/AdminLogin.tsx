import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password");
      return;
    }

    const success = onLogin(password);
    if (!success) {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <LockKeyhole className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-medium text-center mb-6">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter admin password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Default password for demo: admin123
              </p>
            </div>
            
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
