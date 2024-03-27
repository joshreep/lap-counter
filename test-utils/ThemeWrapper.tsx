import SCDarkTheme from '@/theme/dark-theme'
import SCLightTheme from '@/theme/light-theme'
import {
  DarkTheme as RNDarkTheme,
  DefaultTheme as RNDefaultTheme,
  ThemeProvider as RNThemeProvider,
} from '@react-navigation/native'
import { FC, PropsWithChildren } from 'react'
import { ColorSchemeName } from 'react-native'
import { ThemeProvider as SCThemeProvider } from 'styled-components/native'

export const themes: ColorSchemeName[] = ['light', 'dark']

export function getThemeWrapper(theme: ColorSchemeName) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    return (
      <RNThemeProvider value={theme === 'dark' ? RNDarkTheme : RNDefaultTheme}>
        <SCThemeProvider theme={theme === 'dark' ? SCDarkTheme : SCLightTheme}>{children}</SCThemeProvider>
      </RNThemeProvider>
    )
  }

  return Wrapper
}

type ForEachThemeCallback = (theme: ColorSchemeName, wrapper: FC<PropsWithChildren>) => void

export function forEachTheme(callback: ForEachThemeCallback) {
  themes.forEach((theme) => {
    callback(theme, getThemeWrapper(theme))
  })
}
