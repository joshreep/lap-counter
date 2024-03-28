import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react-native'
import { Text, TextInput, View } from './Themed'

forEachTheme((theme, wrapper) => {
  describe(`${theme} theme`, () => {
    test('TextInput should match snapshot', () => {
      const container = render(<TextInput value="Check, check. Is this thing on?" />, { wrapper })
      expect(container.toJSON()).toMatchSnapshot()
    })

    test('Text should match snapshot', () => {
      const container = render(<Text>Hello there</Text>, { wrapper })
      expect(container.toJSON()).toMatchSnapshot()
    })

    test('View should match snapshot', () => {
      const container = render(
        <View>
          <Text>Hello there</Text>
        </View>,
        { wrapper },
      )
      expect(container.toJSON()).toMatchSnapshot()
    })
  })
})

describe('TextInput', () => {})
