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
import { useCallback, useEffect, useMemo, useState } from 'react'

const db = getFirestore(app)
const runnersRef = collection(db, `runners`)

export enum QueryStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Error = 'ERROR',
}

export function useRunners() {
  const [data, setData] = useState<RunnerRow[]>([])
  const [status, setStatus] = useState(QueryStatus.Loading)

  const q = useMemo(() => query(runnersRef, orderBy('lapCount', 'desc')), [])

  const refreshData = useCallback(async () => {
    setStatus(QueryStatus.Loading)
    const querySnapshot = await getDocs(q)
    setStatus(QueryStatus.Idle)
    setData(querySnapshot.docs.map((doc) => doc.data() as RunnerRow))
  }, [q])

  useEffect(() => {
    return onSnapshot(q, ({ docs }) => {
      setStatus(QueryStatus.Idle)
      setData(docs.map((doc) => doc.data() as RunnerRow))
    })
  }, [q])

  return { data, refreshData, status }
}

export async function getAllRunners() {
  const q = query(runnersRef, orderBy('lapCount', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data()) as RunnerRow[]
}

export async function incrementRunnerLap(runnerId: string) {
  try {
    const runnerRef = doc(runnersRef, runnerId)
    await setDoc(runnerRef, { runnerId, lapCount: increment(1) }, { merge: true })
  } catch (error) {
    console.error(error)
    throw new Error(`Something went wrong trying to add a lap to Runner number ${runnerId}.`)
  }
}

export async function upsertRunner(runner: InputRunnerRow) {
  try {
    const runnerRef = doc(runnersRef, runner.runnerId)
    await setDoc(runnerRef, runner, { merge: true })
  } catch (error) {
    console.error(error)
    throw new Error(`Something went wrong trying to update Runner number ${runner.runnerId}.`)
  }
}

export async function deleteRunner(runnerId: string) {
  try {
    const runnerRef = doc(runnersRef, runnerId)
    await deleteDoc(runnerRef)
  } catch (error) {
    console.error(error)
    throw new Error(`Something went wrong trying to delete Runner number ${runnerId}.`)
  }
}
