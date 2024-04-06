import { act, renderHook, waitFor } from '@testing-library/react-native'
import { AuthContext, AuthProvider, AuthStatus } from './auth'
import * as Auth from 'firebase/auth'
import { Alert, Linking } from 'react-native'
import { SplashScreen } from 'expo-router'
import { FC, PropsWithChildren, useContext } from 'react'

jest.mock('firebase/auth')
jest.mock('@react-native-async-storage/async-storage')
jest.mock('./getAuth.native')
jest.spyOn(SplashScreen, 'hideAsync')

const wrapper: FC<PropsWithChildren> = ({ children }) => <AuthProvider>{children}</AuthProvider>

afterEach(() => {
  jest.resetAllMocks()
})

test('should return Initializing initially', () => {
  const { result } = renderHook(() => useContext(AuthContext), { wrapper })
  expect(result.current.authStatus).toBe(AuthStatus.Initializing)
})

test('should return authStatus = Unauthenticated when logged out', () => {
  const { result } = renderHook(() => useContext(AuthContext), { wrapper })
  expect(Auth.onAuthStateChanged).toHaveBeenCalledTimes(1)
  act(() => (Auth.onAuthStateChanged as jest.Mock).mock.calls[0][1](null))
  expect(result.current.authStatus).toBe(AuthStatus.Unauthenticated)
  expect(result.current.user).toBeNull()
  expect(result.current.error).toBeNull()
})

test('should return authStatus = Authenticated when already logged in', async () => {
  const { result } = renderHook(() => useContext(AuthContext), { wrapper })
  const mockUser = { name: 'foo', email: 'foo@bar.baz' }
  expect(Auth.onAuthStateChanged).toHaveBeenCalledTimes(1)
  act(() => (Auth.onAuthStateChanged as jest.Mock).mock.calls[0][1](mockUser))
  expect(result.current.authStatus).toBe(AuthStatus.Authenticated)
  expect(result.current.user).toBe(mockUser)
  expect(result.current.error).toBeNull()
})

test('should return authStatus = Error when error occurs', () => {
  const { result } = renderHook(() => useContext(AuthContext), { wrapper })
  expect(Auth.onAuthStateChanged).toHaveBeenCalledTimes(1)
  act(() => (Auth.onAuthStateChanged as jest.Mock).mock.calls[0][2](new Error('oopsies')))
  expect(result.current.error?.message).toBe('oopsies')
  expect(result.current.authStatus).toBe(AuthStatus.Error)
  expect(result.current.user).toBeNull()
})

describe('signIn', () => {
  test('should handle stub when outside AuthProvider', () => {
    const { result } = renderHook(() => useContext(AuthContext))
    expect(result.current.signIn).rejects.toBe('AuthContext has not yet been initialized')
  })

  test('should handle signIn', async () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    await act(() => result.current.signIn('username', 'password'))
    expect(Auth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1)
    expect(result.current.authStatus).toBe(AuthStatus.Authenticated)
  })

  test('should handle error', async () => {
    jest.spyOn(Auth, 'signInWithEmailAndPassword').mockRejectedValueOnce(new Error('oopsies'))
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    await act(() => result.current.signIn('username', 'password'))
    expect(result.current.authStatus).toBe(AuthStatus.Error)
    expect(result.current.error?.message).toBe('oopsies')
  })
})

describe('signOut', () => {
  test('should handle stub when outside AuthProvider', () => {
    const { result } = renderHook(() => useContext(AuthContext))
    expect(result.current.signOut).rejects.toBe('AuthContext has not yet been initialized')
  })

  test('should handle signOut', async () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    await act(() => result.current.signOut())
    expect(Auth.signOut).toHaveBeenCalledTimes(1)
    expect(result.current.authStatus).toBe(AuthStatus.Unauthenticated)
  })

  test('should handle error', async () => {
    jest.spyOn(Auth, 'signOut').mockRejectedValueOnce(new Error('oopsies'))
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    await act(() => result.current.signOut())
    expect(result.current.authStatus).toBe(AuthStatus.Error)
    expect(result.current.error?.message).toBe('oopsies')
  })
})

describe('signUp', () => {
  test('should handle stub when outside AuthProvider', () => {
    const { result } = renderHook(() => useContext(AuthContext))
    expect(result.current.signUp).rejects.toBe('AuthContext has not yet been initialized')
  })

  test('should handle signUp', async () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    await act(() => result.current.signUp('username', 'password'))
    expect(Auth.createUserWithEmailAndPassword).toHaveBeenCalledTimes(1)
    expect(result.current.authStatus).toBe(AuthStatus.Authenticated)
  })

  test('should handle error', async () => {
    jest.spyOn(Auth, 'createUserWithEmailAndPassword').mockRejectedValueOnce(new Error('oopsies'))
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    await act(() => result.current.signUp('username', 'password'))
    expect(result.current.authStatus).toBe(AuthStatus.Error)
    expect(result.current.error?.message).toBe('oopsies')
  })
})

describe('resetPassword', () => {
  test('should handle stub when outside AuthProvider', () => {
    const { result } = renderHook(() => useContext(AuthContext))
    expect(result.current.resetPassword).rejects.toBe('AuthContext has not yet been initialized')
  })
  ;[true, false].forEach((canOpenURL) => {
    test(`should handle resetPassword (canOpenURL = ${canOpenURL})`, async () => {
      const alertSpy = jest.spyOn(Alert, 'alert')
      const openURLSpy = jest.spyOn(Linking, 'openURL')
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(canOpenURL)

      const { result } = renderHook(() => useContext(AuthContext), { wrapper })
      act(() => result.current.resetPassword('username'))

      expect(alertSpy).toHaveBeenCalledTimes(1)

      await act(() => alertSpy.mock.calls[0][2]?.[1].onPress?.())

      expect(Auth.sendPasswordResetEmail).toHaveBeenCalledTimes(1)
      expect(alertSpy).toHaveBeenCalledTimes(2)

      alertSpy.mock.calls[1][2]?.[0].onPress?.()
      if (canOpenURL) {
        await waitFor(() => expect(openURLSpy).toHaveBeenCalledTimes(1))
      } else {
        expect(openURLSpy).not.toHaveBeenCalled()
      }
    })
  })

  test('should handle error', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert')
    jest.spyOn(Auth, 'sendPasswordResetEmail').mockRejectedValueOnce(new Error('oopsies'))

    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    act(() => result.current.resetPassword('username'))

    expect(alertSpy).toHaveBeenCalledTimes(1)

    await act(() => alertSpy.mock.calls[0][2]?.[1].onPress?.())

    expect(result.current.authStatus).toBe(AuthStatus.Error)
    expect(result.current.error?.message).toBe('oopsies')
  })
})
