"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/components/firebase';
import { Toaster, toast } from 'sonner'


import {
  IconBrandGoogle,
} from "@tabler/icons-react";

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
        await signInWithPopup(auth, provider);
        toast.success('Login successful');
        router.push('/dashboard'); // Redirect to dashboard
        } catch (error) {
        toast.error('An error occurred during login');
        console.error('Error during Google sign-in:', error);
        }
    };

    // Handle email/password login
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful');
        router.push('/dashboard'); // Redirect to dashboard
        } catch (error) {
        toast.error('Invalid email or password');
        }
    };

    // Handle registration
    //   const handleRegister = async () => {
    //     try {
    //       await createUserWithEmailAndPassword(auth, email, password);
    //       alert('Registration successful! Please log in.');
    //     } catch (error) {
    //       console.error('Error during registration:', error);
    //     }
    //   };


 
  
  return (
    <section className="h-[100vh] px-6 flex items-center justify-center">
    <Toaster position="top-center" richColors  />

    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
      <h2 className="font-semibold pb-6 text-xl text-center text-neutral-200">
        Sign in to your account
      </h2>
      <p className=" text-sm max-w-sm mt-2 text-neutral-300">
        
      </p>

      <form className="my-8" onSubmit={handleEmailLogin}>
        
        <LabelInputContainer className=" mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input value={email} onChange={(e) => {setEmail(e.target.value)}} className="border border-white/[0.1] rounded-[0.5rem] h-[45px] bg-zinc-800 text-zinc-400" placeholder="projectmayhem@fc.com"  type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input  value={password} onChange={(e) => {setPassword(e.target.value)}} className="border border-white/[0.2] rounded-[0.5rem] h-[45px] bg-zinc-800 text-zinc-400" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        

        <button
          className="bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900  block bg-zinc-800 w-full text-white  h-10 font-medium  shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Log in  &rarr;
          <BottomGradient />
        </button>
        </form>

        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-[0.5rem] h-10 font-medium shadow-input bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            onClick={handleGoogleLogin}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              Google
            </span>
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
