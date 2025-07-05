"use client";
import React, { useState,useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "sonner";
import { useSignIn, useUser, useClerk } from "@clerk/nextjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      toast.success("Already signed in! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200); // Give user time to see the toast
    }
  }, [isLoaded, isSignedIn, router, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        toast.success("Login successful! Redirecting...");
        window.location.href = "/dashboard"; // <-- Force full reload
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as { errors?: { message?: string }[] }).errors)
      ) {
        toast.error(
          ((err as { errors?: { message?: string }[] }).errors?.[0]?.message) ||
            "Invalid email or password"
        );
      } else {
        toast.error("Invalid email or password");
      }
    }
  };
  return (
    <section className="h-[100vh] px-6 flex items-center justify-center">
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
        <h2 className="font-semibold pb-6 text-xl text-center text-neutral-200">
          Sign in to your account
        </h2>
        <form className="my-8" onSubmit={handleSignIn}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-white/[0.1] rounded-[0.5rem] h-[45px] bg-zinc-800 placeholder:text-zinc-400 text-white"
              placeholder="projectmayhem@fc.com"
              type="email"
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Log in &rarr;
            <BottomGradient />
          </button>
          <div className="flex items-center my-8">
            <div className="flex-grow bg-neutral-800 h-[1px]" />
            <p className="whitespace-nowrap -ml-8">
              Don&apos;t have an account? Contact your administrator
            </p>
            <div className="flex-grow bg-neutral-800 h-[1px]" />
          </div>
        </form>
      </div>
    </section>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);