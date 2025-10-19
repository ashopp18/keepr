// app/auth/signin.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, spacing, Radii } from '@theme';
import GlassCard from '@lib/ui/GlassCard';
import { useAuth } from '@lib/auth/AuthProvider';
import { useT } from '@lib/LocaleProvider';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const t = useT();
  const router = useRouter();
  const { userId, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, no te quedes aquí.
  useEffect(() => {
    if (userId) {
      router.replace('/(tabs)/home');
    }
  }, [userId, router]);

  const onSubmit = async () => {
    if (loading) return;
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        const e = await signIn(email.trim(), pw);
        if (e) {
          setErr(e.message || 'Error');
        } else {
          // Sesión creada -> navegamos a Home
          router.replace('/(tabs)/home');
        }
      } else {
        const e = await signUp(email.trim(), pw);
        if (e) setErr(e.message || 'Error');
        else setOk('Revisa tu email para confirmar la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: spacing(2), justifyContent: 'center', gap: spacing(2) }}>
            <Text style={styles.title}>{mode === 'signin' ? 'Iniciar sesión' : 'Crear cuenta'}</Text>

            <GlassCard>
              <View style={{ gap: spacing(1) }}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  style={styles.input}
                  placeholderTextColor={Colors.muted}
                />
                <TextInput
                  value={pw}
                  onChangeText={setPw}
                  placeholder="Password"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  style={styles.input}
                  placeholderTextColor={Colors.muted}
                />
              </View>
            </GlassCard>

            {err ? <Text style={{ color: '#c94b4b' }}>{err}</Text> : null}
            {ok ? <Text style={{ color: Colors.muted }}>{ok}</Text> : null}

            <TouchableOpacity
              onPress={onSubmit}
              activeOpacity={0.9}
              style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              <Text style={styles.primaryTxt}>
                {loading ? '...' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
              <Text style={{ color: Colors.accent, textAlign: 'center', marginTop: spacing(1) }}>
                {mode === 'signin' ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: spacing(1) },
  input: { color: Colors.text, fontSize: 16, paddingVertical: spacing(1) },
  primaryBtn: { backgroundColor: Colors.accent, paddingVertical: spacing(1.75), borderRadius: Radii.lg, alignItems: 'center' },
  primaryTxt: { color: Colors.textOnAccent, fontWeight: '800', fontSize: 16 },
});
