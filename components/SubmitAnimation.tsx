import { LottieViewProps } from 'lottie-react-native'
import { FC, useCallback } from 'react'
import { CheckAnimation, LoadingAnimation } from './styles'

export enum SubmissionState {
  Idle,
  Pending,
  Complete,
  Error,
}

interface SubmitAnimationProps extends Omit<LottieViewProps, 'source'> {
  submissionState: SubmissionState
  onAnimationFinish: NonNullable<LottieViewProps['onAnimationFinish']>
}

const SubmitAnimation: FC<SubmitAnimationProps> = (props) => {
  const { onAnimationFinish, submissionState } = props
  const onCheckAnimationFinished = useCallback(
    (isCancelled: boolean) => {
      setTimeout(() => {
        onAnimationFinish(isCancelled)
      }, 150)
    },
    [onAnimationFinish],
  )

  if (submissionState === SubmissionState.Pending)
    return <LoadingAnimation source={require('@/assets/animations/loading-animation.json')} />

  if (submissionState === SubmissionState.Complete)
    return (
      <CheckAnimation
        source={require('@/assets/animations/check-animation.json')}
        onAnimationFinish={onCheckAnimationFinished}
      />
    )

  return null
}

export default SubmitAnimation
