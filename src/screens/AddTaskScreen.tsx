// @/screens/AddTaskScreen.tsx
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { authGradientColors, colors } from '@/utils/authTheme'
import { Input } from '@/components/Input'
import DateTimePicker from '@react-native-community/datetimepicker'

type Priority = 'low' | 'medium' | 'high'

type FormData = {
  title: string
  description: string
  category: string
  priority: Priority
  dueDate: string
}

const categoryOptions = [
  'No Category',
  'Work',
  'Personal',
  'Study',
  'Health',
  'Shopping',
]

type Props = {
  onBack: () => void
  onSave: (data: FormData) => void
}

export function AddTaskScreen({ onBack, onSave }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'No Category',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    },
  })

  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('No Category')
  const [showCategories, setShowCategories] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(new Date())
  const priorityConfig = {
    low: { bg: colors.lowBg, text: colors.lowText, activeBg: colors.lowText },
    medium: {
      bg: colors.mediumBg,
      text: colors.mediumText,
      activeBg: colors.mediumText,
    },
    high: {
      bg: colors.highBg,
      text: colors.highText,
      activeBg: colors.highText,
    },
  }
  function onSubmit(data: FormData) {
    onSave({ ...data, priority, category })
  }

  return (
    <View className="flex-1 bg-auth-background px-6 py-14">
      <View className="flex-row items-center gap-4 mb-8">
        <TouchableOpacity onPress={onBack}>
          <FontAwesome
            name="arrow-left"
            size={20}
            color={colors.mutedText}
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
        <Text
          className="font-extrabold text-auth-text"
          style={{ fontSize: 30, marginLeft: 30 }}
        >
          Add New Task
        </Text>
      </View>

      <View className="mt-10" border-t border-auth-border>
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

        <View className="mb-5 mt-10">
          <Text className="mb-2 text-l font-bold text-auth-text">
            Description
          </Text>
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
                  height: 150,
                  textAlignVertical: 'top',
                }}
              />
            )}
          />
        </View>

        <View className="mb-5 mt-10">
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome name="tag" size={14} color={colors.mutedText} />
            <Text className="text-1 font-bold text-auth-muted">Category</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCategories(!showCategories)}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 15,
              padding: 13,
            }}
            className="flex-row items-center justify-between"
          >
            <Text style={{ color: colors.text, fontSize: 13 }}>{category}</Text>
            <FontAwesome name="chevron-down" size={12} color={colors.icon} />
          </TouchableOpacity>
          {showCategories && (
            <View
              style={{
                position: 'absolute',
                top: 72, 
                left: 0,
                right: 0,
                zIndex: 999,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 4,
              }}
            >
              {categoryOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    setCategory(opt)
                    setShowCategories(false)
                  }}
                  className="px-4 py-3 border-b border-auth-border"
                >
                  <Text
                    style={{
                      color: category === opt ? colors.purple : colors.text,
                      fontSize: 20,
                    }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mb-5 mt-10">
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome name="flag" size={20} color={colors.icon} />
            <Text className="text-l font-bold text-auth-muted ml-2">
              Priority
            </Text>
          </View>
          <View className="flex-row gap-3">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                className="flex-1 items-center"
                style={{
                  backgroundColor:
                    priority === p
                      ? priorityConfig[p].activeBg
                      : colors.surface,
                  borderWidth: 1,
                  borderColor:
                    priority === p ? priorityConfig[p].activeBg : colors.border,
                  padding: 20,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: '700',
                    textTransform: 'capitalize',
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-8 mt-10">
          <View className="flex-row items-center gap-2 mb-2">
            <FontAwesome name="calendar" size={14} color={colors.icon} />
            <Text className="text-l font-bold text-auth-muted">Due Date</Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 10,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: colors.text, fontSize: 20 }}>
              {date.toLocaleDateString('pt-BR')}
            </Text>
            <FontAwesome name="calendar" size={16} color={colors.icon} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onValueChange={(event, selectedDate) => {
                setShowDatePicker(false)
                if (selectedDate) {
                  setDate(selectedDate)
                }
              }}
            />
          )}
        </View>

        <View className="flex-row gap-3 mb-10 mt-10">
          <TouchableOpacity
            onPress={onBack}
            className="flex-1 py-3 items-center border border-auth-border bg-auth-surface"
            style={{ borderRadius: 20 }}
          >
            <Text
              className="text-auth-text font-bold "
              style={{ fontSize: 20, paddingVertical: 30 }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={authGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ alignItems: 'center' }}
            >
              <Text
                className="text-auth-text font-bold "
                style={{ fontSize: 20, padding: 30 }}
              >
                Save Task
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
