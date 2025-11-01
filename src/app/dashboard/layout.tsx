"use client";

import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("You are not logged in. Please login to continue.");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    // Enlarged Loading spinner
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[32rem] h-[32rem] bg-blue-300/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-[28rem] h-[28rem] bg-indigo-300/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/30 p-20 rounded-3xl shadow-2xl text-center border border-white/40 z-10"
        >
          <div className="w-20 h-20 mx-auto mb-8 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Checking your session...
          </h1>
          <p className="text-xl text-gray-600">
            Please wait while we verify your authentication status.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Enlarged Not signed in UI
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[32rem] h-[32rem] bg-indigo-400/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
          <div className="absolute w-[28rem] h-[28rem] bg-blue-400/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/30 p-20 rounded-3xl shadow-2xl text-center border border-white/40 z-10 max-w-2xl"
        >
          <div className="mx-auto mb-8 flex items-center justify-center w-24 h-24 rounded-full bg-indigo-600 text-white shadow-lg">
            <LogIn className="w-14 h-14" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            You’re not logged in
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Please log in to access your personalized dashboard and insights.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300"
          >
            Go to Login
          </button>
        </motion.div>

        <p className="text-gray-400 text-lg mt-10 z-10">
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
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-center" richColors />
          {children}
        </div>
      </body>
    </html>
  )
}