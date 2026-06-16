import { Text, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'

export function HomeScreen() {
  const { user, firebaseUser, logout } = useAuth()
  const displayName = user?.name ?? firebaseUser?.displayName ?? 'Usuário'
  const email = user?.email ?? firebaseUser?.email

  return (
    <View className="flex-1 justify-between bg-auth-background px-6 py-14">
      <View>
        <Text className="text-[28px] font-extrabold text-auth-text">
          Olá, {displayName}
        </Text>
        {email ? (
          <Text className="mt-2 text-sm text-auth-muted">{email}</Text>
        ) : null}

        <View className="mt-10 rounded-[14px] border border-auth-border bg-auth-surface p-5">
          <Text className="text-base font-extrabold text-auth-text">
            Autenticação pronta
          </Text>
          <Text className="mt-2 text-sm leading-5 text-auth-muted">
            Sua sessão Firebase está conectada ao usuário local da API.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={logout}
        activeOpacity={0.8}
        className="h-[46px] items-center justify-center rounded-[10px] border border-auth-border bg-auth-surface"
      >
        <Text className="text-[13px] font-extrabold text-auth-text">Sair</Text>
      </TouchableOpacity>
    </View>
  )
}
