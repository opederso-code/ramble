import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Image } from "expo-image";
import { colors, font, shadow } from "../theme";
import { assets } from "../assets";
import { icons, IconName } from "../icons";

export function T({
  style,
  weight = "400",
  ...props
}: TextProps & { weight?: "400" | "500" | "600" | "700" }) {
  return <Text {...props} style={[s.text, { fontWeight: weight }, style]} />;
}
export function Icon({
  name,
  size = 20,
  color = colors.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <Image
      source={icons[name]}
      style={{ width: size, height: size }}
      tintColor={color}
      contentFit="contain"
      accessible={false}
    />
  );
}
export function Button({
  children,
  onPress,
  label,
  style,
  disabled,
  selected,
  testID,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  selected?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        style,
        pressed && { opacity: 0.72, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.4 },
      ]}
    >
      {children}
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  dark,
  size = 36,
  iconSize = 18,
  style,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  dark?: boolean;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Button
      label={label}
      onPress={onPress}
      style={[
        s.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dark ? colors.ink : colors.surface,
        },
        style,
      ]}
    >
      <Icon name={name} size={iconSize} color={dark ? "white" : colors.ink} />
    </Button>
  );
}
export function Avatar({
  size = 40,
  border = false,
}: {
  size?: number;
  border?: boolean;
}) {
  // Match Figma's cropped image fill, including its transparent source margins.
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: colors.avatar,
        borderWidth: border ? 2.5 : 0,
        borderColor: "#fff",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size * 0.725,
          height: size * 0.75,
          left: size * 0.15 - (border ? 2.5 : 0),
          top: size * 0.15 - (border ? 2.5 : 0),
          overflow: "hidden",
        }}
      >
        <Image
          source={assets.kendrick}
          contentFit="fill"
          style={{
            width: "152.38%",
            height: "145.45%",
            left: "-26.19%",
            top: "-18.18%",
          }}
        />
      </View>
    </View>
  );
}
export function Handle({ wide = false }: { wide?: boolean }) {
  return (
    <View
      style={{
        width: wide ? 91 : 36,
        height: wide ? 4 : 5,
        borderRadius: 3,
        backgroundColor: wide ? "#e5e5e5" : "#d1d1cc",
        alignSelf: "center",
        marginTop: wide ? 14 : 8,
      }}
    />
  );
}
export function Chip({
  title,
  icon,
  onPress,
  color = colors.peach,
  ink = "#ff8a1b",
  large,
  selected,
}: {
  title: string;
  icon: IconName;
  onPress: () => void;
  color?: string;
  ink?: string;
  large?: boolean;
  selected?: boolean;
}) {
  return (
    <Button
      label={title}
      onPress={onPress}
      selected={selected}
      style={[
        s.chip,
        {
          backgroundColor: color,
          height: large ? 44 : 32,
          paddingHorizontal: large ? 12 : 10,
          gap: large ? 8 : 6,
        },
        selected && { borderWidth: 1.5, borderColor: colors.ink },
      ]}
    >
      <Icon name={icon} size={large ? 20 : 16} color={ink} />
      <T
        weight="600"
        style={{ fontSize: large ? 16 : 14, lineHeight: large ? 20 : 18 }}
      >
        {title}
      </T>
    </Button>
  );
}
export function WebStatus({ light = false }: { light?: boolean }) {
  if (Platform.OS !== "web") return null;
  return (
    <View pointerEvents="none" style={s.status}>
      <T
        weight="600"
        style={{
          fontSize: 17,
          lineHeight: 22,
          color: light ? "white" : "#000",
        }}
      >
        9:41
      </T>
      <Image
        source={light ? assets.indicatorsWhite : assets.indicators}
        style={{ width: 78, height: 13 }}
        contentFit="contain"
      />
    </View>
  );
}
export function WebHome({ light = false }: { light?: boolean }) {
  return Platform.OS === "web" ? (
    <View pointerEvents="none" style={s.homeArea}>
      <View
        style={{
          width: 139,
          height: 5,
          borderRadius: 3,
          backgroundColor: light ? "white" : "black",
        }}
      />
    </View>
  ) : null;
}
export const ui = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  muted: { color: colors.muted },
  pad: { paddingHorizontal: 24 },
  shadow,
});
const s = StyleSheet.create({
  text: {
    fontFamily: font,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    includeFontPadding: false,
  },
  center: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 99,
    flexShrink: 0,
  },
  status: {
    height: 54,
    paddingLeft: 52,
    paddingRight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
    zIndex: 2,
  },
  homeArea: {
    position: "absolute",
    bottom: 8,
    height: 5,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
});
