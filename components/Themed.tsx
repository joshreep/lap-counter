/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from './useColorScheme'
import styled from 'styled-components/native'

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']
export type TextInputProps = ThemeProps & DefaultTextInput['props']

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light'
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return Colors[theme][colorName]
  }
}

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
    (props.theme.dark ? props.darkColor : props.lightColor) ?? props.theme.colors.background};
`
