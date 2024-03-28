import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react-native'
import RunnerRowListItem from './RunnerRowListItem'
import { ReactElement } from 'react'

forEachTheme((theme, wrapper) => {
  describe(`${theme} theme`, () => {
    test('should match snapshot', () => {
      const container = render(
        RunnerRowListItem({
          index: 0,
          item: { runnerId: '1', name: 'George Washington', lapCount: 100 },
          separators: { highlight() {}, unhighlight() {}, updateProps() {} },
        }) as ReactElement,
        { wrapper },
      )
      expect(container.toJSON()).toMatchSnapshot()
    })

    test('should render with no name prop', () => {
      const container = render(
        RunnerRowListItem({
          index: 0,
          item: { runnerId: '1', lapCount: 100 },
          separators: { highlight() {}, unhighlight() {}, updateProps() {} },
        }) as ReactElement,
        { wrapper },
      )
      expect(container.toJSON()).toMatchSnapshot()
    })
  })
})
