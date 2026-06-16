import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from '@firebase/auth'

import { firebaseAuth } from '@/services/firebase'
import {
  BackendUser,
  getCurrentUser,
  isNotFoundError,
  registerBackendUser,
} from '@/services/api'

type AuthContextValue = {
  firebaseUser: User | null
  user: BackendUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [user, setUser] = useState<BackendUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setFirebaseUser(currentUser)

      if (!currentUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const backendUser = await loadBackendUser(currentUser)
        setUser(backendUser)
      } catch {
        await signOut(firebaseAuth)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })

    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    )
    const backendUser = await registerBackendUser(credential.user)

    setFirebaseUser(credential.user)
    setUser(backendUser)
  }

  async function register(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    )

    await updateProfile(credential.user, { displayName: name })
    const backendUser = await registerBackendUser(credential.user, name)

    setFirebaseUser(credential.user)
    setUser(backendUser)
  }

  async function logout() {
    await signOut(firebaseAuth)
    setFirebaseUser(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      firebaseUser,
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [firebaseUser, isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

async function loadBackendUser(firebaseUser: User) {
  try {
    return await getCurrentUser(firebaseUser)
  } catch (error) {
    if (isNotFoundError(error)) {
      return registerBackendUser(firebaseUser)
    }

    throw error
  }
}
