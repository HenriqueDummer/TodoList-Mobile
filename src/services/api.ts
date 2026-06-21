import axios, { AxiosError } from 'axios'
import type { User } from '@firebase/auth'

import { apiBaseUrl } from '@/config/env'

export type BackendUser = {
  id: string
  firebaseId: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export type BackendCategory = {
  id: string
  name: string
  icon: string
  color: string
  createdAt?: string
  updatedAt?: string
}

export type CategoryPayload = {
  name: string
  icon: string
  color: string
}

export type BackendTask = {
  id: string
  title: string
  description?: string | null
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  categoryId?: string | null
  category?: BackendCategory | null
  userId: string
  createdAt: string
  updatedAt: string
}

export type TaskPayload = {
  title: string
  description?: string
  completed?: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  categoryId?: string | null
}

export type UpdateTaskPayload = Partial<TaskPayload>

export const api = axios.create({
  baseURL: apiBaseUrl,
})

async function authHeaders(firebaseUser: User) {
  const token = await firebaseUser.getIdToken()

  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function registerBackendUser(firebaseUser: User, name?: string) {
  console.log(firebaseUser, name)
  const { data } = await api.post<BackendUser>('/users', name ? { name } : {}, {
    headers: await authHeaders(firebaseUser),
  })

  return data
}

export async function getCurrentUser(firebaseUser: User) {
  const { data } = await api.get<BackendUser>('/users/me', {
    headers: await authHeaders(firebaseUser),
  })

  return data
}

export async function getCategories(firebaseUser: User) {
  const { data } = await api.get<BackendCategory[]>('/categories', {
    headers: await authHeaders(firebaseUser),
  })

  return data
}

export async function createCategory(
  firebaseUser: User,
  payload: CategoryPayload,
) {
  const { data } = await api.post<BackendCategory>('/categories', payload, {
    headers: await authHeaders(firebaseUser),
  })

  return data
}

export async function updateCategory(
  firebaseUser: User,
  id: string,
  payload: Partial<CategoryPayload>,
) {
  const { data } = await api.patch<BackendCategory>(
    `/categories/${id}`,
    payload,
    {
      headers: await authHeaders(firebaseUser),
    },
  )

  return data
}

export async function deleteCategory(firebaseUser: User, id: string) {
  await api.delete(`/categories/${id}`, {
    headers: await authHeaders(firebaseUser),
  })
}

export async function getTasks(firebaseUser: User, query?: { status?: 'completed' | 'pending', categoryId?: string }) {
  const { data } = await api.get<BackendTask[]>('/tasks', {
    headers: await authHeaders(firebaseUser),
    params: query,
  })
  return data
}

export async function createTask(firebaseUser: User, payload: TaskPayload) {
  const { data } = await api.post<BackendTask>('/tasks', payload, {
    headers: await authHeaders(firebaseUser),
  })
  return data
}

export async function updateTask(firebaseUser: User, id: string, payload: UpdateTaskPayload) {
  const { data } = await api.patch<BackendTask>(`/tasks/${id}`, payload, {
    headers: await authHeaders(firebaseUser),
  })
  return data
}

export async function deleteTask(firebaseUser: User, id: string) {
  await api.delete(`/tasks/${id}`, {
    headers: await authHeaders(firebaseUser),
  })
}

export function isNotFoundError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return getAxiosErrorMessage(error)
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível concluir a operação.'
}

function getAxiosErrorMessage(error: AxiosError<{ message?: string }>) {
  const message = error.response?.data?.message

  if (Array.isArray(message)) {
    return message[0]
  }

  return message ?? 'Não foi possível conectar ao servidor.'
}
