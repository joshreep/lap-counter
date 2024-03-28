import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react-native'
import SubmitAnimation, { SubmissionState } from './SubmitAnimation'
import { FC, PropsWithChildren } from 'react'

type SetupProps = {
  submissionState: SubmissionState
  wrapper: FC<PropsWithChildren>
}

function setup({ submissionState, wrapper }: SetupProps) {
  jest.useFakeTimers()
  const onAnimationFinishMock = jest.fn()
  const container = render(
    <SubmitAnimation submissionState={submissionState} onAnimationFinish={onAnimationFinishMock} />,
    { wrapper },
  )

  return { ...container, onAnimationFinishMock }
}

forEachTheme((theme, wrapper) => {
  describe(`${theme} theme`, () => {
    test('should render null when submissionState is Idle', () => {
      const container = setup({ submissionState: SubmissionState.Idle, wrapper })
      expect(container.onAnimationFinishMock).not.toHaveBeenCalled()
      expect(container.toJSON()).toBeNull()
    })

    test('should render null when submissionState is Error', () => {
      const container = setup({ submissionState: SubmissionState.Error, wrapper })
      expect(container.onAnimationFinishMock).not.toHaveBeenCalled()
      expect(container.toJSON()).toBeNull()
    })

    test('should render LoadingAnimation when submissionState is Pending', () => {
      const container = setup({ submissionState: SubmissionState.Pending, wrapper })
      expect(container.onAnimationFinishMock).not.toHaveBeenCalled()
      expect(container.toJSON()).toMatchSnapshot()
    })

    test('should render CheckAnimation when submissionState is Complete', () => {
      jest.mock('lottie-react-native')
      const container = setup({ submissionState: SubmissionState.Complete, wrapper })
      expect(container.toJSON()).toMatchSnapshot()
      jest.runAllTimers()
      expect(container.onAnimationFinishMock).toHaveBeenCalled()
    })
  })
})
