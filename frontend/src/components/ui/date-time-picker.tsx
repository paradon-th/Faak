"use client"

import * as React from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label?: string
}

export function DateTimePicker({ date, setDate, label }: DateTimePickerProps) {
  const [time, setTime] = React.useState<string>(
    date ? format(date, "HH:mm") : "12:00"
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(":")
      selectedDate.setHours(parseInt(hours), parseInt(minutes))
      setDate(selectedDate)
    } else {
      setDate(undefined)
    }
  }

  const handleHourChange = (newHour: string) => {
    const [_, minutes] = time.split(":")
    const newTime = `${newHour}:${minutes}`
    setTime(newTime)
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(parseInt(newHour), parseInt(minutes))
      setDate(newDate)
    }
  }

  const handleMinuteChange = (newMinute: string) => {
    const [hours, _] = time.split(":")
    const newTime = `${hours}:${newMinute}`
    setTime(newTime)
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours), parseInt(newMinute))
      setDate(newDate)
    }
  }

  const hoursList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal py-6 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all border-slate-300 dark:border-slate-700",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
          {date ? (
            <span className="text-lg text-slate-900 dark:text-slate-100 font-medium">{format(date, "d MMM yyyy, HH:mm", { locale: th })}</span>
          ) : (
            <span className="text-lg">{label || "เลือกวันและเวลา"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden z-50 bg-white dark:bg-slate-950" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3"
          />
          <div className="flex items-center gap-3 mt-4 px-3 pb-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Clock className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">เวลา:</span>
            <div className="flex items-center gap-2 w-full">
              <Select value={time.split(":")[0]} onValueChange={handleHourChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ชั่วโมง" />
                </SelectTrigger>
                <SelectContent>
                  {hoursList.map(h => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="font-bold">:</span>
              <Select value={time.split(":")[1]} onValueChange={handleMinuteChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="นาที" />
                </SelectTrigger>
                <SelectContent>
                  {minutesList.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
