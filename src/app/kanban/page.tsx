import Navigation from "@/components/Navigation"
import KanbanBoard from "@/components/KanbanBoard"

export default function KanbanPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <KanbanBoard />
      </div>
    </main>
  )
}

