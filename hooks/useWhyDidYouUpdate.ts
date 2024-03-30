import { useEffect, useRef } from 'react'

type Props = Record<string, unknown>

export default function useWhyDidYouUpdate(name: string, props: Props, predicate = true) {
  const previousProps = useRef<Props>()

  useEffect(() => {
    if (previousProps.current && predicate) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })

      const changesObj: Partial<Props> = {}

      allKeys.forEach((key) => {
        if (previousProps.current?.[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current?.[key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changesObj).length) {
        console.log(`[${name}]`, changesObj)
      }
    }

    previousProps.current = props
  })
}
