'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Set initial state
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Toaster position="top-right" richColors />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full z-50 text-center border-[#fcb3b3] border-y bg-[#fff5f5] text-black  py-2  font-medium ">
          ⚠️ You are not connected to the internet. Messages are not syncing
        </div>
      )}

      {/* Content wrapper with padding to avoid overlap */}
      <div className={!isOnline ? 'pt-10' : ''}>{children}</div>
    </div>
  )
}
