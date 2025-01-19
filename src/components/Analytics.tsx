import type React from "react"
import { useTaskStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const Analytics: React.FC = () => {
  const { tasks, getAnalytics } = useTaskStore()
  const analytics = getAnalytics()

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getTimeSpentToday = () => {
    const today = new Date().toISOString().split("T")[0]
    return (
      analytics.tasksByDay[today]?.reduce((total, taskId) => {
        const task = tasks.find((t) => t.id === taskId)
        return total + (task?.timeSpent || 0)
      }, 0) || 0
    )
  }

  const getTimeSpentThisWeek = () => {
    const weekStart = getWeekStart(new Date()).toISOString().split("T")[0]
    return (
      analytics.tasksByWeek[weekStart]?.reduce((total, taskId) => {
        const task = tasks.find((t) => t.id === taskId)
        return total + (task?.timeSpent || 0)
      }, 0) || 0
    )
  }

  const getMostTimeConsumingTask = () => {
    let maxTime = 0
    let maxTask = null
    for (const [taskId, time] of Object.entries(analytics.timeSpentByTask)) {
      if (time > maxTime) {
        maxTime = time
        maxTask = tasks.find((t) => t.id === taskId)
      }
    }
    return maxTask
  }

  const mostTimeConsumingTask = getMostTimeConsumingTask()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Time Spent</CardTitle>
          <CardDescription>Across all tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatTime(analytics.totalTimeSpent)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Time Spent Today</CardTitle>
          <CardDescription>On all tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatTime(getTimeSpentToday())}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Time Spent This Week</CardTitle>
          <CardDescription>On all tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatTime(getTimeSpentThisWeek())}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Time-Consuming Task</CardTitle>
          <CardDescription>Task that took the longest</CardDescription>
        </CardHeader>
        <CardContent>
          {mostTimeConsumingTask ? (
            <>
              <p className="font-semibold">{mostTimeConsumingTask.title}</p>
              <p className="text-sm text-gray-500">{formatTime(mostTimeConsumingTask.timeSpent)}</p>
            </>
          ) : (
            <p>No tasks completed yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

