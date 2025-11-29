import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns'

export default function Calendar({ events, onDateClick, onEventDelete, onAddEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get all days to display including previous/next month
  const firstDayOfWeek = monthStart.getDay()
  const displayDays = []
  
  // Add previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(monthStart)
    date.setDate(date.getDate() - (i + 1))
    displayDays.push(date)
  }
  
  // Add current month days
  days.forEach(day => displayDays.push(day))
  
  // Add next month days
  const lastDay = displayDays[displayDays.length - 1]
  const daysToAdd = 42 - displayDays.length // 6 rows * 7 days
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(monthEnd)
    date.setDate(date.getDate() + i)
    displayDays.push(date)
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {displayDays.map((date, index) => {
          const dayEvents = getEventsForDate(date)
          const isCurrentMonth = isSameMonth(date, currentDate)
          const isDayToday = isToday(date)

          return (
            <div
              key={index}
              onClick={() => onAddEvent()}
              className={`calendar-day ${
                !isCurrentMonth ? 'opacity-50' : ''
              } ${isDayToday ? 'bg-blue-100 border-blue-400' : ''}`}
            >
              <div className={`font-semibold mb-1 ${isDayToday ? 'text-blue-600' : 'text-gray-900'}`}>
                {format(date, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 bg-blue-200 text-blue-900 rounded truncate flex items-center justify-between group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="flex-1 truncate">{event.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventDelete(event.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
