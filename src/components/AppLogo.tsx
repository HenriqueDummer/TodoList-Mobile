import { colors, authGradientColors } from "@/utils/authTheme";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";

export function AppLogo() {
  return (
    <View className="mb-1.5 items-center justify-center">
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Defs>
          <LinearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={authGradientColors[0]} />
            <Stop offset="1" stopColor={authGradientColors[1]} />
          </LinearGradient>
        </Defs>
        <Rect width={56} height={56} rx={14} fill="url(#logoGradient)" />
      </Svg>
      <View className="absolute h-14 w-14 items-center justify-center">
        <FontAwesome name="check-square-o" size={27} color={colors.text} />
      </View>
    </View>
  )
}