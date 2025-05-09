import React from 'react';
import { Metadata } from 'next';
// Assumed path, adjust as necessary
import Login from './login';

export const metadata: Metadata = {
    title: "Login to Zenith HR",
    description: "Login to your Zenith HR account to manage your human resources.",
    keywords: [
        "HRM",
        "HRMS",
        "Human Resources",
        "Login",
        "Employee Management",
        "Zenith HR",
    ],
    openGraph: {
        title: "Login to Zenith HR",
        description: "Login to your Zenith HR account to manage your human resources.",
        url: "/",
        images: [
            {
                url: "/og-image.png",
                width: 800,
                height: 600,
            },
        ],
    },
};

const LoginPage = () => {
    return (
        <main className="min-h-screen w-full bg-gray-50">
            <Login />
        </main>
    );
};

export default LoginPage;
