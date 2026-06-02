
import { colors } from "@/utils/authTheme"
import { FontAwesome } from "@expo/vector-icons"
import { TextInput, TextInputProps, View } from "react-native"
import { Text } from "react-native"

type FieldIconName = 'envelope' | 'lock' | 'user'

export function Input({
  label,
  icon,
  error,
  ...inputProps
}: TextInputProps & {
  label: string
  icon: FieldIconName
  error?: string
}) {
  return (
    <View className="mb-[18px]">
      <Text className="mb-2 text-xs font-bold text-auth-text">{label}</Text>
      <View
        className={`h-[49px] flex-row items-center gap-3 rounded-[10px] border bg-auth-surface px-[13px] ${
          error ? 'border-auth-error' : 'border-auth-border'
        }`}
      >
        <FontAwesome
            name={icon}
            size={17}
            color={colors.icon}
        />
        <TextInput
          {...inputProps}
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