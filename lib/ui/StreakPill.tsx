// lib/ui/StreakPill.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, spacing, shadow } from '@theme';
import { Ionicons } from '@expo/vector-icons';

export default function StreakPill({ value = 0 }: { value?: number }) {
  return (
    <View style={styles.pill}>
      <View style={styles.dot}>
        <Ionicons name="water" size={12} color="#fff" />
      </View>
      <Text style={styles.text}>{value}d</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    backgroundColor: Colors.glassBg,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: spacing(3),
    height: 40,
    ...shadow(6)
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { color: Colors.text, fontWeight: '700' }
});
