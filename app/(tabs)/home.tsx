// app/(tabs)/home.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '@theme';
import StreakPill from '@lib/ui/StreakPill';
import TaskItem from '@lib/ui/TaskItem';
import MiniCalendar from '@lib/ui/MiniCalendar';
import { useTreatments } from '@lib/store/useTreatments';
import { useT } from '@lib/LocaleProvider';
import VersionPill from '@lib/ui/VersionPill';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();

  const todayIds = useTreatments(s => s.today);
  const treatments = useTreatments(s => s.treatments);
  const toggleToday = useTreatments(s => s.toggleToday);
  const streakDays = useTreatments(s => s.streakDays);

  const today = useMemo(() => {
    const map = new Map(treatments.map(tr => [tr.id, tr]));
    return todayIds
      .map(it => {
        const tr = map.get(it.id);
        return {
          id: it.id,
          done: it.done,
          name: tr?.name ?? '—',
          time: tr?.time ?? '',
          reminder: tr?.reminder ?? false,
        };
      })
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [todayIds, treatments]);

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing(2),
          paddingBottom: insets.bottom + spacing(24),
          gap: spacing(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('home.today', 'Hoy')}</Text>
          <StreakPill value={streakDays ?? 0} />
        </View>

        <Text style={styles.subtitle}>
          {t('home.subtitle', 'Pequeños pasos, grandes cambios.')}
        </Text>

        {/* Mini calendar (tu versión) */}
        <MiniCalendar />

        {/* Lista del día */}
        <Text style={styles.sectionTitle}>{t('home.todayList', 'Lista de hoy')}</Text>
        {today.map(item => (
          <TaskItem
            key={item.id}
            title={item.name}
            time={item.time}
            checked={item.done}
            onToggleDone={() => toggleToday(item.id)}
            onSkip={() => {}}
          />
        ))}

        {/* Footer versión unificado */}
        <View style={{ alignItems: 'center', marginTop: spacing(6) }}>
          <VersionPill text="Keepr • v0.1" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing(2),
  },
  title: { fontSize: 44, fontWeight: '800', color: Colors.text },
  subtitle: { color: Colors.muted, marginTop: spacing(2), fontSize: 18 },
  sectionTitle: {
    marginTop: spacing(2),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
});
