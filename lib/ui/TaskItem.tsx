// lib/ui/TaskItem.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import GlassCard from '@lib/ui/GlassCard';
import { Colors, spacing, Radii, shadow } from '@theme';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title: string;
  time?: string;
  checked: boolean;
  onToggleDone: () => void;
  onSkip?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function TaskItem({
  title,
  time,
  checked,
  onToggleDone,
  onSkip,
  style,
}: Props) {
  return (
    <GlassCard style={[styles.card, style]}>
      <View style={styles.left}>
        <Text style={[styles.title, checked && styles.titleChecked]}>{title}</Text>
        {time ? <Text style={styles.time}>{time}</Text> : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onSkip} style={[styles.btn, styles.skip]}>
          <Ionicons name="play-skip-forward" size={18} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleDone}
          style={[styles.btn, checked ? styles.doneChecked : styles.doneBase]}
        >
          <Ionicons name="checkmark" size={20} color={Colors.textOnAccent} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  left: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.text },
  titleChecked: { textDecorationLine: 'line-through', color: Colors.muted },
  time: { color: Colors.muted, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10 },
  btn: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...shadow(6),
  },
  skip: {},
  doneBase: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderColor: 'rgba(255,255,255,0.9)',
  },
  doneChecked: {
    backgroundColor: Colors.accentTranslucent,
    borderColor: 'rgba(255,255,255,0.9)',
  },
});
