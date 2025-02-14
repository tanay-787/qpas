import * as React from "react"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { format, getYear, getMonth, setYear, setMonth } from "date-fns"
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

const DateInput = React.forwardRef(({ className, value, onChange, placeholder, min, max, isDisabled, ...props }, ref) => {
  const [date, setDate] = React.useState(value)
  const [calendarDate, setCalendarDate] = React.useState(date || new Date())

  // Convert min and max to Date objects if they're strings
  const minDate = min ? new Date(min) : new Date(1900, 0, 1)
  const maxDate = max ? new Date(max) : new Date(2100, 11, 31)

  const minYear = getYear(minDate)
  const maxYear = getYear(maxDate)
  const currentYear = getYear(calendarDate)
  const currentMonth = getMonth(calendarDate)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  )

  const handleYearChange = (year) => {
    const newDate = setYear(calendarDate, parseInt(year))
    setCalendarDate(newDate)
  }

  const handleMonthChange = (month) => {
    const monthIndex = months.indexOf(month)
    const newDate = setMonth(calendarDate, monthIndex)
    setCalendarDate(newDate)
  }

  const handleSelect = (selectedDate) => {
    setDate(selectedDate)
    setCalendarDate(selectedDate)
    onChange?.(selectedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={isDisabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between space-x-2 border-b p-3">
          <Select
            value={months[currentMonth]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[90px] h-8">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={calendarDate}
          onMonthChange={setCalendarDate}
          disabled={(date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }}
          initialFocus
          defaultMonth={date || new Date()}
        />
      </PopoverContent>
    </Popover>
  )
})

DateInput.displayName = "DateInput"

export { DateInput }
