import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { authGradientColors } from '@/utils/authTheme'
import { LinearGradient } from 'expo-linear-gradient'

import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/Input'
import { useCallback, useState } from 'react'
import { FilterTabs } from '@/components/Filter'
import { CategoryFilter } from '@/components/CategoryFilter'
import { EmptyTasks } from '@/components/EmptyTasks'
import { TaskCard } from '@/components/TaskCard'
import { type IconsTypes } from './CategoriesScreen'
import {
  getCategories,
  deleteTask,
  getTasks,
  type BackendTask,
} from '@/services/api'
import { useFocusEffect } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { AppStackParamList } from '@/navigation/types'

type HomeCategory = {
  id: string
  label: string
  icon?: IconsTypes
  color?: string
}

const defaultCategories: HomeCategory[] = [
  { id: 'all', label: 'all categories' },
]

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>

export function HomeScreen({ navigation }: Props) {
  const { firebaseUser } = useAuth()
  const userIcon = require('../utils/icones/icone_usuario.png')
  const folderIcon = require('../utils/icones/icone_pasta.png')
  const icone_mais = require('../utils/icones/icone_mais.png')
  const { control, watch } = useForm()
  const searchText = watch('search') ?? ''
  const [selected, setSelected] = useState<'all' | 'pending' | 'completed'>(
    'all',
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] =
    useState<HomeCategory[]>(defaultCategories)
  const [tasks, setTasks] = useState<BackendTask[]>([])
  const numberOfTasks = tasks.length

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      async function loadData() {
        if (!firebaseUser) {
          setCategories(defaultCategories)
          setTasks([])
          return
        }

        try {
          const [categoryData, taskData] = await Promise.all([
            getCategories(firebaseUser),
            getTasks(firebaseUser),
          ])

          if (!isActive) return

          setCategories([
            ...defaultCategories,
            ...categoryData.map((category) => ({
              id: category.id,
              label: category.name,
              icon: category.icon as IconsTypes,
              color: category.color,
            })),
          ])
          setTasks(taskData)
        } catch (error) {
          if (!isActive) return
          console.error('Erro ao carregar dados:', error)
          setCategories(defaultCategories)
        }
      }

      loadData()

      return () => {
        isActive = false
      }
    }, [firebaseUser]),
  )

  async function handleDeleteTask(taskId: string) {
    if (!firebaseUser) return

    try {
      await deleteTask(firebaseUser, taskId)
      const updatedTasks = await getTasks(firebaseUser)
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Erro ao deletar task:', error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase())

    const matchesTab =
      selected === 'all'
        ? true
        : selected === 'pending'
          ? !task.completed
          : task.completed

    const matchesCategory =
      selectedCategory === 'all' ? true : task.categoryId === selectedCategory

    return matchesSearch && matchesTab && matchesCategory
  })

  return (
    <View className="flex-1 bg-auth-background px-6 py-14">
      <View className="px-6 mb-6">
        <View className="flex-row  gap-3">
          <LinearGradient
            colors={authGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={userIcon}
              style={{ width: 30, height: 30, tintColor: '#FFF' }}
              resizeMode="contain"
            />
          </LinearGradient>
          <Text className="flex-1 text-[28px] font-extrabold text-auth-text">
            My tasks
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Image
              source={folderIcon}
              style={{ width: 28, height: 28, tintColor: '#6b6a6a' }}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-[14px] text-auth-muted -mt-5 ml-20">
          {numberOfTasks} total tasks
        </Text>
        <View>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                label=""
                icon="search"
                placeholder="Search tasks..."
                value={field.value || ''}
                onChangeText={field.onChange}
                autoCapitalize="none"
              />
            )}
          />
        </View>
        <View className="items-center">
          <FilterTabs onChange={(tab) => setSelected(tab)} />
        </View>

        <View>
          <CategoryFilter
            categories={categories}
            onChange={(id) => setSelectedCategory(id)}
          />
        </View>
      </View>

      <View className="flex-1 border-t-[2px] border-auth-border">
        {filteredTasks.length === 0 ? (
          <EmptyTasks />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => {
                  navigation.navigate('EditTask', { task })
                }}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.8}
        style={{ position: 'absolute', bottom: 32, right: 24 }}
      >
        <LinearGradient
          colors={authGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={icone_mais}
            style={{ width: 30, height: 30, tintColor: '#FFF' }}
            resizeMode="contain"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}
