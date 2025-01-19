"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"


const sounds = [
  { name: "Stab", file: "/audio/stab.mp3" },
  { name: "Wildfire", file: "/audio/wildfire.mp3" },
]

export default function SettingsPage() {
  const [selectedSound, setSelectedSound] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const savedSound = localStorage.getItem("notificationSound")
    if (savedSound) {
      setSelectedSound(savedSound)
    }
  }, [])

  const handleSoundChange = (value: string) => {
    setSelectedSound(value)
    localStorage.setItem("notificationSound", value)
  }

  const playSound = () => {
    if (selectedSound) {
      const audio = new Audio(selectedSound)
      audio.play()
    }
  }

  const saveSettings = () => {
    localStorage.setItem("notificationSound", selectedSound)
    toast({
      title: "Settings Saved",
      description: "Your notification sound preference has been saved.",
    })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Sound</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Choose the sound for task notifications.</p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="max-w-xs w-full">
              <Select onValueChange={handleSoundChange} value={selectedSound}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  {sounds.map((sound) => (
                    <SelectItem key={sound.file} value={sound.file}>
                      {sound.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={playSound} className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
              Test Sound
            </Button>
            <Button onClick={saveSettings} className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

