import { useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { loginSchema, LoginFormData } from '../validation/loginSchema'
import { AuthStackParamList } from '@/navigation/types'
import { AppLogo } from '@/components/AppLogo'
import { Input } from '@/components/Input'
import { GradientButton } from '@/components/CustomButton'
import { useAuth } from '@/contexts/AuthContext'
import { getAuthErrorMessage } from '@/utils/authErrors'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await login(data.email, data.password)
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
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

          <GradientButton
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />

          {submitError ? (
            <Text className="mt-3 text-center text-xs font-bold text-auth-error">
              {submitError}
            </Text>
          ) : null}
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
