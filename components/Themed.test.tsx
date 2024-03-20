import { getThemeWrapper } from '@/test-utils/ThemeWrapper'
import { render, screen } from '@testing-library/react-native'
import { ColorSchemeName } from 'react-native'
import { Text, TextInput, View } from './Themed'

const themes: ColorSchemeName[] = ['dark', 'light']

themes.forEach((theme) => {
  const wrapper = getThemeWrapper(theme)

  describe(`TextInput: ${theme} theme`, () => {
    test('should match snapshot', () => {
      render(<TextInput value="Check, check. Is this thing on?" />, { wrapper })
      expect(screen.toJSON()).toMatchSnapshot()
    })
  })

  describe(`Text: ${theme} theme`, () => {
    test('should match snapshot', () => {
      render(<Text>Hello there</Text>, { wrapper })
      expect(screen.toJSON()).toMatchSnapshot()
    })
  })

  describe(`View: ${theme} theme`, () => {
    test('should match snapshot', () => {
      render(
        <View>
          <Text>Hello there</Text>
        </View>,
        { wrapper },
      )
      expect(screen.toJSON()).toMatchSnapshot()
    })
  })
})

describe('TextInput', () => {})
