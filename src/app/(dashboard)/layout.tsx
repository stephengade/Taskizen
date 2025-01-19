import Navigation from "@/components/Navigation"
import { Toaster } from "@/components/ui/toaster"
import { Onboarding } from "@/components/Onboarding"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      <Toaster />
      <Onboarding />
    </div>
  )
}

