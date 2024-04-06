import { useCallback, useState } from 'react'

export default function useRerender() {
  const [, setState] = useState(0)

  const rerender = useCallback(() => {
    setState((previous) => previous + 1)
  }, [])

  return rerender
}
