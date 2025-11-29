import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function FamilyCodeSetup({ onSetup }) {
  const [mode, setMode] = useState('choose') // choose, create, join
  const [familyName, setFamilyName] = useState('')
  const [familyCode, setFamilyCode] = useState('')
  const [members, setMembers] = useState([''])
  const [joinCode, setJoinCode] = useState('')

  const generateFamilyCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreate = () => {
    if (!familyName.trim() || members.some(m => !m.trim())) {
      alert('Please fill in all fields')
      return
    }
    const code = generateFamilyCode()
    setFamilyCode(code)
    onSetup(code, familyName, members.filter(m => m.trim()))
  }

  const handleJoin = () => {
    if (!joinCode.trim()) {
      alert('Please enter a family code')
      return
    }
    // In a real app, you'd validate this code with a backend
    const defaultMembers = ['You', 'Family Member']
    onSetup(joinCode, 'Family Calendar', defaultMembers)
  }

  const addMember = () => {
    setMembers([...members, ''])
  }

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const updateMember = (index, value) => {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Daylee</h1>
        <p className="text-center text-gray-600 mb-8">Family Calendar & AI Assistant</p>

        {mode === 'choose' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Create Family Calendar
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Join Family Calendar
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Family Name
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g., The Smiths"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Family Members
              </label>
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => updateMember(index, e.target.value)}
                      placeholder="Member name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {members.length > 1 && (
                      <button
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addMember}
                className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Plus size={18} />
                Add Member
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCreate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Create Calendar
              </button>
              <button
                onClick={() => setMode('choose')}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Family Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g., ABC123"
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center text-2xl font-mono"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleJoin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Join Calendar
              </button>
              <button
                onClick={() => setMode('choose')}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
