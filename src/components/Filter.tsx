import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Tab = 'all' | 'pending' | 'completed'

const tabLabels: Record<Tab, string> = {
  all: 'All tasks',
  pending: 'Pending',
  completed: 'Completed',
}

type Props = {
  onChange?: (tab: Tab) => void
}

export function FilterTabs({ onChange }: Props) {
  const [selected, setSelected] = useState<Tab>('all')

  function handleSelect(tab: Tab) {
    setSelected(tab)
    onChange?.(tab)
  }

  return (
    <View className="flex-row items-center gap-3">
      {(['all', 'pending', 'completed'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => handleSelect(tab)}
          className={`px-6 py-1 rounded-lg ${
            selected === tab ? 'bg-auth-purple' : 'bg-auth-surface'
          }`}
        >
          <Text
            className={`text-[20px] ${
              selected === tab ? 'text-auth-text' : 'text-auth-muted'
            }`}
          >
            {tabLabels[tab]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}