import { AuthContext } from '@/authentication/auth'
import { View } from '@/components/Themed'
import { useContext } from 'react'
import { Button } from 'react-native'
import styled from 'styled-components/native'

export default function SettingsTabScreen() {
  const { signOut } = useContext(AuthContext)

  return (
    <Container>
      <SignOutButton title="Sign Out" onPress={signOut} />
    </Container>
  )
}

const SignOutButton = styled(Button).attrs(({ theme }) => ({ color: theme.colors.error }))``

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.rootBackground};
`
