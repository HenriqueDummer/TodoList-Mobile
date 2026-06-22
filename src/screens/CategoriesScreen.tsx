import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { authGradientColors, colors } from '@/utils/authTheme'
import { AddCategoriesScreen } from './AddCategoryScreen'
import { useAuth } from '@/contexts/AuthContext'
import {
  createCategory,
  deleteCategory,
  getApiErrorMessage,
  getCategories,
  updateCategory,
  type BackendCategory,
  type CategoryPayload,
} from '@/services/api'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/types'

export type IconsTypes = ComponentProps<typeof FontAwesome>['name']

type Category = {
  id: string
  name: string
  icon: IconsTypes
  color: string
}

type Props = NativeStackScreenProps<AppStackParamList, 'Categories'>

export function CategoriesScreen({ navigation }: Props) {
  const { firebaseUser } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [firebaseUser])

  async function loadCategories() {
    if (!firebaseUser) {
      setIsLoading(false)
      setError('You need to be logged in to load categories.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getCategories(firebaseUser)
      setCategories(data.map(mapCategory))
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!firebaseUser) {
      return
    }

    const previousCategories = categories
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setError(null)

    try {
      await deleteCategory(firebaseUser, id)
    } catch (deleteError) {
      setCategories(previousCategories)
      setError(getApiErrorMessage(deleteError))
    }
  }

  async function handleCreate(category: CategoryPayload) {
    if (!firebaseUser) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const createdCategory = await createCategory(firebaseUser, category)
      setCategories((prev) => [...prev, mapCategory(createdCategory)])
      setIsAdding(false)
    } catch (createError) {
      setError(getApiErrorMessage(createError))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdate(category: CategoryPayload) {
    if (!firebaseUser || !editingCategory) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const updatedCategory = await updateCategory(
        firebaseUser,
        editingCategory.id,
        category,
      )
      setCategories((prev) =>
        prev.map((item) =>
          item.id === updatedCategory.id ? mapCategory(updatedCategory) : item,
        ),
      )
      setEditingCategory(null)
    } catch (updateError) {
      setError(getApiErrorMessage(updateError))
    } finally {
      setIsSaving(false)
    }
  }

  function closeForm() {
    setIsAdding(false)
    setEditingCategory(null)
  }

  if (isAdding || editingCategory) {
    return (
      <AddCategoriesScreen
        onBack={closeForm}
        onSave={editingCategory ? handleUpdate : handleCreate}
        initialCategory={editingCategory ?? undefined}
        isSaving={isSaving}
      />
    )
  }

  return (
    <View className="flex-1 bg-auth-background px-5 pt-12">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={18} color={colors.mutedText} />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-auth-text">
            Categories
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsAdding(true)}>
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
            <FontAwesome name="plus" size={18} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text className="mb-7 mt-3 text-xs text-sky-300">
        {categories.length} categories
      </Text>

      {error ? (
        <Text className="mb-4 rounded-xl border border-auth-error bg-red-950/20 px-4 py-3 text-xs font-bold text-auth-error">
          {error}
        </Text>
      ) : null}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.blue} />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="col-span-2 py-16">
              <Text className="text-center text-base font-extrabold text-auth-text">
                No categories yet
              </Text>
              <Text className="mt-2 text-center text-sm text-auth-muted">
                Tap plus to create your first category.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                maxWidth: '48%',
                backgroundColor: colors.surface,
                borderRadius: 10,
                padding: 13,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View className="mb-4 flex-row items-start justify-between">
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${item.color}24`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FontAwesome name={item.icon} size={20} color={item.color} />
                </View>

                <View className="flex-row gap-4 pt-1">
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setEditingCategory(item)}
                  >
                    <FontAwesome name="pencil" size={15} color={colors.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleDelete(item.id)}
                  >
                    <FontAwesome name="trash-o" size={15} color={colors.icon} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-base font-extrabold text-auth-text">
                {item.name}
              </Text>

              <View
                style={{
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: item.color,
                  marginTop: 8,
                }}
              />
            </View>
          )}
        />
      )}
    </View>
  )
}

function mapCategory(category: BackendCategory): Category {
  return {
    id: category.id,
    name: category.name,
    icon: getCategoryIcon(category.icon),
    color: category.color,
  }
}

function getCategoryIcon(icon: string): IconsTypes {
  const fallbackIcon: IconsTypes = 'home'

  if (!icon) {
    return fallbackIcon
  }

  return icon as IconsTypes
}
