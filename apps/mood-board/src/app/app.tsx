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

const deleteMood = async (id: string) => {
  const response = await api.delete(`mood/${id}`)
  return response.data
}

export function App() {
  const [moodInput, setMoodInput] = useState('')
  const { data, error, isLoading, refetch } = useQuery({
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

  const deleteMoodMutation = useMutation({
    mutationFn: deleteMood,
    onSuccess: refetch,
  })


  if (isLoading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error.message}</div>

  return (
    <div className="app">
      <h1 className="header">Mood Tracker</h1>
      <div className="mood-container">
        <h2>Data from API:</h2>
        {data.map((mood: Mood) => (
          <div key={mood.id} className="mood-card">
            <div className="mood-text">{mood.mood}</div>
            <div className="mood-id">ID: {mood.id}</div>
            <button
              className="delete-button"
              onClick={() => deleteMoodMutation.mutate(mood.id)}
              disabled={deleteMoodMutation.isPending}
            >
              Delete
            </button>
          </div>
        ))}
        
        <div className="input-container">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="Enter your mood"
            className="mood-input"
          />
          <button
            className="create-button"
            onClick={() => createMoodMutation.mutate(moodInput)}
            disabled={createMoodMutation.isPending || !moodInput}
          >
            {createMoodMutation.isPending ? 'Creating...' : 'Create Mood'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
