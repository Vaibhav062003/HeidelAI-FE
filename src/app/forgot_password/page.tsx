'use client'
import React, { useEffect, useState } from 'react'
import { useAuth, useClerk, useSignIn } from '@clerk/nextjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner';

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const clerk = useClerk()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  useEffect(() => {
    if (isSignedIn) {
      toast.success('You are already signed in. Redirecting to dashboard...')
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  if (!isLoaded) {
    return null
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true)
        setError('')
      })
      .catch((err) => {
        setError(err.errors?.[0]?.longMessage || 'An error occurred')
      })
    setLoading(false)
  }

  // Reset the user's password.
  async function reset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true)
          setError('')
        } else if (result.status === 'complete') {
          setActive({ session: result.createdSessionId })
            .then(() => {
              localStorage.setItem('sessionId', result.createdSessionId!)
              setSuccess(true)
              router.push('/dashboard')
            })
            .catch((err) => {
              setError(err.errors?.[0]?.longMessage || 'Failed to set active session')
            })
          setError('')
        }
      })
      .catch((err) => {
        setError(err.errors?.[0]?.longMessage || 'An error occurred')
      })
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* LEFT SIDE – Branding / Features */}
      <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-600 text-white p-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>
        <div className="relative z-10 text-center flex flex-col items-center">
          <Image
            src="/heidelai.png"
            alt="HeidelAI"
            width={120}
            height={120}
            className="mb-8 drop-shadow-xl"
          />
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Forgot your password?
          </h1>
          <p className="max-w-xl text-indigo-100 mb-12 leading-relaxed text-xl">
            No worries! Reset your password and get back to your workspace.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-4 max-w-2xl">
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/20 transition-all">
              <h3 className="font-semibold text-2xl mb-3">🔒 Secure Reset</h3>
              <p className="text-lg text-indigo-100/90">
                Your account security is our priority.
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/20 transition-all">
              <h3 className="font-semibold text-2xl mb-3">⚡ Fast Recovery</h3>
              <p className="text-lg text-indigo-100/90">
                Get back to work in just a few steps.
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/20 transition-all">
              <h3 className="font-semibold text-2xl mb-3">🛡️ Privacy First</h3>
              <p className="text-lg text-indigo-100/90">
                We never share your credentials.
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/20 transition-all">
              <h3 className="font-semibold text-2xl mb-3">💬 Support</h3>
              <p className="text-lg text-indigo-100/90">
                Need help? Contact your admin anytime.
              </p>
            </div>
          </div>
          <p className="mt-16 text-xl text-indigo-100/80 italic font-light">
            &quot;Smarter security. Simple recovery.&quot;
          </p>
        </div>
      </div>
      {/* RIGHT SIDE – Forgot Password Form */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-white via-indigo-50 to-purple-100 p-12 relative min-h-screen w-full">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Reset Your Password
            </h2>
            <p className="text-gray-500 text-lg">
              Enter your email to receive a reset code.
            </p>
          </div>
          <form className="space-y-6" onSubmit={!successfulCreation ? create : reset}>
            {!successfulCreation && (
              <>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g john@doe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all mt-6"
                >
                  {loading ? "Sending..." : "Send password reset code"}
                </button>
                {error && (
                  <div className="mt-6 text-red-600 text-lg text-center font-medium">
                    {error}
                  </div>
                )}
              </>
            )}

            {successfulCreation && (
              <>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="code">
                    Reset Code (sent to your email)
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    autoComplete="one-time-code"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all mt-6"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                {error && (
                  <div className="mt-6 text-red-600 text-lg text-center font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mt-6 text-green-600 text-lg text-center font-medium">
                    Success! Redirecting...
                  </div>
                )}
              </>
            )}

            {secondFactor && (
              <div className="mt-6 text-yellow-600 text-lg text-center font-medium">
                2FA is required, but this UI does not handle that.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage