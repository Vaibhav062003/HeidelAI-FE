"use client";

import { ChangeEvent, useState, useEffect } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/types';
import { Input } from '@/components/sign-up/ui/Input';
import { OtpInput } from '@/components/sign-up/OtpInput';
import { Loader2, CheckCircle, ShieldCheck, AlertCircleIcon, FileWarning, TriangleAlert } from 'lucide-react';
import Image from 'next/image';

type Step = "BASIC" | "PASSWORD" | "OTP" | "PLAN" | "PAYMENT" | "INVITE" | "SUCCESS";

export default function SignupFlow() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();

  const [step, setStep] = useState<Step>("BASIC");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form States
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: ""
  });
  const [otpCode, setOtpCode] = useState("");

  // --- API Handlers ---
  
  const signInWith = (strategy: OAuthStrategy) => {
    if (!isSignInLoaded || !signIn) return;
    
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sign-up/sso-callback',
      redirectUrlComplete: '/sign-up', 
    })
    .catch((err) => {
      if (err instanceof Error) {
        console.error("Sign in error", err);
        setError(err.message);
        return;
      }
      else {
        console.error("Sign in error", err);
        setError(err.errors ? err.errors[0].message : "An error occurred with Google Sign In");
      }
    });
  }

  useEffect(() => {
    if (isUserLoaded && isSignedIn && user && step === "BASIC") {
        // User is authenticated via Clerk. Skip BASIC/PASSWORD/OTP
        // You might need to call your backend here to get a 'sessionId' or sync the user
        setStep("PLAN");
    }
  }, [isUserLoaded, isSignedIn, user, step]);

  const handleBasicSubmit = async (provider: 'email' | 'google' = 'email') => {
    if (provider === 'google') {
        signInWith('oauth_google');
        return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Mock API Call
      const res = await fetch('http://localhost:8000/signup/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          first_name: formData.firstName, 
          last_name: formData.lastName, 
          email: formData.email,
          provider 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error initializing");

      setSessionId(data.session_id);
      // THE BACKEND DICTATES THE NEXT STEP
      setStep(data.next_step as Step); 
      
    } catch (err) {
        if(err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/signup/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, password: formData.password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setStep(data.next_step as Step);
    } catch (err) {
        if(err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!sessionId || otpCode.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/signup/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, otp_code: otpCode })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      
      setStep(data.next_step as Step);
    } catch (err) {
        if(err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
    } finally {
      setLoading(false);
    }
  };
  
  const handlePlanSelect = async (planId: string) => {
    if (!sessionId) return;
    setLoading(true);
    try {
       const res = await fetch('http://localhost:8000/signup/select-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, plan_id: planId })
      });
       const data = await res.json();
       setStep(data.next_step as Step);
    } catch (err) {
        setError("Failed to select plan");
    } finally {
        setLoading(false);
    }
  };

  // --- Renders ---

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className='fixed flex h-10 items-center top-8 left-8'>
            <Image src="/heidelai.png" alt="Logo" width={120} height={120} quality={100} loading='eager' className='max-h-10 max-w-10' />
            <h2 className='text-xl font-bold text-gray-900 ml-2'>HeidelAI</h2>
        </div>
      <div className="bg-white max-w-md w-full  rounded-2xl  p-8 transition-all">


        {/* STEP 1: BASIC */}
        {step === "BASIC" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">Get started for free</h1>

              {error && (
                  <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <TriangleAlert size={16} /> {error}
                  </div>
              )}

            <button 
                onClick={() => handleBasicSubmit('google')}
                className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
            >
                <Image height={48} width={48} src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Sign in with Google
            </button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" placeholder="Jane" 
                value={formData.firstName}
                onChange={(e:ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
              />
              <Input 
                label="Last Name" placeholder="Doe"
                value={formData.lastName}
                onChange={(e:ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <Input 
                label="Email" type="email" placeholder="jane@company.com"
                value={formData.email}
                onChange={(e:ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
            />

            <button 
              onClick={() => handleBasicSubmit('email')}
              disabled={loading || !formData.email}
              className="w-full py-2.5 mt-6 bg-black hover:bg-black text-white rounded-lg font-medium transition-colors flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Continue"}
            </button>

            
            <p className='text-sm text-gray-600 mt-12 text-center'>By creating an account, you agree to the Terms of Service and Privacy Policy.</p>
          </div>
        )}

        {/* STEP 2: PASSWORD */}
        {step === "PASSWORD" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure your account</h1>
             <p className="text-gray-500 mb-6">Create a strong password to continue.</p>
             
             <Input 
                label="Password" type="password" placeholder="••••••••"
                value={formData.password}
                onChange={(e:ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
            />
            
            <button 
              onClick={handlePasswordSubmit}
              disabled={loading || formData.password.length < 8}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Password"}
            </button>
          </div>
        )}

        {/* STEP 3: OTP */}
        {step === "OTP" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={24} />
             </div>
             <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
             <p className="text-gray-500">We sent a code to <span className="font-medium text-gray-900">{formData.email}</span></p>

             <OtpInput onComplete={(code: string) => setOtpCode(code)} />

             <button 
              onClick={handleOtpVerify}
              disabled={loading || otpCode.length !== 6}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
            </button>
          </div>
        )}

        {/* STEP 4: PLAN */}
        {step === "PLAN" && (
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
             <h1 className="text-2xl font-bold text-gray-900 mb-6">Select your plan</h1>
             
             <div className="space-y-3">
                 {['Hobby', 'Pro', 'Enterprise'].map((plan) => (
                     <div 
                        key={plan}
                        onClick={() => handlePlanSelect(plan.toLowerCase())}
                        className="group border border-gray-200 p-4 rounded-xl cursor-pointer hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all flex justify-between items-center"
                     >
                         <div>
                             <h3 className="font-semibold text-gray-900">{plan}</h3>
                             <p className="text-sm text-gray-500">Perfect for growing businesses</p>
                         </div>
                         <div className="h-5 w-5 rounded-full border border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500 transition-colors"></div>
                     </div>
                 ))}
             </div>
           </div>
        )}

        {/* STEP 5: PAYMENT (Placeholder) */}
        {step === "PAYMENT" && (
            <div className="text-center animate-in fade-in">
                <h1 className="text-2xl font-bold mb-4">Payment Step</h1>
                <p>Redirecting to Stripe...</p>
            </div>
        )}

      </div>
    </div>
  );
}