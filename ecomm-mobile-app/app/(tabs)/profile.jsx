import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { COLORS, TEXTS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      TEXTS.auth.logout,
      TEXTS.profile.confirmLogout,
      [
        { text: TEXTS.cart.cancel, style: 'cancel' },
        {
          text: TEXTS.auth.logout, style: 'destructive', onPress: async () => {
            await logout();
            router.replace('/(tabs)/articles');
          }
        },
      ]
    );
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  const SettingItem = ({ icon, title, subtitle, onPress, danger = false }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={danger ? COLORS.error : COLORS.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.settingTitleDanger]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient
        colors={COLORS.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          {user?.isAdmin && (
            <View style={styles.adminBadge}>
              <MaterialCommunityIcons name="shield-crown" size={12} color={COLORS.textOnPrimary} />
              <Text style={styles.adminBadgeText}>{TEXTS.profile.admin}</Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.fullName || user?.username}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </LinearGradient>

      {/* Account Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{TEXTS.profile.accountInfo}</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={18} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>{TEXTS.profile.username}</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={18} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>{TEXTS.profile.email}</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-details" size={18} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>{TEXTS.profile.firstName}</Text>
            <Text style={styles.infoValue}>{user?.firstName || TEXTS.profile.notSet}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-details" size={18} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>{TEXTS.profile.lastName}</Text>
            <Text style={styles.infoValue}>{user?.lastName || TEXTS.profile.notSet}</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{TEXTS.profile.settings}</Text>
        <View style={styles.card}>
          <SettingItem
            icon="bell-outline"
            title={TEXTS.profile.notifications}
            subtitle={TEXTS.profile.notificationsDesc}
            onPress={() => Alert.alert(TEXTS.common.comingSoon, TEXTS.common.featureNotAvailable)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="shield-lock-outline"
            title={TEXTS.profile.privacy}
            subtitle={TEXTS.profile.privacyDesc}
            onPress={() => Alert.alert(TEXTS.common.comingSoon, TEXTS.common.featureNotAvailable)}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="help-circle-outline"
            title={TEXTS.profile.help}
            subtitle={TEXTS.profile.helpDesc}
            onPress={() => Alert.alert(TEXTS.common.comingSoon, TEXTS.common.featureNotAvailable)}
          />
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={COLORS.gradientDanger}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButtonGradient}
          >
            <MaterialCommunityIcons name="logout" size={20} color={COLORS.textOnPrimary} />
            <Text style={styles.logoutButtonText}>{TEXTS.auth.logout}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>{TEXTS.profile.version} 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    gap: 4,
  },
  adminBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  infoLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: SPACING.xxl + SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingTitleDanger: {
    color: COLORS.error,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  logoutButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  version: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
});
