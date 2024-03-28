import { RunnerRow } from '@/database/types'

type DatabaseRecord<T> = T & {
  id: string
}

const mockRunners: DatabaseRecord<RunnerRow>[] = [
  { id: '1', runnerId: '1', name: 'George Washington', lapCount: 10 },
  { id: '2', runnerId: '2', name: 'John Adams', lapCount: 7 },
  { id: '3', runnerId: '3', name: 'Thomas Jefferson', lapCount: 7 },
  { id: '4', runnerId: '4', name: 'Abraham Lincon', lapCount: 5 },
]

export default mockRunners
