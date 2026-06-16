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

import { registerSchema, RegisterFormData } from '../validation/registerSchema'
import { AuthStackParamList } from '@/navigation/types'
import { AppLogo } from '@/components/AppLogo'
import { Input } from '@/components/Input'
import { GradientButton } from '@/components/CustomButton'
import { useAuth } from '@/contexts/AuthContext'
import { getAuthErrorMessage } from '@/utils/authErrors'

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  async function onSubmit(data: RegisterFormData) {
    setSubmitError(null)
    setIsSubmitting(true)
    console.log(data)

    try {
      await register(data.name, data.email, data.password)
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
        contentContainerClassName="grow px-[13px] pt-[46px] pb-12"
        keyboardShouldPersistTaps="handled"
      >
        <AppLogo />

        <Text className="text-center text-[25px] font-extrabold text-auth-text">
          Criar Conta
        </Text>
        <Text className="mt-1.5 text-center text-[13px] text-auth-muted">
          Crie sua conta para começar
        </Text>

        <View className="mt-[42px]">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                label="Full Name"
                icon="user"
                placeholder="Enter your name"
                value={field.value || ''}
                onChangeText={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

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
                placeholder="Crie uma senha"
                secureTextEntry
                value={field.value || ''}
                onChangeText={field.onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                label="Confirm Password"
                icon="lock"
                placeholder="Confirme sua senha"
                secureTextEntry
                value={field.value || ''}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <GradientButton
            title="Criar Conta"
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
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.75}
          className="mt-[31px]"
        >
          <Text className="text-center text-[13px] text-auth-muted">
            Já tem uma conta?{' '}
            <Text className="font-extrabold text-auth-purple">Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
