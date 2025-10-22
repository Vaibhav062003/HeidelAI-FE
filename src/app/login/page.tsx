"use client";

import React, { useEffect, useState } from "react";
import { useOrganization, useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { Session } from '@supabase/supabase-js'
import { useClerk } from '@clerk/nextjs';
interface OrgDataItem {
  public_user_data?: {
    identifier?: string;
  };
  organization?: {
    id?: string;
  };
}

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, user } = useUser();
  const { membership } = useOrganization();
  const { signOut } = useClerk() 
  const [pendingMembershipCheck, setPendingMembershipCheck] = useState(false);
  const router = useRouter();
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Add a ref to track if just signed in
  const justSignedIn = React.useRef(false);

  // Temp holder for a session id returned by sign-in attempt — do NOT persist immediately
  const sessionCandidateRef = React.useRef<string | null>(null);

  // Redirect if already signed in
  React.useEffect(() => {
    if (isLoaded && isSignedIn && membership && !pendingMembershipCheck && !justSignedIn.current) {
      toast.success("Already signed in! Redirecting...");
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router, membership, pendingMembershipCheck]);




  // Membership check after sign-in and organization load
  useEffect(() => {
    if (pendingMembershipCheck) {
      // If user has membership, persist the session candidate and proceed
      if (membership) {
        const sess = sessionCandidateRef.current;
        if (sess) {
          localStorage.setItem("sessionId", sess);
          justSignedIn.current = true;
          sessionCandidateRef.current = null;
        }
        toast.success("Signed in! Redirecting...");
        router.push("/dashboard");
      } else {
        // Do not persist session if no membership
        if (sessionCandidateRef.current) {
          sessionCandidateRef.current = null;
          localStorage.removeItem("sessionId");
        }
        toast.info("Please Create or Join an Organization");
        router.push("/onboarding");
      }
      setPendingMembershipCheck(false);
    }
  }, [pendingMembershipCheck, membership, router]);

  // If user is signed in BUT has no org membership, force sign-out
  useEffect(() => {
    if (isLoaded && isSignedIn && !membership) {
      // clear any stored session candidate
      sessionCandidateRef.current = null;
      localStorage.removeItem("sessionId");
      
      // sign out so the user can login with another account
      signOut();
    }
  }, [isLoaded, isSignedIn, membership, signOut]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoggingIn(true);
    justSignedIn.current = false;
    // Track any session id returned by the attempt so we can avoid persisting it on failure
    let attemptedSessionId: string | null = null;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      attemptedSessionId = signInAttempt.createdSessionId || null;

      if (signInAttempt.status === "complete" && attemptedSessionId) {
        // Activate the session now but do NOT persist it until we confirm membership
        await setActive({ session: attemptedSessionId });
        sessionCandidateRef.current = attemptedSessionId;
        setPendingMembershipCheck(true);
      } else {
        // do not persist anything if sign in not complete
        if (attemptedSessionId) {
          localStorage.removeItem("sessionId");
          attemptedSessionId = null;
          sessionCandidateRef.current = null;
        }
        toast.error("Sign in not complete. Further steps required.");
      }

    } catch (err) {
      // ensure nothing from this failed attempt remains persisted
      if (attemptedSessionId) {
        localStorage.removeItem("sessionId");
        attemptedSessionId = null;
        sessionCandidateRef.current = null;
      }

      let message = "Invalid email or password.";
      if (err && typeof err === "object" && "errors" in err && Array.isArray(err.errors)) {
        message = (err).errors[0]?.message || message;
      }
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <section className="h-screen  bg-black text-white px-6 flex items-center justify-center">
      <Toaster position="top-center" richColors />
      <div className="max-w-md shadow-none w-full border-2 border-white/10 mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-black">
        <h2 className="font-semibold pb-6 text-xl text-center text-neutral-200">
          Sign in to your account
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-white/[0.1] rounded-[0.5rem] h-[45px] bg-zinc-800 placeholder:text-zinc-400 text-white"
              placeholder="projectmayhem@fc.com"
              type="email"
              autoComplete="username"
              required
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
              required
            />
          </LabelInputContainer>
          <button
            className={cn(
              "bg-gradient-to-br relative group/btn rounded-[0.5rem] from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
              { "opacity-50 cursor-not-allowed": isLoggingIn }
            )}
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Log in →"}
            <BottomGradient />
          </button>
          <div className="flex items-center my-8 text-neutral-400 text-sm">
            <div className="flex-grow bg-neutral-800 h-[1px]" />
            <p className="px-4 text-center whitespace-nowrap">
              Don&apos;t have an account? Contact your admin
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