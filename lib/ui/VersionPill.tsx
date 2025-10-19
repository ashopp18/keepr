// lib/ui/VersionPill.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radii } from '@theme';  // 👈 alias

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>; // permite position absolute si lo necesitas
};

export default function VersionPill({ text, style }: Props) {
  return (
    <View style={[styles.shell, style]} pointerEvents="none">
      <BlurView intensity={15} tint="light" style={styles.blur}>
        <Text style={styles.txt}>{text}</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  blur: {
    paddingHorizontal: 14,
    height: 32,                 // 👈 siempre pequeño
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: Colors.muted,
    fontWeight: '600',
  },
});
