import type { BackendTask } from '@/services/api'

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type AppStackParamList = {
  Home: undefined
  AddTask: undefined
  EditTask: {
    task: BackendTask
  }
  Categories: undefined
}
