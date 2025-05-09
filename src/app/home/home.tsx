'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/base/button';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
    // Define theme colors
    const primaryColor = 'blue-400';
    const primaryHover = 'blue-500';
    const secondaryColor = 'blue-600';
    const secondaryHover = 'blue-700';
    const textColor = 'text-gray-800';
    const mutedTextColor = 'text-gray-600';
    const background = 'bg-white';
    const backgroundGradient = 'bg-gradient-to-br from-white to-blue-50/50';
    const accentColor = 'blue-700';
    const buttonTextColor = "text-white";

    const router =useRouter()
    const handleNavigate = ()=>{
        router.push('/login')
    }


    return (
        <div className={`${backgroundGradient} ${background} min-h-screen flex flex-col items-center justify-center p-4`}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold text-blue-500`}>
                        Zenith
                    </h1>
                    <p className={`${mutedTextColor} text-lg sm:text-xl mt-4 sm:mt-6`}>
                        Jumpstart your projects with our collection of pre-built, modern components.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Button
                        onClick={handleNavigate}
                        variant="default"
                        size="lg"

                        className={`px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-${primaryHover} hover:to-${secondaryHover} ${buttonTextColor}`}
                    >
                        <Rocket className="w-6 h-6" />
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className={`px-8 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 border-2 border-${primaryColor}/50 text-${primaryColor} hover:bg-${primaryColor}/10 hover:text-${primaryHover}`}
                    >
                        <Sparkles className="w-6 h-6" />
                        Explore Features
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'easeInOut' }}
                    className="text-center"
                >
                    <div className={`${accentColor} flex justify-center items-center gap-2 font-semibold text-lg`}>
                        <Zap className="w-6 h-6 animate-pulse" />
                        Key Features
                    </div>
                    <p className={`${mutedTextColor} mt-2`}>
                        Modern UI, Responsive Design, Reusable Components.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
