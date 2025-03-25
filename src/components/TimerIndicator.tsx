import type React from "react"
import type { Task } from "@/lib/store"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface TimerIndicatorProps {
  activeTimer: string | null
  timeLeft: number | null
  tasks: Task[]
  onStopTimer: () => void
}

export const TimerIndicator: React.FC<TimerIndicatorProps> = ({ activeTimer, timeLeft, tasks, onStopTimer }) => {
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00"
    
    // Handle negative values
    const isNegative = seconds < 0
    const absoluteSeconds = Math.abs(seconds)
    
    const hours = Math.floor(absoluteSeconds / 3600)
    const mins = Math.floor((absoluteSeconds % 3600) / 60)
    const secs = Math.floor(absoluteSeconds % 60)
    
    // Create the formatted time string
    let timeString = ""
    
    if (hours > 0) {
      timeString = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    } else {
      timeString = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    
    // Add negative sign if needed
    return isNegative ? `-${timeString}` : timeString
  }

  if (!activeTimer || timeLeft === null) {
    return null
  }

  const activeTask = tasks.find((task) => task.id === activeTimer)

  if (!activeTask) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle className="text-center"> {activeTask.title}</DialogTitle>
        <div className="flex flex-col items-center space-y-4">
         
          <div className="flex items-center">
            <Clock className="mr-2 h-6 w-6 text-indigo-600" />
            <p className="text-4xl font-semibold">{formatTime(timeLeft)}</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>{activeTask.startTime} - {activeTask.endTime}</span>
          </div>
          <Button onClick={onStopTimer} variant="destructive" className="mt-4">
            Stop Timer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}