"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/base/input"
import { Label } from "@/components/ui/base/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/base/card"
import { twMerge } from 'tailwind-merge';
import Button from '@/components/ui/base/button';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate an authentication delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (username && password) {
          // In a real app, you'd make an API call here.
          console.log('Logging in with:', { username, password });
          // For this example, we'll just simulate success.
          // Replace this with your actual authentication logic
          if (username === 'admin' && password === 'password') {
            // Redirect to a dashboard or main page upon successful login
             window.location.href = '/dashboard'; //  Replace '/dashboard'
          }
          else{
             setError('Invalid credentials. Please try again.');
          }

      } else {
        setError('Please fill in all fields.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div
        className="w-full max-w-md"
      >
        <Card
          className={twMerge(
            "bg-white/80 backdrop-blur-md border border-blue-200/50",
            "shadow-xl hover:shadow-2xl transition-shadow duration-300"
          )}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-blue-600 flex items-center justify-center gap-2">

              Login to Zenith HR
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-700 flex items-center gap-1.5">

                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className={twMerge(
                    "bg-blue-50/50 border-blue-300 text-blue-900",
                    "placeholder:text-blue-300 focus:ring-blue-500 focus:border-blue-500",
                    "transition-colors duration-200"
                  )}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-700 flex items-center gap-1.5">

                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={twMerge(
                    "bg-blue-50/50 border-blue-300 text-blue-900",
                    "placeholder:text-blue-300 focus:ring-blue-500 focus:border-blue-500",
                    "transition-colors duration-200"
                  )}
                  disabled={loading}
                />
              </div>
              {error && (
                <p
                  className="text-red-500 text-sm"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className={twMerge(
                  "w-full bg-blue-500 text-white hover:bg-blue-600",
                  "transition-colors duration-200",
                  "shadow-md hover:shadow-lg"
                )}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
