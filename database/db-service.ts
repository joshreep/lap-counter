import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { InputRunnerRow, RunnerRow } from './types'
import app from '@/firebaseConfig'
import { useCallback, useEffect, useState } from 'react'

export enum QueryStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Error = 'ERROR',
}

class DBServiceSingleton {
  private _db: ReturnType<typeof getFirestore>
  private _runnersCollectionRef: ReturnType<typeof collection>
  private _runnersListQuery: ReturnType<typeof query>

  constructor() {
    this._db = getFirestore(app)
    this._runnersCollectionRef = collection(this._db, 'runners')
    this._runnersListQuery = query(this._runnersCollectionRef, orderBy('lapCount', 'desc'))
  }

  get db() {
    return this._db
  }

  get runnersCollectionRef() {
    return this._runnersCollectionRef
  }

  get runnersListQuery() {
    return this._runnersListQuery
  }

  async getAllRunners() {
    const querySnapshot = await getDocs(this.runnersListQuery)
    return querySnapshot.docs.map((doc) => doc.data()) as RunnerRow[]
  }

  async incrementRunnerLap(runnerId: string) {
    try {
      const runnerRef = doc(this.runnersCollectionRef, runnerId)
      await setDoc(runnerRef, { runnerId, lapCount: increment(1) }, { merge: true })
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong trying to add a lap to Runner number ${runnerId}.`)
    }
  }

  async upsertRunner(runner: InputRunnerRow) {
    try {
      const runnerRef = doc(this.runnersCollectionRef, runner.runnerId)
      await setDoc(runnerRef, runner, { merge: true })
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong trying to update Runner number ${runner.runnerId}.`)
    }
  }

  async deleteRunner(runnerId: string) {
    try {
      const runnerRef = doc(this.runnersCollectionRef, runnerId)
      await deleteDoc(runnerRef)
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong trying to delete Runner number ${runnerId}.`)
    }
  }
}

export const DBService = new DBServiceSingleton()

export function useRunners() {
  const [data, setData] = useState<RunnerRow[]>([])
  const [status, setStatus] = useState(QueryStatus.Loading)

  const refreshData = useCallback(async () => {
    setStatus(QueryStatus.Loading)
    const data = await DBService.getAllRunners()
    setStatus(QueryStatus.Idle)
    setData(data)
  }, [])

  useEffect(() => {
    return onSnapshot(DBService.runnersListQuery, ({ docs }) => {
      setStatus(QueryStatus.Idle)
      setData(docs.map((doc) => doc.data() as RunnerRow))
    })
  }, [])

  return { data, refreshData, status }
}
