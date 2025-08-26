export interface MotorcycleEvent {
  id: string
  title: string
  description: string
  date: string
  type: string
}

export const getUpcomingEvents = () => {
  return [
    {
      id: '1',
      title: 'Safety Training',
      description: 'Basic safety training course',
      date: new Date().toISOString(),
      type: 'training'
    }
  ]
}

export const createEvent = (eventData: Omit<MotorcycleEvent, 'id'>) => {
  return {
    id: Date.now().toString(),
    ...eventData
  }
}