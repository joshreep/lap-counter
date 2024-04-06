/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from 'react-native'

import styled from 'styled-components/native'

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props'] & { rootBackground?: boolean }
export type TextInputProps = ThemeProps & DefaultTextInput['props']

export const TextInput = styled(DefaultTextInput)`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  border-radius: 4px;
`

export const Text = styled(DefaultText)`
  color: ${({ theme }) => theme.colors.text};
`

export const View = styled(({ lightColor, darkColor, ...rest }: ViewProps) => <DefaultView {...rest} />)`
  background-color: ${(props) =>
    (props.theme.dark ? props.darkColor : props.lightColor) ?? props.rootBackground
      ? props.theme.colors.rootBackground
      : props.theme.colors.background};
`
