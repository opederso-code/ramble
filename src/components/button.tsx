import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { font, theme } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'quiet';
};

export function Button({ label, onPress, disabled = false, tone = 'primary' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        tone === 'primary' ? styles.primary : styles.quiet,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        Platform.OS === 'web' && !disabled ? { cursor: 'pointer' as const } : null,
      ]}
    >
      <Text style={[styles.label, tone === 'quiet' && styles.quietLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: theme.terracottaDeep,
  },
  quiet: {
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  label: {
    color: '#FFFBF6',
    fontFamily: font.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  quietLabel: {
    color: theme.ink,
    fontFamily: font.medium,
  },
});
