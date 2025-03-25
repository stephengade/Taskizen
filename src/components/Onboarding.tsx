"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const steps = [
  {
    title: "Welcome to Taskizen",
    description: "Taskizen helps you organize tasks and boost productivity. Let's get started!",
  },
  {
    title: "Kanban Board",
    description: "Use our Kanban board to visualize your workflow. Drag and drop tasks between columns.",
  },
  {
    title: "Task Timer",
    description: "Set start and end times for your tasks. You'll receive notifications to keep you on track.",
  },
  {
    title: "Customize Your Experience",
    description: "Visit the Settings page to choose your notification sound and personalize your experience.",
  },
]

export function Onboarding() {
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const yaruOnboardingCompleted = localStorage.getItem("yaruOnboardingCompleted")

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsOpen(false)
      localStorage.setItem("yaruOnboardingCompleted", "true")
    }
  }

  if (yaruOnboardingCompleted === "true") {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>{steps[currentStep].description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleNext}>{currentStep < steps.length - 1 ? "Next" : "Get Started"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

