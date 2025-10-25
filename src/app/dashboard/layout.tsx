import { Toaster } from 'sonner'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Route segment layouts should not re-declare <html>/<body>. Use wrappers only.
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" richColors />
      {children}
    </div>
  )
}