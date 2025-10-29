"use client";

import { Toaster } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/30 p-10 rounded-2xl shadow-lg text-center border border-white/40 z-10"
        >
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Checking your session...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your authentication status.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Glowing background orbs */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-80 h-80 bg-blue-400/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200" />
        </div>

        {/* Glassmorphic card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/30 p-10 rounded-2xl shadow-lg text-center border border-white/40 z-10 max-w-md"
        >
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg">
            <LogIn className="w-7 h-7" />
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 mb-3">
            You’re not logged in
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to access your personalized dashboard and insights.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all duration-300"
          >
            Go to Login
          </button>
        </motion.div>

        <p className="text-gray-400 text-sm mt-6 z-10">
          HeidelAI • Secure Access Portal
        </p>

        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/HeidelAi Favicon.ico.ico" />
        <title>Dashboard</title>
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-center" richColors />
          {children}
        </div>
      </body>
    </html>
  );
}
