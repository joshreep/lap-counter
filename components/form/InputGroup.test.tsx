import { getThemeWrapper, themes } from '@/test-utils/ThemeWrapper'
import InputGroup from './InputGroup'
import { render } from '@testing-library/react-native'

themes.forEach((theme) => {
  const wrapper = getThemeWrapper(theme)

  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const container = render(<InputGroup label="name" value="George Washington" />, { wrapper })
      expect(container.toJSON()).toMatchSnapshot()
    })

    test('should match snapshot when disabled', () => {
      const container = render(<InputGroup label="birthday" value="7/4/1776" disabled />, { wrapper })
      expect(container.toJSON()).toMatchSnapshot()
    })
  })
})
