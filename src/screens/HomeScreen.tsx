import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { authGradientColors } from '@/utils/authTheme'
import { LinearGradient } from 'expo-linear-gradient'

import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/Input'
import { useEffect, useState } from 'react'
import { FilterTabs } from '@/components/Filter'
import { CategoryFilter } from '@/components/CategoryFilter'
import { EmptyTasks } from '@/components/EmptyTasks'
import { TaskCard } from '@/components/TaskCard'
import { AddTaskScreen } from './AddTaskScreen'
import { CategoriesScreen, type IconsTypes } from './Categories'
import {
  getCategories,
  createTask,
  getTasks,
  type BackendCategory,
  type BackendTask,
} from '@/services/api'

type HomeCategory = {
  id: string
  label: string
  icon?: IconsTypes
  color?: string
}

const defaultCategories: HomeCategory[] = [
  { id: 'all', label: 'all categories' },
]

export function HomeScreen() {
  const { firebaseUser, logout } = useAuth()
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
  const [isSaving, setIsSaving] = useState(false)
  const [backendCategories, setBackendCategories] = useState<BackendCategory[]>(
    [],
  )
  const [tasks, setTasks] = useState<BackendTask[]>([])
  const numberOfTasks = tasks.length
  const [screen, setScreen] = useState<'home' | 'addTask' | 'categories'>(
    'home',
  )
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    async function loadCategories() {
      if (!firebaseUser) {
        setCategories(defaultCategories)
        return
      }

      try {
        const data = await getCategories(firebaseUser)
        setBackendCategories(data)
        setCategories([
          ...defaultCategories,
          ...data.map((category) => ({
            id: category.id,
            label: category.name,
            icon: category.icon as IconsTypes,
            color: category.color,
          })),
        ])
      } catch {
        setCategories(defaultCategories)
      }
    }

    loadCategories()
  }, [firebaseUser, reloadKey])

  useEffect(() => {
    async function loadTasks() {
      if (!firebaseUser) return
      try {
        const data = await getTasks(firebaseUser)
        setTasks(data)
      } catch (error) {
        console.error('Erro ao carregar tasks:', error)
      }
    }

    loadTasks()
  }, [firebaseUser, reloadKey])

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

  if (screen === 'categories') {
    return (
      <CategoriesScreen
        onBack={() => {
          setReloadKey((k) => k + 1)
          setScreen('home')
        }}
      />
    )
  }

  if (screen === 'addTask') {
    return (
      <AddTaskScreen
        onBack={() => setScreen('home')}
        categories={backendCategories}
        isSaving={isSaving}
        onSave={async (data) => {
          if (!firebaseUser) return
          try {
            setIsSaving(true)
            await createTask(firebaseUser, data)
            const updatedTasks = await getTasks(firebaseUser)
            setTasks(updatedTasks)
            setScreen('home')
          } catch (error) {
            console.error('Erro ao criar task:', error)
          } finally {
            setIsSaving(false)
          }
        }}
      />
    )
  }

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
          <TouchableOpacity onPress={() => setScreen('categories')}>
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
                onPress={() => console.log('task:', task.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <TouchableOpacity
        onPress={() => setScreen('addTask')}
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
