import { deleteRunner, upsertRunner } from '@/database/db-service'
import { StatusBar } from 'expo-status-bar'
import { FC, useCallback, useRef, useState } from 'react'
import { Alert, Button, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import SubmitAnimation, { SubmissionState } from './SubmitAnimation'
import { View } from './Themed'
import { InputRunnerRow } from '@/database/types'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import InputGroup from './form/InputGroup'
import { ButtonGroup } from './styles'

interface AddEditFormProps {
  showLapCount?: boolean
  mode: 'add' | 'edit'
}

const AddEditForm: FC<AddEditFormProps> = (props) => {
  const { mode, showLapCount } = props
  const nameInputRef = useRef<RNTextInput>(null)
  const runnerNumberInputRef = useRef<RNTextInput>(null)
  const lapCountInputRef = useRef<RNTextInput>(null)

  const params = useLocalSearchParams<{ name?: string; runnerId?: string; lapCount?: string }>()
  const navigate = useNavigation()

  const [runnerName, setRunnerName] = useState(params.name ?? '')
  const [runnerNumber, setRunnerNumber] = useState(params.runnerId ?? '')
  const [lapCount, setLapCount] = useState(params.lapCount ? +params.lapCount : 0)

  const [submissionState, setSubmissionState] = useState(SubmissionState.Idle)

  const onSubmit = useCallback(async () => {
    nameInputRef.current?.blur()
    runnerNumberInputRef.current?.blur()
    showLapCount && lapCountInputRef.current?.blur()
    setSubmissionState(SubmissionState.Pending)

    try {
      const input: InputRunnerRow = {
        name: runnerName,
        runnerId: runnerNumber,
        lapCount: lapCount,
      }
      await upsertRunner(input)
      setSubmissionState(SubmissionState.Complete)
    } catch (error) {
      console.error(error)
      setSubmissionState(SubmissionState.Error)
    }
  }, [lapCount, runnerName, runnerNumber, showLapCount])

  const onSubmitDelete = useCallback(async () => {
    nameInputRef.current?.blur()
    runnerNumberInputRef.current?.blur()
    showLapCount && lapCountInputRef.current?.blur()
    setSubmissionState(SubmissionState.Pending)

    try {
      params.runnerId && (await deleteRunner(params.runnerId))
      setSubmissionState(SubmissionState.Complete)
      navigate.goBack()
    } catch (error) {
      console.error(error)
      setSubmissionState(SubmissionState.Error)
    }
  }, [navigate, params.runnerId, showLapCount])

  const confirmDelete = useCallback(() => {
    Alert.alert(
      'Are you Sure?',
      'Are you Sure you want to delete this runner?  This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onSubmitDelete },
      ],
      { cancelable: true },
    )
  }, [onSubmitDelete])

  const onCheckAnimationFinish = useCallback(() => {
    setSubmissionState(SubmissionState.Idle)
    if (mode === 'add') {
      setRunnerName('')
      setRunnerNumber('')
      showLapCount && setLapCount(0)
      nameInputRef.current?.focus()
    } else {
      navigate.goBack()
    }
  }, [mode, navigate, showLapCount])

  return (
    <Container>
      <InputContainer>
        <InputGroup
          label="Runner Number"
          ref={runnerNumberInputRef}
          keyboardType="number-pad"
          returnKeyType="done"
          onChangeText={setRunnerNumber}
          onSubmitEditing={() => nameInputRef.current?.focus()}
          value={runnerNumber}
          disabled={mode === 'edit'}
        />
        <InputGroup
          label="Name"
          ref={nameInputRef}
          autoCapitalize="words"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => (mode === 'add' ? onSubmit() : lapCountInputRef.current?.focus())}
          onChangeText={setRunnerName}
          value={runnerName}
        />
        {showLapCount && (
          <InputGroup
            label="Lap Count"
            ref={lapCountInputRef}
            keyboardType="number-pad"
            returnKeyType="done"
            onChangeText={(text) => setLapCount(+text)}
            onSubmitEditing={() => onSubmit()}
            value={lapCount.toString()}
          />
        )}
        <ButtonGroup>
          {mode === 'edit' && <Button title="Delete" onPress={confirmDelete} color="red" />}
          <Button title="Submit" onPress={onSubmit} />
        </ButtonGroup>
      </InputContainer>

      <SubmitAnimation submissionState={submissionState} onAnimationFinish={onCheckAnimationFinish} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </Container>
  )
}

export default AddEditForm

const Container = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px 20px;
`

const InputContainer = styled(View)`
  display: flex;
  gap: 20px;
  width: 100%;
  background-color: transparent;
`
