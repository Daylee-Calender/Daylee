import React, { useState } from 'react'
import { X, Send } from 'lucide-react'
import { format } from 'date-fns'

export default function AIAssistant({ events, currentUser, onClose }) {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: `Hi ${currentUser}! I'm your family calendar AI assistant. You can ask me things like:\n- "Can I play with friends on Saturday?"\n- "What's my schedule for next week?"\n- "Do I have time for a movie tomorrow?"`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const getWeatherWarning = () => {
    const warnings = [
      '⚠️ There might be rain tomorrow. You may want to plan indoor activities.',
      '☀️ It will be sunny and warm. Great day for outdoor activities!',
      '❄️ Cold weather expected. Dress warmly!',
      '💨 Windy conditions expected tomorrow.',
      '🌤️ Partly cloudy with mild temperatures.'
    ]
    return warnings[Math.floor(Math.random() * warnings.length)]
  }

  const getUserEvents = () => {
    return events.filter(e => e.members.includes(currentUser))
  }

  const analyzeQuery = (query) => {
    const lowerQuery = query.toLowerCase()
    const userEvents = getUserEvents()

    // Check for availability questions
    if (lowerQuery.includes('can i') || lowerQuery.includes('can i ')) {
      const dayMatch = query.match(/(?:on|this|next)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today)/i)
      
      if (dayMatch) {
        const day = dayMatch[1].toLowerCase()
        const eventsForDay = userEvents.filter(e => {
          const eventDate = new Date(e.date)
          const eventDay = format(eventDate, 'EEEE').toLowerCase()
          return eventDay === day || day === 'tomorrow' || day === 'today'
        })

        let response = `On ${day}, you have ${eventsForDay.length} event(s):\n`
        if (eventsForDay.length === 0) {
          response = `Great! You're free on ${day}! ${getWeatherWarning()}`
        } else {
          eventsForDay.forEach(e => {
            response += `\n📅 ${e.title} at ${e.time}\n   For: ${e.members.join(', ')}`
          })
          response += `\n\nYou might have some free time, but check the schedule above. ${getWeatherWarning()}`
        }
        return response
      }
    }

    // Check for schedule questions
    if (lowerQuery.includes('schedule') || lowerQuery.includes('what do i have')) {
      const userEventsList = userEvents.slice(0, 5)
      if (userEventsList.length === 0) {
        return `You don't have any events scheduled. You're all free! ${getWeatherWarning()}`
      }
      
      let response = `Here are your upcoming events:\n`
      userEventsList.forEach(e => {
        const eventDate = format(new Date(e.date), 'MMM dd, yyyy')
        response += `\n📅 ${e.title}\n   ${eventDate} at ${e.time}`
      })
      response += `\n\n${getWeatherWarning()}`
      return response
    }

    // Default response
    return `I can help you check your schedule and see if you have free time for activities. Ask me:\n- "Can I play with friends on Saturday?"\n- "What's my schedule for this week?"\n- "Do I have time tomorrow?"\n\n${getWeatherWarning()}`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { type: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = analyzeQuery(input)
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }])
      setLoading(false)
    }, 800)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🤖 AI Assistant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-300 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about your schedule..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="btn-primary disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
