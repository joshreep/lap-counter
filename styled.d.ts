import 'styled-components/native'

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      background: string
      border: string
      card: string
      disabledInputBackground: string
      disabledText: string
      error: string
      inputBackground: string
      notification: string
      primary: string
      rootBackground: string
      text: string
    }
    dark: boolean
  }
}
