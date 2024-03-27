import { forwardRef } from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { DisabledInput, DisabledInputText, Group, Input, Label } from './InputGroup.style'

interface InputGroupProps extends TextInputProps {
  disabled?: boolean
  label: string
}

const InputGroup = forwardRef<RNTextInput, InputGroupProps>(function InputGroup({ disabled, label, ...props }, ref) {
  return (
    <Group>
      <Label disabled={disabled}>{label}</Label>
      {disabled ? (
        <DisabledInput>
          <DisabledInputText testID={props.testID}>{props.value}</DisabledInputText>
        </DisabledInput>
      ) : (
        <Input {...props} ref={ref} />
      )}
    </Group>
  )
})

export default InputGroup
