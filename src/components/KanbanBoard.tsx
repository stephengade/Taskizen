"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useTaskStore, type Task } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TimerIndicator } from "./TimerIndicator"
import { useToast } from "@/hooks/use-toast"

const KanbanBoard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, clearColumn, updateTimeSpent } = useTaskStore()
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const columns: { [key: string]: { title: string; color: string } } = {
    todo: { title: "To Do", color: "bg-blue-100 border-blue-300" },
    inProgress: { title: "In Progress", color: "bg-yellow-100 border-yellow-300" },
    completed: { title: "Completed", color: "bg-green-100 border-green-300" },
    backlog: { title: "Backlog", color: "bg-gray-100 border-gray-300" },
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeTimer) {
        const task = tasks.find((t) => t.id === activeTimer)
        if (task) {
          const now = new Date()
          const end = new Date(now.toDateString() + " " + task.endTime)
          const diff = end.getTime() - now.getTime()
          if (diff <= 0) {
            clearInterval(timer)
            setTimeLeft(null)
            setActiveTimer(null)
            updateTimeSpent(
              task.id,
              task.timeSpent +
                Math.floor((now.getTime() - new Date(now.toDateString() + " " + task.startTime).getTime()) / 1000),
            )
            playNotificationSound()
            toast({
              title: "Timer Expired",
              description: `The timer for "${task.title}" has ended.`,
              duration: 5000,
            })
          } else {
            setTimeLeft(Math.floor(diff / 1000))
            updateTimeSpent(task.id, task.timeSpent + 1)
          }
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [activeTimer, tasks, toast, updateTimeSpent])

  const playNotificationSound = () => {
    const soundFile = localStorage.getItem("notificationSound") || "/sounds/stab.mp3"
    const audio = new Audio(soundFile)
    audio.play()
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const task = tasks.find((t) => t.id === result.draggableId)
    if (task) {
      updateTask(task.id, { status: destination.droppableId as Task["status"] })
    }
  }

  const handleAddTask = () => {
    if (newTask.title && newTask.startTime && newTask.endTime) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description || "",
        status: "todo",
        startTime: newTask.startTime,
        endTime: newTask.endTime,
        timeSpent: 0,
        createdAt: new Date().toISOString(),
      }
      addTask(task)
      setNewTask({})
      setIsDialogOpen(false)
      toast({
        title: "Task Added",
        description: "Your new task has been added successfully.",
      })
    }
  }

  const handleClearColumn = (status: Task["status"]) => {
    clearColumn(status)
    toast({
      title: "Column Cleared",
      description: `All tasks in the ${columns[status].title} column have been removed.`,
    })
  }

  const handleStartTimer = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status === "todo") {
      setActiveTimer(taskId)
      updateTask(taskId, { status: "inProgress" })
      const now = new Date()
      const end = new Date(now.toDateString() + " " + task.endTime)
      const diff = end.getTime() - now.getTime()
      setTimeLeft(Math.floor(diff / 1000))
    }
  }

  const handleStopTimer = () => {
    if (activeTimer) {
      const task = tasks.find((t) => t.id === activeTimer)
      if (task) {
        const now = new Date()
        const start = new Date(now.toDateString() + " " + task.startTime)
        const timeSpent = Math.floor((now.getTime() - start.getTime()) / 1000)
        updateTimeSpent(task.id, task.timeSpent + timeSpent)
      }
    }
    setActiveTimer(null)
    setTimeLeft(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  return (
    <div className="p-4">
      <TimerIndicator activeTimer={activeTimer} timeLeft={timeLeft} tasks={tasks} onStopTimer={handleStopTimer} />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTask.title || ""}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newTask.description || ""}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newTask.startTime || ""}
                  onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newTask.endTime || ""}
                  onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, { title, color }]) => (
            <div key={columnId} className={`${color} p-4 rounded-lg border`}>
              <h2 className="text-lg font-semibold mb-2">{title}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClearColumn(columnId as Task["status"])}
                      className="mb-2"
                    >
                      Clear Column
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove all tasks from this column</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                    {tasks
                      .filter((task) => task.status === columnId)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 mb-2 rounded shadow"
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{task.title}</h3>
                                <button
                                  onClick={() => toggleTaskExpansion(task.id)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {expandedTasks.has(task.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                              </div>
                              {expandedTasks.has(task.id) && (
                                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {task.startTime} - {task.endTime}
                              </p>
                              <p className="text-xs text-gray-500">Time spent: {formatTime(task.timeSpent)}</p>
                              {columnId === "todo" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => handleStartTimer(task.id)}
                                >
                                  Start Timer
                                </Button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default KanbanBoard

