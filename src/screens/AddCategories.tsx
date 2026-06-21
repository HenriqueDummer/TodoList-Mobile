import { useMemo, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

import { authGradientColors, colors } from '@/utils/authTheme'
import type { IconsTypes } from './Categories'

type NewCategory = {
  name: string
  icon: IconsTypes
  color: string
}

type Props = {
  onBack: () => void
  onSave: (category: NewCategory) => void
  initialCategory?: NewCategory
  isSaving?: boolean
}

const icons: IconsTypes[] = [
  'briefcase',
  'home',
  'shopping-cart',
  'heart',
  'book',
  'plane',
  'paint-brush',
  'cutlery',
  'gamepad',
  'sticky-note',
]

export type CategoriesColorOptions =
  | '#2F80ED'
  | '#4CAF50'
  | '#F0A500'
  | '#FF6B6B'
  | '#8357EA'
  | '#EC4899'
  | '#06B6D4'
  | '#84CC16'
  | '#F97316'
  | '#6366F1'

export const colorOptions: CategoriesColorOptions[] = [
  '#2F80ED',
  '#4CAF50',
  '#F0A500',
  '#FF6B6B',
  '#8357EA',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
]

export function AddCategoriesScreen({
  onBack,
  onSave,
  initialCategory,
  isSaving = false,
}: Props) {
  const [name, setName] = useState(initialCategory?.name ?? '')
  const [selectedIcon, setSelectedIcon] = useState<IconsTypes>(
    initialCategory?.icon ?? 'briefcase',
  )
  const [selectedColor, setSelectedColor] = useState<string>(
    initialCategory?.color ?? colors.categoryWork,
  )

  const canSubmit = useMemo(() => name.trim().length > 0, [name])

  function handleSubmit() {
    const trimmedName = name.trim()

    if (!trimmedName || isSaving) {
      return
    }

    onSave({
      name: trimmedName,
      icon: selectedIcon,
      color: selectedColor,
    })
  }

  return (
    <View className="flex-1 bg-auth-background px-4 pt-12">
      <View className="-mx-4 flex-row items-center justify-between border-b border-auth-border px-4 pb-4">
        <Text className="text-lg font-extrabold text-auth-text">
          {initialCategory ? 'Edit Category' : 'New Category'}
        </Text>
        <TouchableOpacity activeOpacity={0.75} onPress={onBack}>
          <FontAwesome name="close" size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="mb-2 text-xs font-extrabold text-auth-text">
          Category Name *
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter category name"
          placeholderTextColor={colors.placeholder}
          className="h-11 rounded-xl border border-auth-border bg-auth-background px-4 text-sm text-auth-text"
        />
      </View>

      <View className="mt-6">
        <Text className="mb-3 text-xs font-extrabold text-auth-text">
          Select Icon
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {icons.map((icon) => {
            const isSelected = icon === selectedIcon

            return (
              <TouchableOpacity
                key={icon}
                activeOpacity={0.75}
                onPress={() => setSelectedIcon(icon)}
                style={{
                  width: 43,
                  height: 43,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected
                    ? `${selectedColor}26`
                    : colors.background,
                  borderWidth: 1,
                  borderColor: isSelected ? selectedColor : colors.border,
                }}
              >
                <FontAwesome
                  name={icon}
                  size={20}
                  color={isSelected ? selectedColor : colors.mutedText}
                />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <View className="mt-6">
        <Text className="mb-3 text-xs font-extrabold text-auth-text">
          Select Color
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {colorOptions.map((color) => {
            const isSelected = color === selectedColor

            return (
              <TouchableOpacity
                key={color}
                activeOpacity={0.75}
                onPress={() => setSelectedColor(color)}
                style={{
                  width: 49,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: color,
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: colors.text,
                }}
              />
            )
          })}
        </View>
      </View>

      <View className="mt-auto flex-row gap-3 pb-7">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBack}
          disabled={isSaving}
          className="h-11 flex-1 items-center justify-center rounded-xl border border-auth-border bg-auth-background"
        >
          <Text className="text-sm font-extrabold text-auth-text">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!canSubmit || isSaving}
          className="flex-1 overflow-hidden rounded-xl"
          style={{ opacity: canSubmit && !isSaving ? 1 : 0.6 }}
        >
          <LinearGradient
            colors={authGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
            }}
          >
            <Text className="text-sm font-extrabold text-auth-text">
              {isSaving ? 'Saving...' : initialCategory ? 'Save' : 'Create'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}
