import React, { useState } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'

export default function EventForm({ date, familyMembers, onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('09:00')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [description, setDescription] = useState('')

  const toggleMember = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member))
    } else {
      setSelectedMembers([...selectedMembers, member])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter an event title')
      return
    }
    if (selectedMembers.length === 0) {
      alert('Please select at least one family member')
      return
    }

    onAdd({
      title,
      description,
      date: date || new Date(),
      time,
      members: selectedMembers
    })
    
    setTitle('')
    setTime('09:00')
    setSelectedMembers([])
    setDescription('')
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Add Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Soccer practice"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="text"
              disabled
              value={date ? format(new Date(date), 'MMM dd, yyyy') : 'Select a date'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this event"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Family Members *
            </label>
            <div className="space-y-2">
              {familyMembers.map(member => (
                <label key={member} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member)}
                    onChange={() => toggleMember(member)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700">{member}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Add Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
