import { colors } from '@/utils/authTheme'
import { FontAwesome } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import type { BackendTask } from '@/services/api'
type Priority = 'high' | 'medium' | 'low'

const priorityConfig: Record<
  Priority,
  { label: string; text: string; icon: string }
> = {
  high: { label: 'High', text: colors.highText, icon: 'flag' },
  medium: { label: 'Medium', text: colors.mediumText, icon: 'flag-o' },
  low: { label: 'Low', text: colors.lowText, icon: 'flag-o' },
}

type Props = {
  task: BackendTask
  onPress?: () => void
  onDelete?: () => void
}

function formatDueDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
  })
}

export function TaskCard({ task, onPress, onDelete }: Props) {
  const priority = priorityConfig[task.priority]
  const categoryColor = task.category?.color ?? colors.blue
  const categoryName = task.category?.name ?? 'No Category'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-auth-surface rounded-[10px] border border-auth-border px-4 py-4 mb-3 mt-6"
    >
      <View className="flex-row items-start gap-3">
        <View className="mt-1.5 h-5 w-5 items-center justify-center rounded-full border-2 border-auth-icon">
          {task.completed ? (
            <View
              style={{ backgroundColor: colors.completed }}
              className="h-3 w-3 rounded-full"
            />
          ) : null}
        </View>

        <View className="flex-1 pr-2">
          <Text
            className={`text-[15px] font-extrabold text-auth-text ${
              task.completed ? 'line-through opacity-60' : ''
            }`}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text className="mt-2 text-[13px] text-auth-text" numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}

          <View className="mt-3 flex-row flex-wrap items-center gap-3">
            <View className="flex-row items-center gap-1">
              <View
                style={{ backgroundColor: categoryColor }}
                className="h-1.5 w-1.5 rounded-full"
              />
              <FontAwesome name="briefcase" size={10} color={categoryColor} />
              <Text className="text-[12px] text-auth-muted">
                {categoryName}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <FontAwesome
                name={priority.icon as any}
                size={11}
                color={priority.text}
              />
              <Text
                style={{ color: priority.text }}
                className="text-[12px] font-bold"
              >
                {priority.label}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <FontAwesome name="calendar-o" size={11} color={colors.icon} />
              <Text className="text-[12px] text-auth-icon">
                {formatDueDate(task.dueDate)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onDelete}
          disabled={!onDelete}
          hitSlop={10}
          activeOpacity={0.7}
          className="p-1"
        >
          <FontAwesome name="trash-o" size={18} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}
