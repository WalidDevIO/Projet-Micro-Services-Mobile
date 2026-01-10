import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TEXTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminDashboard() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const menuItems = [
        {
            title: TEXTS.admin.manageCategories,
            icon: 'shape',
            route: '/admin/categories',
            color: ['#4F46E5', '#7C3AED'],
        },
        {
            title: TEXTS.admin.manageArticles,
            icon: 'basket',
            route: '/admin/articles',
            color: ['#059669', '#10B981'],
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={COLORS.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.header, { paddingTop: insets.top + SPACING.lg }]}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textOnPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{TEXTS.admin.dashboard}</Text>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            onPress={() => router.push(item.route)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={item.color}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.cardGradient}
                            >
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name={item.icon} size={32} color="#FFF" />
                                </View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <MaterialCommunityIcons
                                    name="arrow-right-circle"
                                    size={24}
                                    color="rgba(255,255,255,0.8)"
                                    style={styles.arrowIcon}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    backButton: {
        marginRight: SPACING.md,
        padding: SPACING.xs,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textOnPrimary,
    },
    content: {
        padding: SPACING.lg,
    },
    grid: {
        gap: SPACING.lg,
    },
    card: {
        height: 120,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
        overflow: 'hidden',
    },
    cardGradient: {
        flex: 1,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    cardTitle: {
        flex: 1,
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: '#FFF',
    },
    arrowIcon: {
        marginLeft: SPACING.sm,
    },
});
