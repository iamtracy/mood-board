import { useMutation, useQuery } from '@tanstack/react-query'

import api from './api'

const fetchData = async () => {
  const response = await api.get('mood')
  return response.data 
}

const createMood = async () => {
  const response = await api.post('mood', { mood: 'happy' })
  return response.data 
}

export function App() {
  const { data, error, isLoading } = useQuery({ queryKey: ['mood'], queryFn: fetchData })

  const createMoodMutation = useMutation({
    mutationFn: createMood,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div>
        <h2>Data from API:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <button onClick={() => createMoodMutation.mutate()}>Create Happy</button>
      </div>
    </div>
  )
}

export default App
