import {
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth'
import { createContext, FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
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
  user: User | null
}

const authContextNotInitializedRejection = () => Promise.reject('AuthContext has not yet been initialized')

export const AuthContext = createContext<AuthContextType>({
  authStatus: null,
  error: null,
  resetPassword: () => void 0,
  signIn: authContextNotInitializedRejection,
  signOut: authContextNotInitializedRejection,
  signUp: authContextNotInitializedRejection,
  user: null,
})

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.Initializing)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthStatus(AuthStatus.Pending)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error as Error)
      setAuthStatus(AuthStatus.Error)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth)
      setAuthStatus(AuthStatus.Unauthenticated)
    } catch (error) {
      setError(error as Error)
      setAuthStatus(AuthStatus.Error)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setAuthStatus(AuthStatus.Authenticated)
    } catch (error) {
      setError(error as Error)
      setAuthStatus(AuthStatus.Error)
    }
  }, [])

  const resetPassword = useCallback((email: string) => {
    const onConfirmReset = async () => {
      try {
        await sendPasswordResetEmail(auth, email)
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

  useEffect(() => {
    return onAuthStateChanged(auth, {
      next(user) {
        setError(null)
        setUser(user)
        if (user) setAuthStatus(AuthStatus.Authenticated)
        else setAuthStatus(AuthStatus.Unauthenticated)
      },
      error(error) {
        setError(error)
        setUser(null)
        setAuthStatus(AuthStatus.Error)
      },
      complete() {},
    })
  }, [])

  return (
    <AuthContext.Provider value={{ authStatus, error, resetPassword, signIn, signOut, signUp, user }}>
      {children}
    </AuthContext.Provider>
  )
}
