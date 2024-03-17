import { AuthContext, AuthStatus } from '@/authentication/auth'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Redirect, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useContext, useEffect } from 'react'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const { authStatus } = useContext(AuthContext)

  if (authStatus !== AuthStatus.Authenticated) return <Redirect href="/sign-in" />

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-modal" options={{ presentation: 'modal', headerTitle: 'Add a New Runner' }} />
      <Stack.Screen name="edit-modal" options={{ presentation: 'modal', headerTitle: 'Edit an Existing Runner' }} />
      {/* <Stack.Screen name="sign-in" options={{ title: 'Sign In', headerTitle: 'Sign In' }} /> */}
    </Stack>
  )
}
