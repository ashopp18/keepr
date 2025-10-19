// lib/ui/GlassButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radii, spacing, shadow } from '@theme';


type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function GlassButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.wrap, style]}>
      <BlurView intensity={20} tint="light" style={styles.blur} pointerEvents="none" />
      <View style={styles.fill} />
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52
  },
  blur: { ...StyleSheet.absoluteFillObject },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.accentTranslucent // 👈 nombre correcto
  },
  txt: { color: '#fff', fontWeight: '700', fontSize: 16, paddingHorizontal: 16 }
});
