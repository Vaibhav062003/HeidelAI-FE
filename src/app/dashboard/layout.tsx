import { Toaster } from 'sonner'
import './dashboard.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/HeidelAi Favicon.ico.ico" />

        <title>Dashboard</title>
      </head>
      <body>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" richColors />
          {children}
        </div>
      </body>
    </html>
  )
}