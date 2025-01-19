import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "inProgress" | "completed" | "backlog"
  startTime: string
  endTime: string
  timeSpent: number // in seconds
  createdAt: string
  completedAt?: string
}

interface Analytics {
  totalTimeSpent: number // in seconds
  tasksByDay: { [date: string]: string[] }
  tasksByWeek: { [week: string]: string[] }
  timeSpentByTask: { [taskId: string]: number }
}

interface TaskStore {
  tasks: Task[]
  analytics: Analytics
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  clearColumn: (status: Task["status"]) => void
  moveToBacklog: () => void
  updateTimeSpent: (taskId: string, timeSpent: number) => void
  getAnalytics: () => Analytics
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      analytics: {
        totalTimeSpent: 0,
        tasksByDay: {},
        tasksByWeek: {},
        timeSpentByTask: {},
      },
      addTask: (task) =>
        set((state) => {
          const newTasks = [...state.tasks, task]
          const newAnalytics = updateAnalytics(newTasks, state.analytics)
          return { tasks: newTasks, analytics: newAnalytics }
        }),
      updateTask: (taskId, updates) =>
        set((state) => {
          const newTasks = state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
          const newAnalytics = updateAnalytics(newTasks, state.analytics)
          return { tasks: newTasks, analytics: newAnalytics }
        }),
      deleteTask: (taskId) =>
        set((state) => {
          const newTasks = state.tasks.filter((task) => task.id !== taskId)
          const newAnalytics = updateAnalytics(newTasks, state.analytics)
          return { tasks: newTasks, analytics: newAnalytics }
        }),
      clearColumn: (status) =>
        set((state) => {
          const newTasks = state.tasks.filter((task) => task.status !== status)
          const newAnalytics = updateAnalytics(newTasks, state.analytics)
          return { tasks: newTasks, analytics: newAnalytics }
        }),
      moveToBacklog: () =>
        set((state: any) => {
          const newTasks = state.tasks.map((task: { status: string }) => (task.status === "todo" ? { ...task, status: "backlog" } : task))
          const newAnalytics = updateAnalytics(newTasks, state.analytics)
          return { tasks: newTasks, analytics: newAnalytics }
        }),
      updateTimeSpent: (taskId, timeSpent) =>
        set((state) => {
          const newTasks = state.tasks.map((task) =>
            task.id === taskId ? { ...task, timeSpent: task.timeSpent + timeSpent } : task,
          )
          const newAnalytics = updateAnalytics(newTasks, state.analytics)
          return { tasks: newTasks, analytics: newAnalytics }
        }),
      getAnalytics: () => get().analytics,
    }),
    {
      name: "task-storage",
    },
  ),
)

function updateAnalytics(tasks: Task[], oldAnalytics: Analytics): Analytics {
  const analytics: Analytics = {
    totalTimeSpent: 0,
    tasksByDay: {},
    tasksByWeek: {},
    timeSpentByTask: {},
  }

  tasks.forEach((task) => {
    // Update total time spent
    analytics.totalTimeSpent += task.timeSpent

    // Update tasks by day
    const day = new Date(task.createdAt).toISOString().split("T")[0]
    if (!analytics.tasksByDay[day]) {
      analytics.tasksByDay[day] = []
    }
    analytics.tasksByDay[day].push(task.id)

    // Update tasks by week
    const weekStart = getWeekStart(new Date(task.createdAt)).toISOString().split("T")[0]
    if (!analytics.tasksByWeek[weekStart]) {
      analytics.tasksByWeek[weekStart] = []
    }
    analytics.tasksByWeek[weekStart].push(task.id)

    // Update time spent by task
    analytics.timeSpentByTask[task.id] = task.timeSpent
  })

  return analytics
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

