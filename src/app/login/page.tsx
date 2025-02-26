"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion'; // Simplified import

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast.error(error.message);
        } else if (data.user) {
          toast.success('Sign-up successful! Please check your email to confirm your account.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error('Invalid email or password');
        } else {
          toast.success('Login successful!');
          // Use setTimeout for smoother transition between states
          setTimeout(() => router.push('/dashboard'), 1000);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error during authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simpler fade animation variants
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="h-screen w-full">
      <Toaster position="top-center" richColors />
      
      <motion.section
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeVariants}
        transition={{ duration: 0.3 }}
        className="h-full px-6 flex items-center justify-center"
      >
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
          <h2 className="font-semibold pb-6 text-xl text-center text-neutral-200">
            {isSignUp ? "Create an Account" : "Sign in to your account"}
          </h2>

          <form className="my-8" onSubmit={handleAuth}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-white/[0.1] rounded-[0.5rem] h-[45px] bg-zinc-800 placeholder:text-zinc-400 text-white"
                placeholder="projectmayhem@fc.com"
                type="email"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-white/[0.2] rounded-[0.5rem] h-[45px] bg-zinc-800 placeholder:text-zinc-400 text-white"
                placeholder="••••••••"
                type="password"
              />
            </LabelInputContainer>

            <motion.button
              className="bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-2">Processing...</span>
                </span>
              ) : (
                <>{isSignUp ? "Sign Up" : "Log in"} &rarr;</>
              )}
              <BottomGradient />
            </motion.button>
          </form>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <motion.button
              className="bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              onClick={() => setIsSignUp(!isSignUp)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
              <BottomGradient />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// Simple loading spinner component
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-300 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-300 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};