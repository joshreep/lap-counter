import styled from 'styled-components/native'
import { Text, TextInput, View } from '../Themed'

export const Group = styled(View)`
  background-color: transparent;
  gap: 4px;
`
export const Label = styled(Text)<{ disabled?: boolean }>`
  padding: 0;
  font-size: 16px;
  margin-left: 5px;
  color: ${(props) => (props.disabled ? props.theme.colors.disabledText : props.theme.colors.text)};
`
export const Input = styled(TextInput).attrs({ clearButtonMode: 'while-editing' })`
  width: 100%;
  padding: 15px;
  font-size: 16px;
`
export const DisabledInput = styled(View)`
  width: 100%;
  padding: 15px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.disabledInputBackground};
`

export const DisabledInputText = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.disabledText};
`
