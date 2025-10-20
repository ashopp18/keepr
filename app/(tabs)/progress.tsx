// app/(tabs)/progress.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, Radii, shadow } from '@theme';
import GlassCard from '@lib/ui/GlassCard';
import VersionPill from '@lib/ui/VersionPill';
import { useT } from '@lib/LocaleProvider';
import { useTreatments } from '@lib/store/useTreatments';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();

  // Datos actuales disponibles (sin romper nada del store)
  const today = useTreatments(s => s.today);              // [{ id, done, time }]
  const streakDays = useTreatments(s => s.streakDays);    // número de días de racha

  // Métricas derivadas mínimas
  const { totalToday, doneToday, todayAdherencePct } = useMemo(() => {
    const total = today.length;
    const done = today.filter(i => i.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0; // adhesión diaria
    return { totalToday: total, doneToday: done, todayAdherencePct: pct };
  }, [today]);

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
        {/* Título + subtítulo */}
        <Text style={styles.title}>{t('progress.title', 'Progress')}</Text>
        <Text style={styles.subtitle}>
          {t('progress.subtitle', 'Your photo timeline will live here.')}
        </Text>

        {/* Métricas rápidas */}
        <GlassCard style={{ padding: spacing(2) }}>
          <Text style={styles.cardTitle}>{t('progress.metrics.title', 'Metrics')}</Text>

          <View style={styles.statsRow}>
            <Stat
              label={t('progress.metrics.streak', 'Streak')}
              value={`${streakDays ?? 0}d`}
            />
            <Stat
              label={t('progress.metrics.today', 'Today')}
              value={`${doneToday}/${totalToday}`}
            />
            <Stat
              label={t('progress.metrics.adherence', 'Adherence')}
              value={`${todayAdherencePct}%`}
            />
          </View>

          <Text style={styles.mutedSmall}>
            {t(
              'progress.metrics.disclaimer',
              'Daily adherence shown. We’ll add weekly/monthly adherence based on validated methods.'
            )}
          </Text>
        </GlassCard>

        {/* Galería de fotos (placeholder visual) */}
        <GlassCard style={{ padding: spacing(2) }}>
          <Text style={styles.cardTitle}>{t('progress.photos.title', 'Photo timeline')}</Text>
          <Text style={styles.muted}>
            {t('progress.photos.desc', 'Add photos to visualize your progress over time.')}
          </Text>

          <View style={styles.actionsRow}>
            <PrimaryButton
              kind="ghost"
              label={t('progress.photos.add', 'Add photo')}
              onPress={() => {
                // TODO: conectar con ImagePicker + persistencia por usuario
              }}
            />
            <PrimaryButton
              kind="ghost"
              label={t('progress.photos.view', 'View timeline')}
              onPress={() => {
                // TODO: abrir visor/galería
              }}
            />
          </View>

          <View style={styles.galleryRow}>
            <ThumbPlaceholder />
            <ThumbPlaceholder />
            <ThumbPlaceholder />
            <ThumbPlaceholder />
          </View>
        </GlassCard>

        {/* Check-in semanal (más aire + separador + botón centrado) */}
        <GlassCard style={{ padding: spacing(2), gap: spacing(1.25) }}>
          <Text style={styles.cardTitle}>{t('progress.checkin.title', 'Weekly check-in')}</Text>
          <Text style={styles.muted}>
            {t(
              'progress.checkin.desc',
              'Answer a short checklist once a week about side effects and how you feel.'
            )}
          </Text>

          <View style={styles.sep} />

          <View style={{ alignItems: 'center' }}>
            <PrimaryButton
              label={t('progress.checkin.start', 'Start weekly check')}
              onPress={() => {
                // TODO: abrir modal check-in semanal (una sola vez por semana)
              }}
            />
          </View>

          <Text style={[styles.mutedSmall, { textAlign: 'center' }]}>
            {t('progress.checkin.note', 'Available once per week to avoid bias.')}
          </Text>
        </GlassCard>

        {/* Footer versión (uniforme) */}
        <View style={{ alignItems: 'center', marginTop: spacing(6) }}>
          <VersionPill text="Keepr • v0.1" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- subcomponentes locales ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  kind = 'solid',
}: {
  label: string;
  onPress?: () => void;
  kind?: 'solid' | 'ghost';
}) {
  const style = kind === 'solid' ? styles.primaryBtn : styles.ghostBtn;
  const textStyle = kind === 'solid' ? styles.primaryBtnText : styles.ghostBtnText;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={style}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

function ThumbPlaceholder() {
  return <View style={styles.thumb} />;
}

/* ---------- estilos ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  title: { fontSize: 32, fontWeight: '800', color: Colors.text, marginTop: spacing(2) },
  subtitle: { color: Colors.muted, marginTop: spacing(1), fontSize: 16 },

  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: spacing(1) },
  muted: { color: Colors.muted },
  mutedSmall: { color: Colors.muted, fontSize: 12, marginTop: spacing(1) },

  statsRow: {
    flexDirection: 'row',
    gap: spacing(2),
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  stat: {
    flex: 1,
    backgroundColor: Colors.glassBg,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
    ...shadow(4),
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.muted, marginTop: 4 },

  actionsRow: { flexDirection: 'row', gap: spacing(1.5), marginTop: spacing(1.5) },

  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2),
    borderRadius: Radii.lg,
    alignItems: 'center',
    ...shadow(8),
  },
  primaryBtnText: { color: Colors.textOnAccent, fontWeight: '800', fontSize: 15 },

  ghostBtn: {
    backgroundColor: 'rgba(111,131,230,0.12)',
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(2),
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.accentTranslucent,
  },
  ghostBtnText: { color: Colors.accent, fontWeight: '800', fontSize: 15 },

  galleryRow: {
    flexDirection: 'row',
    gap: spacing(1),
    marginTop: spacing(1.5),
  },
  thumb: {
    height: 68,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // separador sutil para el bloque de check-in
  sep: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.6,
    marginVertical: spacing(1),
  },
});


