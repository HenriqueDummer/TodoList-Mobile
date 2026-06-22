import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { authGradientColors, colors } from '@/utils/authTheme'
import { Input } from '@/components/Input'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { BackendCategory } from '@/services/api'

type Priority = 'low' | 'medium' | 'high'

type NewTask = {
  title: string
  description: string
  completed: boolean
  priority: Priority
  dueDate: string
  categoryId: string | null
}

type FormData = {
  title: string
  description: string
}

type Props = {
  onBack: () => void
  onSave: (data: NewTask) => void
  categories: BackendCategory[]
  isSaving?: boolean
}

const priorityConfig = {
  low: { activeBg: colors.lowText },
  medium: { activeBg: colors.mediumText },
  high: { activeBg: colors.highText },
}

export function AddTaskScreen({ onBack, onSave, categories, isSaving = false }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const [priority, setPriority] = useState<Priority>('medium')
  const [selectedCategory, setSelectedCategory] = useState<BackendCategory | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(new Date())

  function onSubmit(data: FormData) {
    onSave({
      title: data.title,
      description: data.description,
      completed: false,
      priority,
      dueDate: date.toISOString(),
      categoryId: selectedCategory?.id ?? null,
    })
  }

  return (
    <View className="flex-1 bg-auth-background">
      <View className="flex-row items-center gap-4 px-6 pt-14 pb-4 border-b border-auth-border">
        <TouchableOpacity onPress={onBack}>
          <FontAwesome name="arrow-left" size={20} color={colors.mutedText} />
        </TouchableOpacity>
        <Text className="font-extrabold text-auth-text" style={{ fontSize: 24 }}>
          Add New Task
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View className="mt-6">
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Input
                label="Title *"
                placeholder="Enter task title"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error ? 'Title is required' : undefined}
              />
            )}
          />
        </View>

        <View className="mt-6 mb-5">
          <Text className="mb-2 text-sm font-bold text-auth-text">Description</Text>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Enter task description"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 15,
                  padding: 18,
                  color: colors.text,
                  fontSize: 15,
                  height: 120,
                  textAlignVertical: 'top',
                }}
              />
            )}
          />
        </View>

        <View className="mb-5" style={{ zIndex: 10 }}>
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome name="tag" size={14} color={colors.mutedText} />
            <Text className="text-sm font-bold text-auth-muted">Category</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCategories(!showCategories)}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 15,
              padding: 13,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View className="flex-row items-center gap-2">
              {selectedCategory && (
                <FontAwesome name={selectedCategory.icon as any} size={14} color={selectedCategory.color} />
              )}
              <Text style={{ color: colors.text, fontSize: 14 }}>
                {selectedCategory?.name ?? 'No Category'}
              </Text>
            </View>
            <FontAwesome name="chevron-down" size={12} color={colors.icon} />
          </TouchableOpacity>

          {showCategories && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => { setSelectedCategory(null); setShowCategories(false) }}
                className="px-4 py-3 border-b border-auth-border"
              >
                <Text style={{ color: !selectedCategory ? colors.purple : colors.text, fontSize: 14 }}>
                  No Category
                </Text>
              </TouchableOpacity>

              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => { setSelectedCategory(cat); setShowCategories(false) }}
                  className="px-4 py-3 border-b border-auth-border flex-row items-center gap-2"
                >
                  <FontAwesome name={cat.icon as any} size={14} color={cat.color} />
                  <Text style={{ color: selectedCategory?.id === cat.id ? colors.purple : colors.text, fontSize: 14 }}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-5">
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome name="flag" size={14} color={colors.icon} />
            <Text className="text-sm font-bold text-auth-muted">Priority</Text>
          </View>
          <View className="flex-row gap-3">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                className="flex-1 items-center py-3"
                style={{
                  backgroundColor: priority === p ? priorityConfig[p].activeBg : colors.surface,
                  borderWidth: 1,
                  borderColor: priority === p ? priorityConfig[p].activeBg : colors.border,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', textTransform: 'capitalize' }}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome name="calendar" size={14} color={colors.icon} />
            <Text className="text-sm font-bold text-auth-muted">Due Date</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 10,
              padding: 13,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: colors.text, fontSize: 14 }}>
              {date.toLocaleDateString('pt-BR')}
            </Text>
            <FontAwesome name="calendar" size={14} color={colors.icon} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onValueChange={(event, selectedDate) => {
                setShowDatePicker(false)
                if (selectedDate) setDate(selectedDate)
              }}
            />
          )}
        </View>

        <View className="flex-row gap-3 mb-10">
          <TouchableOpacity
            onPress={onBack}
            disabled={isSaving}
            className="flex-1 items-center justify-center border border-auth-border bg-auth-surface"
            style={{ borderRadius: 12, height: 48, opacity: isSaving ? 0.6 : 1 }}
          >
            <Text className="text-auth-text font-bold text-sm">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex-1 overflow-hidden"
            style={{ borderRadius: 12, opacity: isSaving ? 0.6 : 1 }}
          >
            <LinearGradient
              colors={authGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}
            >
              <Text className="text-auth-text font-bold text-sm">
                {isSaving ? 'Saving...' : 'Save Task'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}