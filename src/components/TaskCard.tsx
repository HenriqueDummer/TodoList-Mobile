import { colors } from '@/utils/authTheme'
import { Text, TouchableOpacity, View } from 'react-native'
import type { BackendTask } from '@/services/api'
type Priority = 'high' | 'medium' | 'low'


const priorityConfig: Record<Priority, { label: string; text: string }> = {
  high: { label: 'High', text: colors.highText },
  medium: { label: 'Medium', text: colors.mediumText },
  low: { label: 'Low', text: colors.lowText },
}

type Props = {
  task: BackendTask
  onPress?: () => void
}

export function TaskCard({ task, onPress }: Props) {
  const priority = priorityConfig[task.priority]

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-auth-surface rounded-[14px] px-4 py-4 mb-3 flex-row items-center justify-between mt-6"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          style={{
            backgroundColor: task.completed ? colors.completed : colors.purple,
            width: 8,
            height: 8,
            borderRadius: 4,
            alignSelf: 'flex-start',
            marginLeft: 4,
            marginTop: 6
          }}
        />

        <View className="flex-1">
          <Text className="text-[11px] text-auth-muted mb-1">
            {task.category?.name ?? 'No Category'}
          </Text>
          <Text
            className={`text-[15px] font-extrabold ${
              task.completed ? 'line-through text-auth-muted' : 'text-auth-text'
            }`}
          >
            {task.title}
          </Text>
        </View>
      </View>

      <View className="px-3 py-1 rounded-lg">
        <Text
          style={{ color: priority.text }}
          className="text-[12px] font-bold"
        >
          {priority.label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
