"use client"

import Navigation from "@/components/Navigation"
import { useTaskStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { tasks } = useTaskStore()
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    backlog: 0,
  })

  useEffect(() => {
    const newStats = tasks.reduce(
      (acc, task) => {
        acc.total++
        acc[task.status]++
        return acc
      },
      { total: 0, completed: 0, inProgress: 0, todo: 0, backlog: 0 },
    )
    setStats(newStats)
  }, [tasks])

  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                  {key === "inProgress" ? "In Progress" : key}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

