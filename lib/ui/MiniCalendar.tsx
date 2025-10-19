// lib/ui/MiniCalendar.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@lib/ui/GlassCard';
import { Colors, spacing, Radii } from '@theme';
import { useLocale } from '@lib/LocaleProvider';

function startOfWeek(d: Date) {
  // Semana que empieza en lunes
  const day = d.getDay(); // 0=Dom, 1=Lun, ...
  const diff = (day === 0 ? -6 : 1 - day); // mover a lunes
  const res = new Date(d);
  res.setDate(d.getDate() + diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

function addDays(d: Date, n: number) {
  const res = new Date(d);
  res.setDate(d.getDate() + n);
  return res;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MiniCalendar() {
  const { locale } = useLocale();
  const today = new Date();

  const week = useMemo(() => {
    const start = startOfWeek(today);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [today]);

  const shortWeekdays = useMemo(() => {
    // Etiquetas muy cortas, suaves, localizadas
    const intl = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return week.map((d) => intl.format(d).replace('.', '')); // p.ej. "mié." -> "mié"
  }, [week, locale]);

  return (
    <GlassCard style={styles.wrap}>
      <View style={styles.row}>
        {week.map((d, idx) => {
          const selected = isSameDate(d, today);
          return (
            <View key={idx} style={[styles.cell, selected && styles.cellSelected]}>
              <Text style={[styles.wd, selected && styles.wdSelected]}>
                {shortWeekdays[idx].slice(0, 3)}
              </Text>
              <Text style={[styles.day, selected && styles.daySelected]}>
                {d.getDate()}
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: spacing(2), paddingHorizontal: spacing(2) },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: {
    width: 44,
    height: 56,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: Colors.accentTranslucent,
  },
  wd: { color: Colors.muted, fontSize: 12, marginBottom: 2 },
  wdSelected: { color: Colors.text },
  day: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  daySelected: { color: Colors.textOnAccent },
});
