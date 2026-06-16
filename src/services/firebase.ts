import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApp, getApps, initializeApp } from 'firebase/app'
import * as authSdk from '@firebase/auth'
import type { Auth, Persistence } from '@firebase/auth'

import { firebaseConfig } from '@/config/env'

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const reactNativeAuthSdk = authSdk as typeof authSdk & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence
}

function createFirebaseAuth(): Auth {
  try {
    return reactNativeAuthSdk.initializeAuth(app, {
      persistence: reactNativeAuthSdk.getReactNativePersistence(AsyncStorage),
    })
  } catch {
    return reactNativeAuthSdk.getAuth(app)
  }
}

export const firebaseAuth = createFirebaseAuth()
