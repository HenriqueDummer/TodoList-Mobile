import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, Image } from 'react-native'

type Category = {
  id: string
  label: string
  image?: any
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
          {cat.image && (
            <Image
              source={cat.image} 
              style={{
                width: 20,
                height: 20,
        
              }}
              resizeMode="contain"
            />
          )}
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
