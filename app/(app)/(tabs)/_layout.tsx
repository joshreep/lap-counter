import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Link, SplashScreen, Tabs } from 'expo-router'
import React, { useContext, useEffect } from 'react'
import { Pressable } from 'react-native'

import { AuthContext, AuthStatus } from '@/authentication/auth'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { authStatus } = useContext(AuthContext)

  useEffect(() => {
    if (authStatus !== AuthStatus.Initializing) SplashScreen.hideAsync()
  }, [authStatus])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => <TabBarIcon name="running" color={color} />,
          headerRight: () => (
            <Link href="/add-modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome5
                    name="user-plus"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <TabBarIcon name="medal" color={color} />,
          headerRight: () => (
            <Link href="/add-modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome5
                    name="user-plus"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <TabBarIcon name="user-cog" color={color} /> }}
      />
    </Tabs>
  )
}
