import { useState } from 'react'
import type { ComponentProps } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import { colors } from '@/utils/authTheme'

type CategoryIcon = ComponentProps<typeof FontAwesome>['name']

type Category = {
  id: string
  label: string
  icon?: CategoryIcon
  color?: string
}

type Props = {
  categories: Category[]
  onChange?: (id: string) => void
}

export function CategoryFilter({ categories, onChange }: Props) {
  const [selected, setSelected] = useState<string>(categories[0]?.id ?? '')

  function handleSelect(id: string) {
    setSelected(id)
    onChange?.(id)
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      indicatorStyle="white"
      className="flex-row gap-3 mt-4"
      contentContainerStyle={{ gap: 14 }}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => handleSelect(cat.id)}
          className={`flex-row items-center gap-2 px-3 py-1 rounded-lg ${
            selected === cat.id ? 'bg-auth-blue' : 'bg-auth-surface'
          }`}
        >
          {cat.icon ? (
            <FontAwesome
              name={cat.icon}
              size={16}
              color={
                selected === cat.id ? colors.text : (cat.color ?? colors.icon)
              }
            />
          ) : null}
          <Text
            className={`text-[20px] ${
              selected === cat.id ? 'text-auth-text' : 'text-auth-muted'
            }`}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
