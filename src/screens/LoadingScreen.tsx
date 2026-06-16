import { ActivityIndicator, Text, View } from 'react-native'

import { colors } from '@/utils/authTheme'

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-auth-background px-6">
      <ActivityIndicator color={colors.purple} />
      <Text className="mt-4 text-sm font-bold text-auth-muted">
        Carregando sua sessão...
      </Text>
    </View>
  )
}
