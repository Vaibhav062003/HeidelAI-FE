"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'sonner';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const router = useRouter();

  // Handle email/password login or signup
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Sign up logic
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast.error(error.message);
        } else if (data.user) {
          toast.success('Sign-up successful! Please check your email to confirm your account.');
          setIsSignUp(false); // Switch back to login after successful signup
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error('Invalid email or password');
        } else {
          // console.log("user_detail",user);
          const { data: { user } } = await supabase.auth.getUser()
          console.log("user data",user);
          router.push('/dashboard'); // Redirect to dashboard
        }
        
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error during authentication:', error);
    }
  };

  return (
    <section className="h-[100vh] px-6 flex items-center justify-center">
      <Toaster position="top-center" richColors />

      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
        <h2 className="font-semibold pb-6 text-xl text-center text-neutral-200">
          {isSignUp ? "Create an Account" : "Sign in to your account"}
        </h2>
        <p className=" text-sm max-w-sm mt-2 text-neutral-300"></p>

        <form className="my-8" onSubmit={handleAuth}>
          <LabelInputContainer className=" mb-4">
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

          <button
            className="bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900  block bg-zinc-800 w-full text-white  h-10 font-medium  shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {isSignUp ? "Sign Up" : "Log in"} &rarr;
            <BottomGradient />
          </button>
        </form>

        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900  block bg-zinc-800 w-full text-white  h-10 font-medium  shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            <BottomGradient />
          </button>
        </div>
      </div>
    </section>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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