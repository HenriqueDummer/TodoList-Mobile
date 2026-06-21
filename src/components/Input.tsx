
import { useState } from "react"
import { colors } from "@/utils/authTheme"
import { FontAwesome } from "@expo/vector-icons"
import { TextInput, TextInputProps, View } from "react-native"
import { Text } from "react-native"

type FieldIconName = 'envelope' | 'lock' | 'user' | 'search'

export function Input({
  label,
  icon,
  error,
  onFocus,
  onBlur,
  ...inputProps
}: TextInputProps & {
  label: string
  icon: FieldIconName
  error?: string
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View className="mb-[18px]">
      <Text className="mb-2 text-xs font-bold text-auth-text">{label}</Text>
      <View
        className={`h-[49px] flex-row items-center gap-3 rounded-[10px] border-2 bg-auth-surface px-[13px] ${
          error
            ? 'border-auth-error'
            : isFocused
            ? 'border-auth-purple'
            : 'border-auth-border'
        }`}
      >
        <FontAwesome
          name={icon}
          size={17}
          color={colors.icon}
        />
        <TextInput
          {...inputProps}
          onFocus={(event) => {
            setIsFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setIsFocused(false)
            onBlur?.(event)
          }}
          placeholderTextColor={colors.placeholder}
          className="h-full flex-1 text-[13px] text-auth-text"
        />
      </View>
      {error ? (
        <Text className="mt-1.5 text-xs text-auth-error">{error}</Text>
      ) : null}
    </View>
  )
}