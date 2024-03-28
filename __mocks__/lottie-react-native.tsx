import LottieView, { LottieViewProps } from 'lottie-react-native'
import { useEffect } from 'react'
import { ViewProps } from 'react-native'

const MockLottieView = ({ onAnimationFinish, ...props }: LottieViewProps & { containerProps?: ViewProps }) => {
  useEffect(() => {
    onAnimationFinish?.(false)
  }, [onAnimationFinish])

  return <LottieView {...props} />
}

export default MockLottieView
