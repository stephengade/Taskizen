import type React from "react"
import type { Task } from "@/lib/store"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TimerIndicatorProps {
  activeTimer: string | null
  timeLeft: number | null
  tasks: Task[]
  onStopTimer: () => void
}

export const TimerIndicator: React.FC<TimerIndicatorProps> = ({ activeTimer, timeLeft, tasks, onStopTimer }) => {
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-indigo-600">{activeTask.title}</h2>
          <p className="text-4xl font-semibold">{formatTime(timeLeft)}</p>
          <Button onClick={onStopTimer} variant="destructive">
            Stop Timer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

