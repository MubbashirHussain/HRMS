import LoginForm  from "@/features/auth/components/LoginForm";
import { Metadata } from "next";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">HRMS My me</h1>
          <p className="text-gray-600">Point of Human System</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
