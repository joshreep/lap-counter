import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { act, fireEvent, renderRouter } from 'expo-router/testing-library'
import AddEditForm, { AddEditFormProps } from './AddEditForm'
import { DBService } from '@/database/db-service'
import { Alert } from 'react-native'
import { router } from 'expo-router'

const modes: AddEditFormProps['mode'][] = ['add', 'edit']

jest.mock('@/database/db-service')
jest.useFakeTimers()

forEachTheme((theme, wrapper) => {
  describe(`${theme} theme`, () => {
    modes.forEach((mode) => {
      describe(`${mode} mode`, () => {
        afterEach(() => {
          ;(DBService.upsertRunner as jest.Mock).mockReset()
        })

        test('should match snapshot', () => {
          const container = renderRouter({ index: () => <AddEditForm mode={mode} /> }, { wrapper })
          expect(container.toJSON()).toMatchSnapshot()
        })

        test('should handle inputs and submit editing', async () => {
          const { getByTestId } = renderRouter({ index: () => <AddEditForm mode={mode} /> }, { wrapper })

          if (mode === 'add') {
            act(() => fireEvent.changeText(getByTestId('runnerIdInput'), '1'))
            expect(getByTestId('runnerIdInput')).toHaveDisplayValue('1')
            act(() => fireEvent(getByTestId('runnerIdInput'), 'submitEditing'))
          }
          act(() => fireEvent.changeText(getByTestId('runnerNameInput'), 'Thomas Jefferson'))
          expect(getByTestId('runnerNameInput')).toHaveDisplayValue('Thomas Jefferson')
          await act(async () => fireEvent(getByTestId('runnerNameInput'), 'submitEditing'))
          if (mode === 'add') {
            expect(DBService.upsertRunner).toHaveBeenCalled()
          }
          if (mode === 'edit') {
            expect(DBService.upsertRunner).not.toHaveBeenCalled()
            act(() => fireEvent.changeText(getByTestId('lapCountInput'), 101))
            expect(getByTestId('lapCountInput')).toHaveDisplayValue('101')
            await act(async () => fireEvent(getByTestId('lapCountInput'), 'submitEditing'))
            expect(DBService.upsertRunner).toHaveBeenCalled()
          }
        })

        test('should handle submit', async () => {
          const { getByTestId, getByText } = renderRouter(
            { index: () => <AddEditForm mode={mode} />, originPage: () => null },
            { wrapper, initialUrl: '/originPage' },
          )

          act(() => {
            router.navigate('/')
          })
          act(() => {
            mode === 'add' && fireEvent.changeText(getByTestId('runnerIdInput'), '1')
            fireEvent.changeText(getByTestId('runnerNameInput'), 'George Washington')
            mode === 'edit' && fireEvent.changeText(getByTestId('lapCountInput'), 20)
          })
          await act(async () => {
            fireEvent.press(getByText('Submit'))
          })

          expect(DBService.upsertRunner).toHaveBeenCalled()

          // allow animations to finish
          act(() => {
            jest.runAllTimers()
          })

          if (mode === 'add') {
            expect(getByTestId('runnerIdInput')).toHaveDisplayValue('')
            expect(getByTestId('runnerNameInput')).toHaveDisplayValue('')
          }
        })

        if (mode === 'edit') {
          test('should handle delete', async () => {
            const { getByText } = renderRouter(
              {
                index: () => <AddEditForm mode="edit" />,
                page1: () => null,
                page2: () => null,
              },
              { wrapper, initialUrl: '/page1' },
            )
            act(() => {
              router.navigate('/page2')
              router.navigate({ pathname: '/', params: { name: 'George', runnerId: '17', lapCount: 10 } })
            })

            const alertSpy = jest.spyOn(Alert, 'alert')

            act(() => {
              fireEvent.press(getByText('Delete'))
            })

            expect(alertSpy).toHaveBeenCalled()

            await act(async () => {
              alertSpy.mock.calls[0][2]?.[1].onPress?.()
            })

            expect(DBService.deleteRunner).toHaveBeenCalledWith('17')
          })
        }
      })
    })
  })
})
