// lib/ui/SwitchRow.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Colors, spacing } from '@theme';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export default function SwitchRow({ label, value, onValueChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(0.5),
  },
  label: { color: Colors.text, fontWeight: '700', fontSize: 18 },
});
