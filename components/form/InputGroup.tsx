import { forwardRef } from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import styled from 'styled-components/native'
import { Text, TextInput, View } from '../Themed'

interface InputGroupProps extends TextInputProps {
  disabled?: boolean
  label: string
}

const InputGroup = forwardRef<RNTextInput, InputGroupProps>(({ disabled, label, ...props }, ref) => {
  return (
    <Group>
      <Label disabled={disabled}>{label}</Label>
      {disabled ? (
        <DisabledInput>
          <DisabledInputText>{props.value}</DisabledInputText>
        </DisabledInput>
      ) : (
        <Input {...props} ref={ref} />
      )}
    </Group>
  )
})

InputGroup.displayName = 'InputGroup'

export default InputGroup

const Group = styled(View)`
  background-color: transparent;
  gap: 4px;
`
const Label = styled(Text)<{
  disabled?: boolean
}>`
  padding: 0;
  font-size: 16px;
  margin-left: 5px;
  color: ${(props) => (props.disabled ? props.theme.colors.disabledText : props.theme.colors.text)};
`
const Input = styled(TextInput).attrs({
  clearButtonMode: 'while-editing',
})`
  width: 100%;
  padding: 15px;
  font-size: 16px;
`
const DisabledInput = styled(View)`
  width: 100%;
  padding: 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.disabledInputBackground};
`

const DisabledInputText = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.disabledText};
`
