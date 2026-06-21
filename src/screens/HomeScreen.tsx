import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { authGradientColors } from '@/utils/authTheme'
import { LinearGradient } from 'expo-linear-gradient'

import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/Input'
import { useState } from 'react'
import { FilterTabs } from '@/components/Filter'
import { CategoryFilter } from '@/components/CategoryFilter'
import { EmptyTasks } from '@/components/EmptyTasks'
import { TaskCard } from '@/components/TaskCard'
import { AddTaskScreen } from './AddTaskScreen'

export function HomeScreen() {
  const { user, firebaseUser, logout } = useAuth()
  const userIcon = require('../utils/icones/icone_usuario.png')
  const folderIcon = require('../utils/icones/icone_pasta.png')
  const icone_mais = require('../utils/icones/icone_mais.png')
  const numberOfTasks = 0
  const { control, watch } = useForm()
  const searchText = watch('search') ?? ''
  const [selected, setSelected] = useState<'all' | 'pending' | 'completed'>(
    'all',
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'all categories' },
    {
      id: 'work',
      image: require('@/utils/icones/icone_trabalho.png'),
      label: 'Work',
    },
    {
      id: 'personal',
      image: require('@/utils/icones/icone_casa.png'),
      label: 'Personal',
    },
    {
      id: 'study',
      image: require('@/utils/icones/icone_livros.png'),
      label: 'Study',
    },
    {
      id: 'health',
      image: require('@/utils/icones/icone_health.png'),
      label: 'Health',
    },
    {
      id: 'shopping',
      image: require('@/utils/icones/icone_shopping.png'),
      label: 'Shopping',
    },
  ]

  const tasks: any[] = [
    {
      id: '1',
      title: 'Design app to-do list',
      category: 'Weekly challenge',
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Design web trading',
      category: 'Weekly challenge',
      priority: 'low',
      completed: false,
    },
    {
      id: '3',
      title: 'Buy groceries',
      category: 'Shopping',
      priority: 'medium',
      completed: true,
    },
  ]

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
      selectedCategory === 'all'
        ? true
        : task.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesTab && matchesCategory
  })

  const [screen, setScreen] = useState<'home' | 'addTask'>('home')

if (screen === 'addTask') {
  return (
    <AddTaskScreen
      onBack={() => setScreen('home')}
      onSave={(data) => {
        console.log('nova task:', data)
        setScreen('home')
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
          <Image
            source={folderIcon}
            style={{ width: 28, height: 28, tintColor: '#6b6a6a' }}
          />
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
          <FilterTabs onChange={(tab) => setSelected(tab)}/>
        </View>

        <View>
          <CategoryFilter categories={categories} 
          onChange={(id) => setSelectedCategory(id)}/>
        </View>
      </View>

      <View className="flex-1 border-t-[2px] border-auth-border">
        {numberOfTasks === 0 ? (
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
