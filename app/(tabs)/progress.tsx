// app/(tabs)/progress.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { Colors, spacing, Radii, shadow } from '@theme';
import GlassCard from '@lib/ui/GlassCard';
import VersionPill from '@lib/ui/VersionPill';
import PhotoGrid from '@lib/ui/PhotoGrid';
import { useT } from '@lib/LocaleProvider';
import { useProgress } from '@lib/store/useProgress';
import { useTreatments } from '@lib/store/useTreatments';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();

  const photos = useProgress((s) => s.photos);
  const addPhoto = useProgress((s) => s.addPhoto);
  const removePhoto = useProgress((s) => s.removePhoto);

  const streakDays = useTreatments((s) => s.streakDays);
  const todayCount = useTreatments((s) => s.today.length);

  const [viewer, setViewer] = useState<string | null>(null);
  const current = photos.find((p) => p.id === viewer);

  const metrics = useMemo(() => {
    // Métricas iniciales simples (no rompen nada):
    const totalPhotos = photos.length;
    // “Adherencia estimada” básica: racha / (racha + días sin fotos recientes)
    const adherence = Math.min(100, Math.round((streakDays / Math.max(1, streakDays + 7)) * 100));
    return { totalPhotos, adherence, streakDays, todayCount };
  }, [photos.length, streakDays, todayCount]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert(t('progress.perms.title', 'Permisos necesarios'), t('progress.perms.body', 'Concede acceso a tus fotos para poder añadir imágenes.'));
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]) {
      const uri = res.assets[0].uri;
      const date = new Date().toISOString().slice(0, 10);
      addPhoto({ uri, date });
    }
  };

  const removeCurrent = () => {
    if (current) {
      Alert.alert(
        t('progress.deletePhoto', 'Eliminar foto'),
        t('progress.deletePhotoConfirm', '¿Seguro que quieres eliminar esta foto?'),
        [
          { text: t('common.cancel', 'Cancelar') },
          {
            text: t('common.delete', 'Eliminar'),
            style: 'destructive',
            onPress: () => {
              removePhoto(current.id);
              setViewer(null);
            },
          },
        ]
      );
    }
  };

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
        <Text style={styles.title}>{t('progress.title', 'Progreso')}</Text>
        <Text style={styles.subtitle}>
          {t('progress.subtitle', 'Tu línea de tiempo de fotos vivirá aquí.')}
        </Text>

        {/* Métricas */}
        <GlassCard style={{ padding: spacing(2) }}>
          <Text style={styles.cardTitle}>{t('progress.metrics', 'Métricas')}</Text>
          <View style={styles.metricsRow}>
            <Metric label={t('progress.m.photos', 'Fotos')} value={String(metrics.totalPhotos)} />
            <Metric label={t('progress.m.streak', 'Racha')} value={`${metrics.streakDays}d`} />
            <Metric label={t('progress.m.adherence', 'Adherencia')} value={`${metrics.adherence}%`} />
          </View>
          <Text style={styles.mutedSmall}>
            {t('progress.metricsFoot', 'La adherencia es una estimación simple basada en tu racha.')}
          </Text>
        </GlassCard>

        {/* Galería */}
        <GlassCard style={{ padding: spacing(2) }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{t('progress.gallery', 'Galería')}</Text>
            <TouchableOpacity onPress={pickImage} style={styles.addBtn}>
              <Text style={styles.addBtnTxt}>{t('progress.addPhoto', 'Añadir foto')}</Text>
            </TouchableOpacity>
          </View>

          {photos.length === 0 ? (
            <Text style={styles.mutedSmall}>
              {t('progress.empty', 'Aún no has subido fotos. Añade tu primera para ver la evolución.')}
            </Text>
          ) : (
            <PhotoGrid
              items={photos.map((p) => ({ id: p.id, uri: p.uri }))}
              onPress={(id) => setViewer(id)}
            />
          )}
        </GlassCard>

        {/* Check-in semanal efectos secundarios */}
        <CheckInCard />
        <View style={{ alignItems: 'center', marginTop: spacing(8) }}>
          <VersionPill text="Keepr • v0.1" />
        </View>
      </ScrollView>

      {/* Visor modal simple */}
      <Modal visible={!!viewer} transparent animationType="fade" onRequestClose={() => setViewer(null)}>
        <Pressable style={styles.backdrop} onPress={() => setViewer(null)} />
        {current && (
          <View style={styles.viewer}>
            <Image source={{ uri: current.uri }} style={styles.viewerImg} />
            <View style={styles.viewerActions}>
              <Text style={styles.viewerDate}>{current.date}</Text>
              <TouchableOpacity onPress={removeCurrent} style={styles.dangerBtn}>
                <Text style={styles.dangerTxt}>{t('common.delete', 'Eliminar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

/* ---- subcomponents ---- */

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function CheckInCard() {
  const t = useT();
  const upsert = useProgress((s) => s.upsertCheck);

  const weekOf = useMemo(() => {
    const d = new Date();
    const firstJan = new Date(d.getFullYear(), 0, 1);
    const pastDays = Math.floor(((+d - +firstJan) / 86400000 + firstJan.getDay() + 6) / 7);
    const w = String(pastDays + 1).padStart(2, '0');
    return `${d.getFullYear()}-${w}`;
  }, []);

  const [state, setState] = useState({
    shedding: false,
    itch: false,
    redness: false,
    dizziness: false,
    libidoChanges: false,
    otherNote: '',
  });

  const save = () => {
    upsert({ weekOf, answers: state });
    Alert.alert(t('progress.check.savedTitle', 'Guardado'), t('progress.check.saved', 'Tu check-in semanal se ha guardado.'));
  };

  return (
    <GlassCard style={{ padding: spacing(2) }}>
      <Text style={styles.cardTitle}>{t('progress.check.title', 'Check-in semanal')}</Text>
      <Text style={styles.mutedSmall}>
        {t('progress.check.desc', 'Marca si has notado alguno de estos efectos esta semana.')}
      </Text>

      <View style={{ height: spacing(1) }} />
      {[
        { key: 'shedding', label: t('progress.check.shedding', 'Shedding / caída aumentada') },
        { key: 'itch', label: t('progress.check.itch', 'Picor') },
        { key: 'redness', label: t('progress.check.redness', 'Enrojecimiento / irritación') },
        { key: 'dizziness', label: t('progress.check.dizziness', 'Mareos') },
        { key: 'libidoChanges', label: t('progress.check.libido', 'Cambios en libido') },
      ].map((it) => (
        <RowCheck
          key={it.key}
          label={it.label}
          value={(state as any)[it.key]}
          onChange={(v) => setState((s) => ({ ...s, [it.key]: v }))}
        />
      ))}

      <TouchableOpacity onPress={save} style={[styles.addBtn, { alignSelf: 'flex-start', marginTop: spacing(2) }]}>
        <Text style={styles.addBtnTxt}>{t('common.save', 'Guardar')}</Text>
      </TouchableOpacity>
    </GlassCard>
  );
}

function RowCheck({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.checkRow}>
      <Text style={styles.checkLabel}>{label}</Text>
      <TouchableOpacity
        onPress={() => onChange(!value)}
        style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
      >
        <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
      </TouchableOpacity>
    </View>
  );
}

/* ---- styles ---- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, marginTop: spacing(2) },
  subtitle: { color: Colors.muted, marginTop: spacing(1), fontSize: 16 },

  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  mutedSmall: { color: Colors.muted, marginTop: spacing(1) },

  metricsRow: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(1.5) },
  metric: {
    flex: 1,
    backgroundColor: Colors.glassBg,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    paddingVertical: spacing(2),
  },
  metricValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  metricLabel: { color: Colors.muted, marginTop: 4 },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  addBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: Radii.md,
    ...shadow(6),
  },
  addBtnTxt: { color: Colors.textOnAccent, fontWeight: '800' },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(1),
  },
  checkLabel: { color: Colors.text, fontWeight: '600' },

  toggle: {
    width: 48,
    height: 28,
    borderRadius: 16,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: Colors.accent },
  toggleOff: { backgroundColor: '#D2D7E1' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  knobOn: { alignSelf: 'flex-end' },
  knobOff: { alignSelf: 'flex-start' },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  viewer: {
    position: 'absolute',
    left: spacing(2),
    right: spacing(2),
    top: spacing(8),
    bottom: spacing(8),
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  viewerImg: { width: '100%', height: '85%', resizeMode: 'contain' },
  viewerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing(2),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  viewerDate: { color: '#fff', fontWeight: '700' },
  dangerBtn: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: Radii.md,
    backgroundColor: '#e36b6b',
  },
  dangerTxt: { color: '#fff', fontWeight: '800' },
});
