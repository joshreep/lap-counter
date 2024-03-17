import { AuthProvider } from '@/authentication/auth'
import { useColorScheme } from '@/components/useColorScheme'
import SCDarkTheme from '@/theme/dark-theme'
import SCLightTheme from '@/theme/light-theme'
import {
  DarkTheme as RNDarkTheme,
  DefaultTheme as RNDefaultTheme,
  ThemeProvider as RNThemeProvider,
} from '@react-navigation/native'
import { Slot } from 'expo-router'
import { ThemeProvider as SCThemeProvider } from 'styled-components/native'

export default function Root() {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
      <RNThemeProvider value={colorScheme === 'dark' ? RNDarkTheme : RNDefaultTheme}>
        <SCThemeProvider theme={colorScheme === 'dark' ? SCDarkTheme : SCLightTheme}>
          <Slot />
        </SCThemeProvider>
      </RNThemeProvider>
    </AuthProvider>
  )
}
