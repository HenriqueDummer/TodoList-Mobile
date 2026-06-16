import { NavigationContainer } from '@react-navigation/native'
import "./global.css"
import { AuthStack } from './src/navigation/AuthStack'
import { AppStack } from './src/navigation/AppStack'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import { LoadingScreen } from './src/screens/LoadingScreen'

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}

function RootNavigator() {
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return user ? <AppStack /> : <AuthStack />
}
