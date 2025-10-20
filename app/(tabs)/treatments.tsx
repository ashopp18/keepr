// app/(tabs)/treatments.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing, Radii, shadow } from '@theme';
import GlassCard from '@lib/ui/GlassCard';
import TextField from '@lib/ui/TextField';
import SwitchRow from '@lib/ui/SwitchRow';
import VersionPill from '@lib/ui/VersionPill';
import { useT } from '@lib/LocaleProvider';
import { useTreatments, Treatment, doseToString } from '@lib/store/useTreatments';
import { Ionicons } from '@expo/vector-icons';

const PRESETS = [
  { key: '', label: '—' },
  { key: 'Finasteride', label: 'Finasteride' },
  { key: 'Topical Finasteride', label: 'Topical Finasteride' },
  { key: 'Dutasteride', label: 'Dutasteride' },
  { key: 'Minoxidil', label: 'Minoxidil' },
  { key: 'Oral Minoxidil', label: 'Oral Minoxidil' },
  { key: 'Dermaroller', label: 'Dermaroller' },
  { key: 'Saw palmetto', label: 'Saw palmetto' },
  { key: 'Low-level laser', label: 'Low-level laser' },
  { key: 'PRP', label: 'PRP' },
];

type DoseUnit = 'ml' | 'mg' | 'mcg' | 'drops' | 'pills';
const UNITS: Array<{ key: '' | DoseUnit; label: string }> = [
  { key: '', label: '—' },
  { key: 'ml', label: 'ml' },
  { key: 'mg', label: 'mg' },
  { key: 'mcg', label: 'mcg' },
  { key: 'drops', label: 'drops' },
  { key: 'pills', label: 'pills' },
];

const QTY_OPTIONS = ['0.25','0.50','0.75','1.00','5.00','10.00','50.00','100.00','200.00','400.00','800.00','1000.00'];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINS  = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function TreatmentsScreen() {
  const t = useT();
  const insets = useSafeAreaInsets();

  const addTreatment = useTreatments(s => s.addTreatment);
  const removeTreatment = useTreatments(s => s.removeTreatment);
  const treatments = useTreatments(s => s.treatments);

  // —— Form state
  const [presetOpen, setPresetOpen] = useState(false);
  const [hourOpen, setHourOpen] = useState(false);
  const [minOpen, setMinOpen] = useState(false);
  const [qtyOpen, setQtyOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const effectiveName = selectedPreset || customName;

  const [hour, setHour] = useState('08');
  const [min, setMin] = useState('00');

  const [qty, setQty] = useState('1.00');
  const [unit, setUnit] = useState<'' | DoseUnit>('');

  const [reminder, setReminder] = useState(false);

  const canAdd = useMemo(() => {
    const nameOk = effectiveName.trim().length > 0;
    const hOk = /^\d{2}$/.test(hour) && +hour >= 0 && +hour < 24;
    const mOk = /^\d{2}$/.test(min) && +min >= 0 && +min < 60;
    return nameOk && hOk && mOk;
  }, [effectiveName, hour, min]);

  const onAdd = () => {
    if (!canAdd) return;

    const payload: Omit<Treatment, 'id'> = {
      name: effectiveName.trim(),
      time: `${hour}:${min}`,
      dose: unit ? { amount: Number(qty), unit } : undefined,
      frequency: 'daily',
      reminder,
    };

    addTreatment(payload);

    // Reset mínimos
    setSelectedPreset('');
    setCustomName('');
    setHour('08');
    setMin('00');
    setQty('1.00');
    setUnit('');
    setReminder(false);
  };

  // Exclusividad visual: si escribes manual, no eliges de lista; si eliges de lista, no escribes manual.
  const presetDisabled = customName.trim().length > 0;
  const customDisabled = selectedPreset.trim().length > 0;

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
        {/* Título y subtítulo, con aire */}
        <Text style={styles.title}>{t('treatments.title', 'Treatments')}</Text>
        <Text style={styles.subtitle}>
          {t('treatments.subtitle', 'Configure your treatments, dosage and reminders.')}
        </Text>

        {/* BLOQUE: Elegir nombre */}
        <GlassCard style={[styles.cardBlock]}>
          <SectionHeader label={t('treatments.pickFromList', 'Choose from list')} />

          <FieldLabel text={t('treatments.name', 'Name')} />
          <TouchableOpacity
            onPress={() => !presetDisabled && setPresetOpen(true)}
            activeOpacity={presetDisabled ? 1 : 0.8}
            style={{ opacity: presetDisabled ? 0.5 : 1 }}
          >
            <GlassPill>
              <Text style={styles.inputText}>
                {selectedPreset || t('treatments.placeholderName', 'Name')}
              </Text>
            </GlassPill>
          </TouchableOpacity>

          <Divider />

          <SectionHeader label={t('treatments.orWriteYours', 'or write your own')} />
          <FieldLabel text={t('treatments.name', 'Name')} />
          <View style={{ opacity: customDisabled ? 0.5 : 1 }}>
            <TextField
              placeholder={t('treatments.writeName', 'Type a name')}
              value={customName}
              onChange={(v) => !customDisabled && setCustomName(v)}
            />
          </View>
        </GlassCard>

        {/* BLOQUE: Hora */}
        <GlassCard style={styles.cardBlock}>
          <SectionHeader label={t('treatments.time', 'Time')} />
          <FieldLabel text={t('treatments.hhmm', 'Hour (HH)   Min (mm)')} />

          <View style={{ flexDirection: 'row', gap: spacing(1.5) }}>
            <TouchableOpacity onPress={() => setHourOpen(true)} activeOpacity={0.8} style={{ flex: 1 }}>
              <GlassPill>
                <Text style={styles.inputText}>{hour}</Text>
              </GlassPill>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMinOpen(true)} activeOpacity={0.8} style={{ flex: 1 }}>
              <GlassPill>
                <Text style={styles.inputText}>{min}</Text>
              </GlassPill>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* BLOQUE: Dosis */}
        <GlassCard style={styles.cardBlock}>
          <SectionHeader label={t('treatments.dose', 'Dose')} />

          <FieldLabel text={t('treatments.amount', 'Amount')} />
          <TouchableOpacity onPress={() => setQtyOpen(true)} activeOpacity={0.8} style={{ alignSelf: 'flex-start' }}>
            <GlassPill minWidth={120}>
              <Text style={styles.inputText}>{qty}</Text>
            </GlassPill>
          </TouchableOpacity>

          <FieldLabel text={t('treatments.unit', 'Unit')} extraTop />
          <TouchableOpacity onPress={() => setUnitOpen(true)} activeOpacity={0.8} style={{ alignSelf: 'flex-start' }}>
            <GlassPill minWidth={120}>
              <Text style={styles.inputText}>{unit || '—'}</Text>
            </GlassPill>
          </TouchableOpacity>
        </GlassCard>

        {/* BLOQUE: Recordatorio */}
        <GlassCard style={styles.cardBlock}>
          <SectionHeader label={t('treatments.reminder', 'Reminder')} />
          <View style={{ marginTop: spacing(0.5) }}>
            <SwitchRow
              label={t('treatments.reminder', 'Reminder')}
              value={reminder}
              onValueChange={setReminder}
            />
          </View>
        </GlassCard>

        {/* CTA + Nota (aire y simetría) */}
        <TouchableOpacity
          disabled={!canAdd}
          onPress={onAdd}
          activeOpacity={0.9}
          style={[styles.primaryBtn, !canAdd && { opacity: 0.5 }]}
        >
          <Text style={styles.primaryBtnText}>{t('treatments.add', 'Add')}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          {t('treatments.hint', 'Choose a name (from the list or write yours) and a time.')}
        </Text>

        {/* Lista actual */}
        <Text style={[styles.listTitle]}>
          {t('treatments.current', 'Your treatments')}
        </Text>

        <View style={{ gap: spacing(1.25) }}>
          {treatments.map(tr => (
            <GlassCard
              key={tr.id}
              style={styles.trCard}
              contentContainerStyle={styles.trInner}
            >
              <View style={styles.trTextCol}>
                <Text style={styles.trName} numberOfLines={1}>
                  {tr.name}
                </Text>
                <Text style={styles.trMeta}>
                  {tr.time}
                  {tr.dose ? `  •  ${doseToString(tr.dose)}` : ''}
                  {tr.reminder ? `  •  ${t('treatments.reminder', 'Reminder')}` : ''}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => removeTreatment(tr.id)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Ionicons name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>

        {/* Footer versión uniforme */}
        <View style={{ alignItems: 'center', marginTop: spacing(6) }}>
          <VersionPill text="Keepr • v0.1" />
        </View>
      </ScrollView>

      {/* Sheets */}
      <BottomSheet visible={presetOpen} title={t('treatments.pickFromList', 'Choose from list')} onClose={() => setPresetOpen(false)}>
        {PRESETS.map(opt => (
          <SheetRow
            key={opt.key + opt.label}
            label={opt.label}
            onPress={() => {
              setSelectedPreset(opt.key);
              if (opt.key) setCustomName('');
              setPresetOpen(false);
            }}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={hourOpen} title={t('treatments.hour', 'Hour')} onClose={() => setHourOpen(false)}>
        {HOURS.map(h => (
          <SheetRow key={h} label={h} onPress={() => { setHour(h); setHourOpen(false); }} />
        ))}
      </BottomSheet>

      <BottomSheet visible={minOpen} title={t('treatments.minute', 'Minute')} onClose={() => setMinOpen(false)}>
        {MINS.map(m => (
          <SheetRow key={m} label={m} onPress={() => { setMin(m); setMinOpen(false); }} />
        ))}
      </BottomSheet>

      <BottomSheet visible={qtyOpen} title={t('treatments.amount', 'Amount')} onClose={() => setQtyOpen(false)}>
        {QTY_OPTIONS.map(v => (
          <SheetRow key={v} label={v} onPress={() => { setQty(v); setQtyOpen(false); }} />
        ))}
      </BottomSheet>

      <BottomSheet visible={unitOpen} title={t('treatments.unit', 'Unit')} onClose={() => setUnitOpen(false)}>
        {UNITS.map(u => (
          <SheetRow key={u.key + u.label} label={u.label} onPress={() => { setUnit(u.key); setUnitOpen(false); }} />
        ))}
      </BottomSheet>
    </SafeAreaView>
  );
}

/* ---------- UI helpers locales ---------- */

function SectionHeader({ label }: { label: string }) {
  return <Text style={styles.sectionHeader}>{label}</Text>;
}

function FieldLabel({ text, extraTop }: { text: string; extraTop?: boolean }) {
  return (
    <Text style={[styles.fieldLabel, extraTop && { marginTop: spacing(1.25) }]}>
      {text}
    </Text>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function GlassPill({ children, minWidth }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <View style={[styles.pill, minWidth ? { minWidth } : null]}>
      {children}
    </View>
  );
}

function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{title}</Text>
        <View style={{ marginTop: spacing(1) }}>{children}</View>
      </View>
    </Modal>
  );
}

function SheetRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.sheetRow}>
      <Text style={styles.sheetRowText}>{label}</Text>
    </Pressable>
  );
}

/* ---------- estilos ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  // cabecera
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginTop: spacing(2) },
  subtitle: { color: Colors.muted, marginTop: spacing(1), marginBottom: spacing(1), fontSize: 15 },

  // bloques
  cardBlock: { padding: spacing(2), gap: spacing(1.25) },

  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing(0.5),
  },

  fieldLabel: {
    color: Colors.muted,
    marginTop: spacing(0.5),
    marginBottom: spacing(0.75),
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.6,
    marginVertical: spacing(1),
  },

  pill: {
    borderRadius: Radii.xl,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...shadow(4),
  },
  inputText: { color: Colors.muted, fontSize: 15, fontWeight: '600' },

  primaryBtn: {
    marginTop: spacing(2),
    backgroundColor: Colors.accent,
    paddingVertical: spacing(1.75),
    borderRadius: Radii.lg,
    alignItems: 'center',
    ...shadow(8),
  },
  primaryBtnText: { color: Colors.textOnAccent, fontWeight: '800', fontSize: 15 },

  hint: { color: Colors.muted, marginTop: spacing(1.25) },

  // lista
  listTitle: {
    marginTop: spacing(3),
    marginBottom: spacing(1),
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },

  trCard: { padding: spacing(1.25) },
  trInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  trTextCol: { flex: 1, minWidth: 0 },
  trName: { color: Colors.text, fontWeight: '700', fontSize: 15 },
  trMeta: { color: Colors.muted, marginTop: 2, fontSize: 14 },

  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e36b6b',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  // sheets
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing(2),
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  sheetRow: { paddingVertical: spacing(1.25), paddingHorizontal: spacing(1), borderRadius: 12 },
  sheetRowText: { fontSize: 16, color: Colors.text },
});
