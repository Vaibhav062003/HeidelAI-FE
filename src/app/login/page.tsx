"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffibjxjbjsekelomsyqh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmaWJqeGpianNla2Vsb21zeXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5ODI1MzEsImV4cCI6MjA1MzU1ODUzMX0.A1ctcA2SoSzedOq-c0bGuEVSK4IPB2uVjuPQp1ifThk";
const supabase = createClient(supabaseUrl, supabaseKey);

const AuthForm: React.FC<{ isSignUp: boolean; toggleForm: () => void }> = ({ isSignUp, toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage(error.message);
        } else if (data.user) {
          setMessage("Sign-up successful! Please check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(error.message);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => {
              toggleForm();
              setMessage("");
            }}
            className={`px-6 py-2 mx-2 text-lg font-medium rounded-lg transition-all ${
              !isSignUp
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              toggleForm();
              setMessage("");
            }}
            className={`px-6 py-2 mx-2 text-lg font-medium rounded-lg transition-all ${
              isSignUp
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>
        <h2 className="text-3xl font-semibold mb-6 text-center">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAuth}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg font-medium"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
      <AuthForm isSignUp={isSignUp} toggleForm={() => setIsSignUp(!isSignUp)} />
    </div>
  );
};

export default AuthPage;
