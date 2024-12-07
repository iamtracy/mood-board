import { useQuery } from '@tanstack/react-query'

import api from './api'

const fetchData = async () => {
  const response = await api.get('/')
  return response.data 
}

export function App() {
  const { data, error, isLoading } = useQuery({ queryKey: ['api'], queryFn: fetchData })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div>
        <h2>Data from API:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App
