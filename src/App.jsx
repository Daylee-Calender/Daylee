import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import FamilyCodeSetup from './components/FamilyCodeSetup'
import AIAssistant from './components/AIAssistant'
import EventForm from './components/EventForm'
import { Calendar as CalendarIcon, LogOut } from 'lucide-react'

export default function App() {
  const [familyCode, setFamilyCode] = useState(null)
  const [familyName, setFamilyName] = useState('')
  const [events, setEvents] = useState([])
  const [familyMembers, setFamilyMembers] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Load data from localStorage
  useEffect(() => {
    const savedFamilyCode = localStorage.getItem('familyCode')
    const savedFamilyName = localStorage.getItem('familyName')
    const savedEvents = localStorage.getItem('events')
    const savedMembers = localStorage.getItem('familyMembers')
    const savedUser = localStorage.getItem('currentUser')

    if (savedFamilyCode) {
      setFamilyCode(savedFamilyCode)
      setFamilyName(savedFamilyName || 'Family Calendar')
      setEvents(savedEvents ? JSON.parse(savedEvents) : [])
      setFamilyMembers(savedMembers ? JSON.parse(savedMembers) : [])
      setCurrentUser(savedUser || 'You')
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (familyCode) {
      localStorage.setItem('familyCode', familyCode)
      localStorage.setItem('familyName', familyName)
      localStorage.setItem('events', JSON.stringify(events))
      localStorage.setItem('familyMembers', JSON.stringify(familyMembers))
      localStorage.setItem('currentUser', currentUser)
    }
  }, [familyCode, familyName, events, familyMembers, currentUser])

  const handleSetupFamily = (code, name, members) => {
    setFamilyCode(code)
    setFamilyName(name)
    setFamilyMembers(members)
    setCurrentUser(members[0] || 'You')
  }

  const handleAddEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }])
    setShowEventForm(false)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId))
  }

  const handleLogout = () => {
    localStorage.clear()
    setFamilyCode(null)
    setFamilyName('')
    setEvents([])
    setFamilyMembers([])
    setCurrentUser(null)
  }

  if (!familyCode) {
    return <FamilyCodeSetup onSetup={handleSetupFamily} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daylee</h1>
              <p className="text-sm text-gray-600">{familyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{currentUser}</span>
              <p className="text-xs">Family Code: {familyCode}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              events={events}
              onDateClick={setSelectedDate}
              onEventDelete={handleDeleteEvent}
              onAddEvent={() => setShowEventForm(true)}
            />
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Family Members</h2>
              <div className="space-y-2">
                {familyMembers.map(member => (
                  <button
                    key={member}
                    onClick={() => setCurrentUser(member)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      currentUser === member
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
            >
              🤖 Ask AI Assistant
            </button>
          </aside>
        </div>
      </main>

      {showEventForm && (
        <EventForm
          date={selectedDate}
          familyMembers={familyMembers}
          onAdd={handleAddEvent}
          onClose={() => setShowEventForm(false)}
        />
      )}

      {showAIAssistant && (
        <AIAssistant
          events={events}
          currentUser={currentUser}
          onClose={() => setShowAIAssistant(false)}
        />
      )}
    </div>
  )
}
