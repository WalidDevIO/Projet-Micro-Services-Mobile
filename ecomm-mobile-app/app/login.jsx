import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { COLORS, TEXTS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const { signin } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!username || !password) {
      setError(TEXTS.errors.fillAllFields);
      return;
    }

    setLoading(true);
    setError('');
    const result = await signin(username, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)/articles');
    } else {
      setError(result.message || TEXTS.errors.loginFailed);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={COLORS.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Back button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textOnPrimary} />
            </TouchableOpacity>

            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons name="shopping" size={48} color={COLORS.primary} />
              </View>
              <Text style={styles.appName}>{TEXTS.auth.appName}</Text>
              <Text style={styles.tagline}>{TEXTS.auth.tagline}</Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{TEXTS.auth.login}</Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={COLORS.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TextInput
                label={TEXTS.auth.username}
                value={username}
                onChangeText={(text) => { setUsername(text); setError(''); }}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                disabled={loading}
                left={<TextInput.Icon icon="account" />}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                outlineStyle={styles.inputOutline}
              />

              <TextInput
                label={TEXTS.auth.password}
                value={password}
                onChangeText={(text) => { setPassword(text); setError(''); }}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? "eye-off" : "eye"}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                outlineStyle={styles.inputOutline}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? [COLORS.textLight, COLORS.textLight] : COLORS.gradientPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.textOnPrimary} />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>{TEXTS.auth.signIn}</Text>
                      <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.textOnPrimary} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 20,
    paddingBottom: SPACING.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  appName: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  input: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  inputOutline: {
    borderRadius: BORDER_RADIUS.md,
  },
  loginButton: {
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  loginButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
});
