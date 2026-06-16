import { authGradientColors } from '@/utils/authTheme'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

interface Props {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
}

export function GradientButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.86}
      className={`mt-2 h-[46px] items-center justify-center overflow-hidden rounded-[10px] ${
        disabled || loading ? 'opacity-70' : ''
      }`}
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
        {loading ? 'Carregando...' : title}
      </Text>
    </TouchableOpacity>
  )
}
