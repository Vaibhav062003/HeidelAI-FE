"use client";

import React, { useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { Session } from '@supabase/supabase-js';
interface OrgDataItem {
  public_user_data?: {
    identifier?: string;
  };
  organization?: {
    id?: string;
  };
}

// ...existing code...
export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  // Add a ref to track if just signed in
  const justSignedIn = React.useRef(false);

  // Redirect if already signed in
  React.useEffect(() => {
    if (isLoaded && isSignedIn && !justSignedIn.current) {
      toast.success("Already signed in! Redirecting...");
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoggingIn(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // ...existing code...
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        if (signInAttempt.createdSessionId) {
          localStorage.setItem("sessionId", signInAttempt.createdSessionId);
        }
        // Mark as just signed in to avoid double toast/redirect
        justSignedIn.current = true;

        // Fetch organization data after session is active
        const res = await fetch("/api/getorgdata");
        const data = await res.json();

        const membership = data?.data?.find(
          (item: OrgDataItem) =>
            item.public_user_data?.identifier === email
        );

        if (membership?.organization?.id && isLoaded) {
          localStorage.setItem("org_id", membership.organization.id);
          toast.success("Signed in! Redirecting...");
          router.push("/dashboard");
        } else {
          toast.info("No organization found for this account. Redirecting to onboarding...");
          router.push("/onboarding");
        }
      } else {
        toast.error("Sign in not complete. Further steps required.");
      }

    } catch (err) {
      let message = "Invalid email or password.";
      if (err && typeof err === "object" && "errors" in err && Array.isArray(err.errors)) {
        message = err.errors[0]?.message || message;
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