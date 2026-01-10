import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, FAB } from 'react-native-paper';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TEXTS } from '../../../constants/theme';
import { categoryService } from '../../../services/ecommService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CategoryListScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error(error);
            Alert.alert(TEXTS.admin.error, 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            TEXTS.admin.confirmDeleteTitle,
            TEXTS.admin.confirmDeleteMessage,
            [
                { text: TEXTS.admin.cancel, style: 'cancel' },
                {
                    text: TEXTS.admin.delete,
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await categoryService.delete(id);
                            loadCategories();
                        } catch (error) {
                            console.error(error);
                            Alert.alert(TEXTS.admin.error, 'Failed to delete category');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => router.push({ pathname: '/admin/categories/form', params: { id: item.id } })}
                >
                    <MaterialCommunityIcons name="pencil" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                >
                    <MaterialCommunityIcons name="delete" size={20} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

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
                <Text style={styles.headerTitle}>{TEXTS.admin.manageCategories}</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No categories found</Text>
                    }
                />
            )}

            <FAB
                style={[styles.fab, { bottom: insets.bottom + SPACING.lg }]}
                icon="plus"
                color="white"
                onPress={() => router.push('/admin/categories/form')}
            />
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...SHADOWS.sm,
    },
    cardContent: {
        flex: 1,
        marginRight: SPACING.md,
    },
    cardTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    cardDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
    },
    cardActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.background,
    },
    editButton: {
        backgroundColor: COLORS.secondaryLight,
    },
    deleteButton: {
        backgroundColor: COLORS.errorLight,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: SPACING.xl,
        color: COLORS.textLight,
        fontSize: FONT_SIZES.md,
    },
    fab: {
        position: 'absolute',
        margin: SPACING.lg,
        right: 0,
        backgroundColor: COLORS.primary,
    },
});
