import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import api from './api'
import './app.css'

interface Mood {
  id: string
  mood: string
}

const fetchData = async () => {
  const response = await api.get('mood')
  return response.data
}

const createMood = async (mood: string) => {
  const response = await api.post('mood', { mood })
  return response.data
}

const updateMood = async (input: Mood) => {
  const response = await api.put('mood', input)
  return response.data
}

const deleteMood = async (id: string) => {
  const response = await api.delete(`mood/${id}`)
  return response.data
}

export function App() {
  const [moodInput, setMoodInput] = useState('')
  const [editingMoodId, setEditingMoodId] = useState<string | null>(null)

  const { data, error, isPending, refetch } = useQuery({
    queryKey: ['mood'],
    queryFn: fetchData,
  })

  const createMoodMutation = useMutation({
    mutationFn: createMood,
    onSuccess: () => {
      refetch()
      setMoodInput('')
    },
  })

  const updateMoodMutation = useMutation({
    mutationFn: updateMood,
    onSuccess: () => {
      refetch()
      setMoodInput('')
      setEditingMoodId(null)
    },
  })

  const deleteMoodMutation = useMutation({
    mutationFn: deleteMood,
    onSuccess: refetch,
  })

  if (error) return <div className="error">Error: Something went wrong.</div>

  const handleEdit = (mood: Mood) => {
    setMoodInput(mood.mood)
    setEditingMoodId(mood.id)
  }

  const handleSubmit = () => {
    if (editingMoodId) {
      updateMoodMutation.mutate({ id: editingMoodId, mood: moodInput })
    } else {
      createMoodMutation.mutate(moodInput)
    }
  }

  return (
    <div className="app">
      <h1 className="header">Mood Tracker</h1>
      <div className="mood-container">
        <h2>Data from API:</h2>
        {(data ?? []).map((mood: Mood) => (
          <div key={mood.id} className="mood-card">
            <div className="mood-text">{mood.mood}</div>
            <div className="mood-id">ID: {mood.id}</div>
            <button
              className="edit-button"
              onClick={() => handleEdit(mood)}
              disabled={updateMoodMutation.isPending}
            >
              {updateMoodMutation.isPending ? 'Editing...' : 'Edit'}
            </button>
            <button
              className="delete-button"
              onClick={() => deleteMoodMutation.mutate(mood.id)}
              disabled={deleteMoodMutation.isPending}
            >
              {deleteMoodMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        ))}

        <div className="input-container">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder={editingMoodId ? 'Update your mood' : 'Enter your mood'}
            className="mood-input"
          />
          <button
            className="create-button"
            onClick={handleSubmit}
            disabled={createMoodMutation.isPending || updateMoodMutation.isPending || !moodInput}
          >
            {createMoodMutation.isPending || updateMoodMutation.isPending
              ? 'Saving...'
              : editingMoodId
              ? 'Update Mood'
              : 'Create Mood'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
