import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AddTaskScreen } from '@/screens/AddTaskScreen'
import { CategoriesScreen } from '@/screens/CategoriesScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { AppStackParamList } from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="EditTask" component={AddTaskScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
    </Stack.Navigator>
  )
}
