// app/(tabs)/settings.tsx
import React, { useState } from 'react';
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
import VersionPill from '@lib/ui/VersionPill';
import { useLocale, useT } from '@lib/LocaleProvider';
import { useAuth } from '@lib/auth/AuthProvider';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const { locale, setLocale } = useLocale();
  const { signOut } = useAuth();
  const router = useRouter();

  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      // En tu repo esta es la ruta correcta
      router.replace('/auth/signin');
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
        {/* Título + subtítulo (igual patrón que Progress) */}
        <Text style={styles.title}>{t('settings.title', 'Settings')}</Text>
        <Text style={styles.subtitle}>
          {t('settings.subtitle', 'Manage your account, language and subscription.')}
        </Text>

        {/* Cuenta */}
        <SectionTitle>{t('settings.account', 'Account')}</SectionTitle>
        <GlassCard style={{ padding: spacing(2), gap: spacing(1) }}>
          <Row
            label={t('settings.manageSubscription', 'Manage subscription')}
            hint={t('settings.manageSubscriptionHint', 'Plans, billing & receipts')}
            right={<Chevron />}
            onPress={() => {
              // TODO: Abrir pantalla/submodal de suscripción (RevenueCat)
            }}
          />
          <Separator />
          <Row
            label={t('settings.signOut', 'Sign out')}
            destructive
            right={<Ionicons name="log-out-outline" size={18} color="#fff" />}
            onPress={handleLogout}
          />
        </GlassCard>

        {/* Preferencias */}
        <SectionTitle>{t('settings.preferences', 'Preferences')}</SectionTitle>
        <GlassCard style={{ padding: spacing(2), gap: spacing(1) }}>
          <Row
            label={t('settings.language', 'Language')}
            hint={locale === 'es' ? t('settings.spanish', 'Español') : t('settings.english', 'English')}
            right={<Chevron />}
            onPress={() => setLangOpen(true)}
          />
          <Separator />
          <Row
            label={t('settings.notifications', 'Notifications')}
            hint={t('settings.notificationsHint', 'Reminders & alerts')}
            right={<Chevron />}
            onPress={() => {
              // TODO: Pantalla de notificaciones (permiso + configuración)
            }}
          />
          <Separator />
          <Row
            label={t('settings.privacy', 'Privacy')}
            hint={t('settings.privacyHint', 'Data & backups')}
            right={<Chevron />}
            onPress={() => {
              // TODO: Pantalla de privacidad/exportar datos
            }}
          />
        </GlassCard>

        {/* Acerca de */}
        <SectionTitle>{t('settings.about', 'About')}</SectionTitle>
        <GlassCard style={{ padding: spacing(2) }}>
          <Text style={styles.muted}>
            {t(
              'settings.aboutText',
              'Keepr helps you build a simple, consistent hair routine.'
            )}
          </Text>
        </GlassCard>

        {/* Footer versión: mismo patrón que Progress */}
        <View style={{ alignItems: 'center', marginTop: spacing(6) }}>
          <VersionPill text="Keepr • v0.1" />
        </View>
      </ScrollView>

      {/* Bottom sheet: selector de idioma */}
      <LangSheet
        visible={langOpen}
        current={locale}
        onPick={(lng) => {
          setLocale(lng);
          setLangOpen(false);
        }}
        onClose={() => setLangOpen(false)}
      />
    </SafeAreaView>
  );
}

/* ---------- UI helpers ---------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Chevron() {
  return <Ionicons name="chevron-forward" size={18} color={Colors.muted} />;
}

function Row({
  label,
  hint,
  right,
  onPress,
  destructive,
}: {
  label: string;
  hint?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
        {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>
      {!!right && <View style={styles.rowRight}>{right}</View>}
    </TouchableOpacity>
  );
}

function Separator() {
  return <View style={styles.sep} />;
}

function LangSheet({
  visible,
  current,
  onPick,
  onClose,
}: {
  visible: boolean;
  current: 'es' | 'en';
  onPick: (l: 'es' | 'en') => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Language</Text>
        <SheetRow
          label="English"
          active={current === 'en'}
          onPress={() => onPick('en')}
        />
        <SheetRow
          label="Español"
          active={current === 'es'}
          onPress={() => onPick('es')}
        />
      </View>
    </Modal>
  );
}

function SheetRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.sheetRow, active && styles.sheetRowActive]}>
      <Text style={[styles.sheetRowText, active && styles.sheetRowTextActive]}>{label}</Text>
      {active ? <Ionicons name="checkmark" size={18} color={Colors.accent} /> : null}
    </Pressable>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  // Igual que Progress: título y subtítulo suaves
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, marginTop: spacing(2) },
  subtitle: { color: Colors.muted, marginTop: spacing(1), fontSize: 16 },

  sectionTitle: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing(1.25) },
  rowLabel: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  rowLabelDestructive: { color: '#e36b6b' },
  rowHint: { color: Colors.muted, marginTop: 2, fontSize: 13 },
  rowRight: { marginLeft: spacing(1.5) },

  muted: { color: Colors.muted },

  sep: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.6,
    marginVertical: spacing(0.75),
  },

  // Sheet
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
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: spacing(1) },
  sheetRow: {
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetRowActive: { backgroundColor: 'rgba(0,0,0,0.04)' },
  sheetRowText: { fontSize: 16, color: Colors.text },
  sheetRowTextActive: { color: Colors.accent, fontWeight: '700' },
});
