import { colors } from '@/utils/authTheme'
import { FontAwesome } from '@expo/vector-icons'
import { Text, View } from 'react-native'

export function EmptyTasks() {

  return (
    <View className="flex-1 items-center justify-center gap-3">
      <FontAwesome name="check-square-o" size={80} color={colors.mutedText} />
      <Text className="text-[20px] font-extrabold text-auth-muted">
        No tasks found
      </Text>
      <Text className="text-[24x] text-auth-muted">
        Create your first task to get started
      </Text>
    </View>
  )
}
