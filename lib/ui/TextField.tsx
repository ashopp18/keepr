// lib/ui/TextField.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import GlassCard from '@lib/ui/GlassCard';
import { Colors, Radii, spacing } from '@theme';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
} & Pick<
  TextInputProps,
  | 'keyboardType'
  | 'secureTextEntry'
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'textContentType'
>;

export default function TextField({
  value,
  onChange,
  placeholder,
  ...rest
}: Props) {
  return (
    <GlassCard style={styles.wrap} contentContainerStyle={{ paddingVertical: 0 }}>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        placeholderTextColor={Colors.muted}
        style={styles.input}
        autoCorrect={false}
        {...rest}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radii.xl,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
  },
  input: {
    paddingVertical: spacing(1),
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
