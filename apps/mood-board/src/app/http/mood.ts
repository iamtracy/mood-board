import api from './api'

export interface Mood {
	id: string
	mood: string
}

export const fetchData = async () => {
	const response = await api.get('mood')
	return response.data
}
  
export const createMood = async (mood: string) => {
	const response = await api.post('mood', { mood })
	return response.data
}
  
export const updateMood = async (input: Mood) => {
	const response = await api.put('mood', input)
	return response.data
}
  
export const deleteMood = async (id: string) => {
	const response = await api.delete(`mood/${id}`)
	return response.data
}