// app/(tabs)/settings.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, spacing, Radii } from '@theme';
import GlassCard from '@lib/ui/GlassCard';
import VersionPill from '@lib/ui/VersionPill';
import { useLocale, useT } from '@lib/LocaleProvider';
import { supabase } from '@lib/auth/supabaseClient';     // 👈 ruta que ya confirmaste
import { setAuthUser } from '@lib/store/linkAuth';        // 👈 ruta correcta

function Row({
  label,
  right,
  onPress,
  danger,
}: {
  label: string;
  right?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard style={[styles.row, danger && { borderColor: '#e36b6b', borderWidth: 1 }]}>
        <Text style={[styles.rowText, danger && { color: '#e36b6b' }]}>{label}</Text>
        {right ? <Text style={styles.right}>{right}</Text> : null}
      </GlassCard>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { locale, setLocale } = useLocale();
  const t = useT();

  const logout = async () => {
    await supabase.auth.signOut();
    await setAuthUser(null);
    Alert.alert(t('settings.loggedOut', 'Sesión cerrada'));
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing(2),
          paddingBottom: insets.bottom + spacing(14),
          gap: spacing(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('settings.title', 'Ajustes')}</Text>

        {/* Cuenta */}
        <Text style={styles.sectionTitle}>{t('settings.account', 'Cuenta')}</Text>
        <Row label={t('settings.user', 'Usuario')} right={t('settings.userEmail', 'Sesión iniciada')} />
        <Row label={t('settings.subscription', 'Suscripción')} right={t('settings.manage', 'Gestionar')} onPress={() => Alert.alert('Soon')} />
        <Row label={t('settings.logout', 'Cerrar sesión')} onPress={logout} />

        {/* Preferencias */}
        <Text style={styles.sectionTitle}>{t('settings.preferences', 'Preferencias')}</Text>
        <Row
          label={t('settings.language', 'Idioma')}
          right={locale === 'es' ? 'Español' : 'English'}
          onPress={() => setLocale(locale === 'es' ? 'en' : 'es')}
        />
        <Row label={t('settings.notifications', 'Notificaciones')} right={t('common.manage', 'Gestionar')} onPress={() => Alert.alert('Soon')} />

        {/* Datos & privacidad */}
        <Text style={styles.sectionTitle}>{t('settings.data', 'Datos y privacidad')}</Text>
        <Row label={t('settings.export', 'Exportar datos')} onPress={() => Alert.alert(t('common.soon', 'Próximamente'))} />
        <Row
          danger
          label={t('settings.deleteAll', 'Borrar todos los datos')}
          onPress={() => Alert.alert(t('settings.confirmDelete', '¿Seguro?'), t('settings.cannotUndo', 'No se puede deshacer.'), [
            { text: t('common.cancel', 'Cancelar') },
            { text: t('common.delete', 'Eliminar'), style: 'destructive', onPress: () => Linking.openURL('app-settings:') },
          ])}
        />

        {/* Acerca de */}
        <Text style={styles.sectionTitle}>{t('settings.about', 'Acerca de')}</Text>
        <Row label={t('settings.rate', 'Valorar la app')} onPress={() => Alert.alert('Store')} />
        <Row label={t('settings.contact', 'Contactar por email')} onPress={() => Linking.openURL('mailto:hello@example.com')} />

        <View style={{ alignItems: 'center', marginTop: spacing(4) }}>
          <VersionPill text="Keepr • v0.1" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, marginTop: spacing(2) },

  sectionTitle: {
    marginTop: spacing(2),
    fontSize: 14,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  right: { color: Colors.muted, fontWeight: '600' },
});
