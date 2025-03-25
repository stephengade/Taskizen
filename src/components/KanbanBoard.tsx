"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useTaskStore, type Task } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, CalendarIcon, Clock } from "lucide-react"
import { TimerIndicator } from "./TimerIndicator"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO, isAfter, isBefore, startOfToday } from "date-fns"

const KanbanBoard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, clearColumn, updateTimeSpent } = useTaskStore()
  const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  // Store the actual start time of timers
  const timerStartTimeRef = useRef<number | null>(null)
  
  // Time selection options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minuteOptions = Array.from({ length: 4 }, (_, i) => (i * 15).toString().padStart(2, '0'))

  const columns: { [key: string]: { title: string; color: string } } = {
    todo: { title: "To Do", color: "bg-blue-100 border-blue-300" },
    inProgress: { title: "In Progress", color: "bg-yellow-100 border-yellow-300" },
    completed: { title: "Completed", color: "bg-green-100 border-green-300" },
    backlog: { title: "Backlog", color: "bg-gray-100 border-gray-300" },
  }

  // Prevent dialog from closing when interacting with popover content
  const handlePopoverInteraction = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    
    if (activeTimer) {
      timerInterval = setInterval(() => {
        if (activeTimer) {
          const task = tasks.find((t) => t.id === activeTimer)
          if (task) {
            // Get current time
            const now = new Date()
            
            // Parse end time
            const [endHours, endMinutes] = task.endTime.split(':').map(Number)
            const endDate = new Date(selectedDate)
            endDate.setHours(endHours, endMinutes, 0, 0)
            
            // If end time is before current time, assume it's for the next day
            if (isBefore(endDate, now)) {
              endDate.setDate(endDate.getDate() + 1)
            }
            
            const diff = endDate.getTime() - now.getTime()
            
            if (diff <= 0) {
              // Timer has expired
              if(timerInterval) {
                clearInterval(timerInterval)
              }
             
              setTimeLeft(0)
              setActiveTimer(null)
              
              // Calculate total time spent using actual timer start time
              const timeSpent = timerStartTimeRef.current 
                ? Math.floor((endDate.getTime() - timerStartTimeRef.current) / 1000)
                : 0
              
              // Update task's time spent
              updateTask(task.id, { 
                timeSpent: task.timeSpent + timeSpent,
                status: "completed"
              })
              
              // Reset timer start reference
              timerStartTimeRef.current = null
              
              // Notification
              playNotificationSound()
              toast({
                title: "Timer Expired",
                description: `The timer for "${task.title}" has ended.`,
                duration: 5000,
              })
            } else {
              // Timer is still running
              setTimeLeft(Math.floor(diff / 1000))
            }
          }
        }
      }, 1000)
    }

    return () => {
      if (timerInterval !== null) clearInterval(timerInterval)
    }
  }, [activeTimer, tasks, toast, updateTask, selectedDate])

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
    if (newTask.title && newTask.startTime && newTask.endTime && selectedDate) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description || "",
        status: "todo",
        startTime: newTask.startTime,
        endTime: newTask.endTime,
        timeSpent: 0,
        createdAt: selectedDate.toISOString(),
      }
      addTask(task)
      setNewTask({})
      setIsDialogOpen(false)
      toast({
        title: "Task Added",
        description: "Your new task has been added successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
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
      
      // Store the actual time when timer was started
      timerStartTimeRef.current = Date.now()
      
      const now = new Date()
      
      // Parse the end time
      const [hours, minutes] = task.endTime.split(':').map(Number)
      const taskDate = parseISO(task.createdAt)
      const end = new Date(taskDate)
      end.setHours(hours, minutes, 0, 0)
      
      // If end time is earlier today, assume it's for tomorrow
      if (end < now) {
        end.setDate(end.getDate() + 1)
      }
      
      const diff = end.getTime() - now.getTime()
      setTimeLeft(Math.floor(diff / 1000))
    }
  }
  
  const handleStopTimer = () => {
    if (activeTimer) {
      const task = tasks.find((t) => t.id === activeTimer)
      if (task && timerStartTimeRef.current) {
        // Calculate time spent during this session using the actual start time
        const sessionTimeSpent = Math.floor((Date.now() - timerStartTimeRef.current) / 1000)
        
        // Update the total time spent
        updateTask(task.id, { 
          timeSpent: task.timeSpent + sessionTimeSpent
        })
        
        // Reset timer start reference
        timerStartTimeRef.current = null
      }
    }
    setActiveTimer(null)
    setTimeLeft(null)
  }

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00"
    
    // Handle negative values
    const isNegative = seconds < 0
    const absoluteSeconds = Math.abs(seconds)
    
    const mins = Math.floor(absoluteSeconds / 60)
    const secs = Math.floor(absoluteSeconds % 60)
    
    // Create the formatted time string
    const timeString = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    
    // Add negative sign if needed
    return isNegative ? `-${timeString}` : timeString
  }

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`
    } else {
      return `${mins}m ${secs}s`
    }
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

  const handleSetStartTime = (hour: string, minute: string) => {
    setNewTask({ ...newTask, startTime: `${hour}:${minute}` })
  }

  const handleSetEndTime = (hour: string, minute: string) => {
    setNewTask({ ...newTask, endTime: `${hour}:${minute}` })
  }

  return (
    <div className="p-4">
      <TimerIndicator activeTimer={activeTimer} timeLeft={timeLeft} tasks={tasks} onStopTimer={handleStopTimer} />
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="">
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
                <Label htmlFor="description" className="">
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
                <Label htmlFor="date" className="">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left cursor-pointer font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" onClick={handlePopoverInteraction}>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => isBefore(date, startOfToday())}
                        initialFocus
                       
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="">
                  Start Time
                </Label>
                <div className="col-span-3 flex gap-2">
                  <div className="flex-1">
                    <Select onValueChange={(value) => handleSetStartTime(value, newTask.startTime?.split(":")[1] || "00")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hour">
                          {newTask.startTime?.split(":")[0] || "Hour"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent onClick={handlePopoverInteraction}>
                        {hourOptions.map((hour) => (
                          <SelectItem key={`start-hour-${hour}`} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select onValueChange={(value) => handleSetStartTime(newTask.startTime?.split(":")[0] || "00", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Min">
                          {newTask.startTime?.split(":")[1] || "Min"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent onClick={handlePopoverInteraction}>
                        {minuteOptions.map((minute) => (
                          <SelectItem key={`start-min-${minute}`} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="">
                  End Time
                </Label>
                <div className="col-span-3 flex gap-2">
                  <div className="flex-1">
                    <Select onValueChange={(value) => handleSetEndTime(value, newTask.endTime?.split(":")[1] || "00")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hour">
                          {newTask.endTime?.split(":")[0] || "Hour"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent onClick={handlePopoverInteraction}>
                        {hourOptions.map((hour) => (
                          <SelectItem key={`end-hour-${hour}`} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select onValueChange={(value) => handleSetEndTime(newTask.endTime?.split(":")[0] || "00", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Min">
                          {newTask.endTime?.split(":")[1] || "Min"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent onClick={handlePopoverInteraction}>
                        {minuteOptions.map((minute) => (
                          <SelectItem key={`end-min-${minute}`} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">{task.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Date: {format(parseISO(task.createdAt), "PPP")}
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {task.startTime} - {task.endTime}
                              </div>
                              <p className="text-xs text-gray-500">
                                Time spent: {formatTimeSpent(task.timeSpent)}
                              </p>
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