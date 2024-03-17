import { useCallback, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled from 'styled-components/native'

import { Text, TextInput } from '@/components/Themed'
import SubmitAnimation, { SubmissionState } from '@/components/SubmitAnimation'
import { incrementRunnerLap } from '@/database/db-service'

export default function IndexTabScreen() {
  const textInputRef = useRef<RNTextInput>(null)

  const [submissionState, setSubmissionState] = useState(SubmissionState.Idle)
  const [error, setError] = useState<string>()

  const onSubmitEditing = useCallback(async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    if (event.nativeEvent.text) {
      setSubmissionState(SubmissionState.Pending)
      textInputRef.current?.blur()

      try {
        await incrementRunnerLap(event.nativeEvent.text)
        setSubmissionState(SubmissionState.Complete)
      } catch (error) {
        console.error(error)
        setSubmissionState(SubmissionState.Error)
        if (typeof error === 'string') setError(error)
        if (error instanceof Error) setError(error.message)
      }
    }
  }, [])

  const onAnimationFinish = useCallback(() => {
    setSubmissionState(SubmissionState.Idle)
    textInputRef.current?.focus()
  }, [])

  const onFocus = useCallback(() => {
    setSubmissionState(SubmissionState.Idle)
  }, [])

  return (
    <Container>
      <Instruction>
        To add 1 lap to a runner&apos;s account, enter the runners number below and press &ldquo;done&rdquo;.
      </Instruction>
      <Title>Runner Number</Title>
      <Input
        clearTextOnFocus
        error={submissionState === SubmissionState.Error}
        keyboardType="number-pad"
        onSubmitEditing={onSubmitEditing}
        ref={textInputRef}
        returnKeyType="done"
        onFocus={onFocus}
      />
      {submissionState === SubmissionState.Error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitAnimation submissionState={submissionState} onAnimationFinish={onAnimationFinish} />
    </Container>
  )
}

const ErrorMessage = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  font-size: 16px;
`

const Instruction = styled(Text)`
  text-align: center;
  font-size: 18px;
`

const Title = styled(Text)`
  font-size: 30px;
  font-weight: bold;
`

const Input = styled(TextInput)<{ error: boolean }>`
  text-align: center;
  width: 100%;
  padding: 20px;
  font-size: 50px;
  ${({ theme, error }) => {
    if (error) {
      return `
        border: 1px solid ${theme.colors.error};
        color: ${theme.colors.error};
      `
    }
  }}
`

const Container = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  background-color: ${({ theme }) => theme.colors.rootBackground};
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
`
