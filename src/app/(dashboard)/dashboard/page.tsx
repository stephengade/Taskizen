"use client"

import { useState } from "react"
import { Analytics } from "@/components/Analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calendar, Clock, ListTodo, TrendingUp } from "lucide-react"
import { useTaskStore } from "@/lib/store"
import KanbanBoard from "@/components/KanbanBoard"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { tasks, getAnalytics } = useTaskStore()
  const analytics = getAnalytics()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTimeSpent = analytics.totalTimeSpent

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex justify-between items-center">
      
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
           
          </TabsList>
       

      <TabsContent value="overview" className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">All tasks in your board</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {((completedTasks / totalTasks) * 100).toFixed(1)}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
              <p className="text-xs text-muted-foreground">Across all tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTimeSpent > 0
                  ? ((completedTasks / totalTasks) * (totalTimeSpent / (totalTasks * 3600)) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Based on completion rate and time spent</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Your task and productivity analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Analytics />
          </CardContent>
        </Card>
      </TabsContent>

      {/* <TabsContent value="kanban">
        <KanbanBoard />
      </TabsContent> */}
      </Tabs>
      </div>
    </div>
  )
}

