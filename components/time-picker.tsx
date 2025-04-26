"use client"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimePickerProps {
  time: string
  setTime: (time: string) => void
  className?: string
  placeholder?: string
}

export function TimePicker({ time, setTime, className, placeholder = "Select time" }: TimePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !time && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full" />
        </div>
      </PopoverContent>
    </Popover>
  )
}

