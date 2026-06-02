import { NavigationContainer } from '@react-navigation/native'
import "./global.css"
import { AuthStack } from './src/navigation/AuthStack'

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  )
}