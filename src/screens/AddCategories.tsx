// @/screens/CategoriesScreen.tsx
import { useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { authGradientColors, colors } from '@/utils/authTheme'

type Category = {
  id: string
  label: string
  image: any
  color?: string
}

const initialCategories: Category[] = [
  { id: 'work',     label: 'Work',     image: require('@/utils/icones/icone_trabalho.png'), color: colors.categoryWork     },
  { id: 'personal', label: 'Personal', image: require('@/utils/icones/icone_casa.png'),     color: colors.categoryPersonal },
  { id: 'shopping', label: 'Shopping', image: require('@/utils/icones/icone_shopping.png'), color: colors.categoryShopping },
  { id: 'health',   label: 'Health',   image: require('@/utils/icones/icone_health.png'),   color: colors.categoryHealth   },
  { id: 'study',    label: 'Study',    image: require('@/utils/icones/icone_livros.png'),   color: colors.categoryStudy    },
]

type Props = {
  onBack: () => void
}

export function CategoriesScreen({ onBack }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <View className="flex-1 bg-auth-background px-6 py-14">
      <View className="flex-row items-center justify-between mb-1 px-2">
        <View className="flex-row items-center gap-4">
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
            Categories
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={authGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesome name="plus" size={16} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text
        className="text-auth-muted text-[20px] mb-6 px-2"
        style={{ marginLeft: 65, marginTop: 20 }}
      >
        {categories.length} categories
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: '44%',
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 18,
              borderWidth: 0.5,
              borderColor: colors.border
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginBottom: 12 }}>
              <TouchableOpacity>
                <FontAwesome name="pencil" size={24} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <FontAwesome name="trash" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 40,
                backgroundColor: item.color,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                padding: 40,
              }}
            >
              <Image
                source={item.image}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </View>

            <Text className="text-auth-text font-extrabold text-[16px]">
              {item.label}
            </Text>

            <View
              style={{
                height: 6,
                borderRadius: 2,
                backgroundColor: item.color,
                marginTop: 12,
              }}
            />
          </View>
        )}
      />
    </View>
  )
}
