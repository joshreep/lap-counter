import { AuthContext, AuthStatus } from '@/authentication/auth'
import { Text, View } from '@/components/Themed'
import InputGroup from '@/components/form/InputGroup'
import { ButtonGroup, LoadingAnimation } from '@/components/styles'
import app from '@/firebaseConfig'
import { FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'
import { FirebaseError } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  Button,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled from 'styled-components/native'

const auth = getAuth(app)

enum FormMode {
  SignIn = 'SIGN_IN',
  SignUp = 'SIGN_UP',
}

export default function SignIn() {
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const confirmRef = useRef<TextInput>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [confirm, setConfirm] = useState('')
  const [errorDirty, setErrorDirty] = useState(false)
  const [customFormError, setCustomFormError] = useState('')
  // const [formMode, setFormMode] = useState(FormMode.SignIn)
  const formMode = FormMode.SignIn
  const isSignInMode = formMode === FormMode.SignIn

  const { authStatus, error, resetPassword, signIn /* , signUp */ } = useContext(AuthContext)

  const resetErrorState = () => {
    setErrorDirty(true)
    setCustomFormError('')
  }

  // const validatePasswordsMatch = (password: string, confirm?: string) => {
  //   if (password !== confirm) {
  //     setCustomFormError('Passwords do not match.')
  //     return false
  //   } else {
  //     setCustomFormError('')
  //     return true
  //   }
  // }

  const onSubmit = useCallback(
    (email: string, password: string /* , confirm: string */) => {
      setErrorDirty(false)
      switch (formMode) {
        case FormMode.SignIn:
          signIn(email, password)
          break
        // case FormMode.SignUp:
        //   if (validatePasswordsMatch(password, confirm)) signUp(email, password)
        //   break
      }
    },
    [formMode, signIn],
  )

  // const onSubmitEditingOrg = useCallback((event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
  //   if (!event.nativeEvent.text) {
  //     auth.tenantId = null
  //   } else {
  //     auth.tenantId = event.nativeEvent.text
  //   }
  //   emailRef.current?.focus()
  // }, [])

  const onSubmitEditingEmail = useCallback((event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    setEmail(event.nativeEvent.text)
    passwordRef.current?.focus()
  }, [])

  const onSubmitEditingPassword = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      setPassword(event.nativeEvent.text)
      if (isSignInMode) {
        if (email) onSubmit(email, event.nativeEvent.text /* , confirm */)
      } else {
        confirmRef.current?.focus()
      }
    },
    [email, isSignInMode, onSubmit],
  )
  const onSubmitEditingConfirm = useCallback(
    (/* event: NativeSyntheticEvent<TextInputSubmitEditingEventData> */) => {
      // setConfirm(event.nativeEvent.text)
      if (email && password) {
        onSubmit(email, password /* , event.nativeEvent.text */)
      }
    },
    [email, onSubmit, password],
  )

  useEffect(() => {
    if (authStatus === AuthStatus.Authenticated) router.replace('/')
  }, [authStatus])

  return (
    <Container>
      <InputContainer>
        <View style={{ backgroundColor: 'transparent' }}>
          <Title>
            Sign {isSignInMode ? 'In' : 'Up'} with Email and Password{/*  or */}
          </Title>
          {/* <Button
            title={isSignInMode ? 'Create New Account' : 'Use Existing Account'}
            onPress={() => setFormMode(isSignInMode ? FormMode.SignUp : FormMode.SignIn)}
          /> */}
        </View>
        {/* <InputGroup
          autoCapitalize="none"
          autoComplete="off"
          enterKeyHint="next"
          inputMode="text"
          label="Organization"
          onBlur={(event) => (auth.tenantId = event.nativeEvent.text)}
          onChangeText={(text) => (auth.tenantId = text)}
          onFocus={resetErrorState}
          onSubmitEditing={onSubmitEditingOrg}
          placeholder="Leave blank for single user"
        /> */}
        <InputGroup
          autoCapitalize="none"
          autoComplete="email"
          enterKeyHint="next"
          inputMode="email"
          label="Email"
          onBlur={(event) => setEmail(event.nativeEvent.text)}
          onChangeText={setEmail}
          onFocus={resetErrorState}
          onSubmitEditing={onSubmitEditingEmail}
          ref={emailRef}
        />
        <InputGroup
          autoComplete={isSignInMode ? 'current-password' : 'new-password'}
          enterKeyHint={isSignInMode ? 'done' : 'next'}
          inputMode="text"
          label="Password"
          onBlur={(event) => setPassword(event.nativeEvent.text)}
          onChangeText={setPassword}
          onFocus={resetErrorState}
          onSubmitEditing={onSubmitEditingPassword}
          ref={passwordRef}
          secureTextEntry
        />
        {!isSignInMode && (
          <InputGroup
            autoComplete="new-password"
            enterKeyHint="done"
            inputMode="text"
            label="Confirm Password"
            // onBlur={(event) => setConfirm(event.nativeEvent.text)}
            // onChangeText={setConfirm}
            onFocus={resetErrorState}
            onSubmitEditing={onSubmitEditingConfirm}
            ref={confirmRef}
            secureTextEntry
          />
        )}
        {authStatus === AuthStatus.Error && !errorDirty && <ErrorText>{getErrorText(error, email)}</ErrorText>}
        {!!customFormError && <ErrorText>{customFormError}</ErrorText>}
        <ButtonGroup>
          <Button title="Forgot Password" onPress={() => resetPassword(email)} />
          <Button
            title="Submit"
            onPress={() => onSubmit(email, password /* , confirm */)}
            accessibilityLabel="Submit"
            disabled={authStatus === AuthStatus.Authenticated}
          />
        </ButtonGroup>
        {false && (
          <>
            <ProviderText>Or sign in with a provider:</ProviderText>
            <ButtonGroup>
              <Pressable onPress={() => void 0}>
                <ProviderIcon name="google" />
              </Pressable>
            </ButtonGroup>
          </>
        )}
      </InputContainer>
      {authStatus === AuthStatus.Pending && (
        <LoadingAnimation source={require('@/assets/animations/loading-animation.json')} />
      )}
    </Container>
  )
}

function getErrorText(error: unknown, email: string): string {
  console.error(error)
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Incorrect username or password.  Please try again.'

      case 'auth/missing-email':
      case 'auth/invalid-email':
        if (!email) return 'Email is required.'
        return `The provided email (${email}) is not a valid email address.`

      case 'auth/too-many-requests':
        return error.message.replace('Firebase: ', '').replace(` (${error.code}).`, '')

      case 'auth/missing-password':
        return 'Password is required.'

      case 'auth/invalid-tenant-id':
        return `The user with the gmail (${email}) is not a part of the ${auth.tenantId} organization`
    }
  }

  return 'Something went wrong trying to log in.  Please try again.'
}

const Container = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  background-color: ${({ theme }) => theme.colors.rootBackground};
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  /* margin-bottom: 100px; */
`

const InputContainer = styled(SafeAreaView)`
  display: flex;
  gap: 20px;
  width: 100%;
  background-color: transparent;
`

const Title = styled(Text)`
  text-align: center;
  font-size: 20px;
`

const ProviderText = styled(Text)`
  font-size: 16px;
  text-align: center;
`

const ProviderIcon = styled(FontAwesome5).attrs({ size: 35 })`
  color: ${({ theme }) => theme.colors.text};
`
const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  font-size: 14px;
`
