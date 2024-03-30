import { SplashScreen } from 'expo-router'
import * as Auth from 'firebase/auth'
import { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Linking } from 'react-native'
import auth from './getAuth'

export enum AuthStatus {
  Initializing = 'INITIALIZING',
  Unauthenticated = 'UNAUTHENTICATED',
  Pending = 'PENDING',
  Authenticated = 'AUTHENTICATED',
  Error = 'ERROR',
}

interface AuthContextType {
  authStatus: AuthStatus | null
  error: null | Error
  resetPassword: (email: string) => void
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  user: Auth.User | null
}

const authContextNotInitializedRejection = () => Promise.reject('AuthContext has not yet been initialized')

export const AuthContext = createContext<AuthContextType>({
  authStatus: null,
  error: null,
  resetPassword: authContextNotInitializedRejection,
  signIn: authContextNotInitializedRejection,
  signOut: authContextNotInitializedRejection,
  signUp: authContextNotInitializedRejection,
  user: null,
})

function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Initializing)
  const [user, setUser] = useState<Auth.User | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthStatus(AuthStatus.Pending)
    try {
      await Auth.signInWithEmailAndPassword(auth, email, password)
      setAuthStatus(AuthStatus.Authenticated)
    } catch (error) {
      setError(error as Error)
      setAuthStatus(AuthStatus.Error)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await Auth.signOut(auth)
      setAuthStatus(AuthStatus.Unauthenticated)
    } catch (error) {
      setError(error as Error)
      setAuthStatus(AuthStatus.Error)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await Auth.createUserWithEmailAndPassword(auth, email, password)
      setAuthStatus(AuthStatus.Authenticated)
    } catch (error) {
      setError(error as Error)
      setAuthStatus(AuthStatus.Error)
    }
  }, [])

  const resetPassword = useCallback((email: string) => {
    const onConfirmReset = async () => {
      try {
        setAuthStatus(AuthStatus.Unauthenticated)
        await Auth.sendPasswordResetEmail(auth, email)
        Alert.alert('Done!', 'Go check your email for the reset link', [
          {
            text: 'OK',
            style: 'default',
            onPress: async () => ((await Linking.canOpenURL('message:0')) ? Linking.openURL('message:0') : void 0),
          },
        ])
      } catch (error) {
        setError(error as Error)
        setAuthStatus(AuthStatus.Error)
      }
    }

    Alert.alert('Are you Sure?', 'Are you sure you want to reset your password?  This action cannot be undone!', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: onConfirmReset },
    ])
  }, [])

  const handleNextAuthStateChange = useCallback((user: Auth.User | null) => {
    setError(null)
    setUser(user)
    if (user) setAuthStatus(AuthStatus.Authenticated)
    else setAuthStatus(AuthStatus.Unauthenticated)
  }, [])

  const handleStateChangeError = useCallback((error: Error) => {
    setError(error)
    setUser(null)
    setAuthStatus(AuthStatus.Error)
  }, [])

  useEffect(() => {
    return Auth.onAuthStateChanged(auth, handleNextAuthStateChange, handleStateChangeError)
  }, [handleNextAuthStateChange, handleStateChangeError])

  useEffect(() => {
    if (![AuthStatus.Authenticated, AuthStatus.Initializing].includes(authStatus)) SplashScreen.hideAsync()
  }, [authStatus])

  return useMemo(
    () => ({ authStatus, error, resetPassword, signIn, signOut, signUp, user }),
    [authStatus, error, resetPassword, signIn, signOut, signUp, user],
  )
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return <AuthContext.Provider value={useAuth()}>{children}</AuthContext.Provider>
}
