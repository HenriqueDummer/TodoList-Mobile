import { useLayoutEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { loginSchema, LoginFormData } from '../validation/loginSchema'
import { AuthStackParamList } from '@/navigation/types'
import { authGradientColors } from '../utils/authTheme'
import { AppLogo } from '@/components/AppLogo'
import { Input } from '@/components/Input'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export function LoginScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  async function onSubmit(data: LoginFormData) {
    console.log(data)

    // TODO: Implementar lógica de login
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-auth-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-[13px] pt-[120px] pb-14"
        keyboardShouldPersistTaps="handled"
      >
        <AppLogo />

        <Text className="text-center text-[25px] font-extrabold text-auth-text">
          Bem Vindo de Volta
        </Text>
        <Text className="mt-1.5 text-center text-[13px] text-auth-muted">
          Faça login para continuar
        </Text>

        <View className="mt-11">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                icon="envelope"
                placeholder="Seu email"
                value={field.value || ''}
                onChangeText={field.onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="Password"
                icon="lock"
                placeholder="Sua senha"
                secureTextEntry
                value={field.value || ''}
                onChangeText={field.onChange}
                error={errors.password?.message}
              />
            )}
          />

          <GradientButton title="Entrar" onPress={handleSubmit(onSubmit)} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.75}
          className="mt-8"
        >
          <Text className="text-center text-[13px] text-auth-muted">
            Não tem uma conta?{' '}
            <Text className="font-extrabold text-auth-purple">Criar Conta</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function GradientButton({
  title,
  onPress,
}: {
  title: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      className="h-[46px] items-center justify-center overflow-hidden rounded-[10px]"
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="buttonGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={authGradientColors[0]} />
            <Stop offset="1" stopColor={authGradientColors[1]} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={10} fill="url(#buttonGradient)" />
      </Svg>
      <Text className="text-[13px] font-extrabold text-auth-text">
        {title}
      </Text>
    </TouchableOpacity>
  )
}
