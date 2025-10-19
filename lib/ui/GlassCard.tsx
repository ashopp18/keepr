// lib/ui/GlassCard.tsx
import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radii, shadow } from '@theme';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export default function GlassCard({ style, contentContainerStyle, children }: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.inner, contentContainerStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.glassBg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...shadow(8)
  },
  inner: {
    padding: 16
  }
});
