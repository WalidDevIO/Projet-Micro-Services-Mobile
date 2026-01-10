import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TEXTS } from '../../../constants/theme';
import { categoryService } from '../../../services/ecommService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CategoryFormScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const isEditing = !!params.id;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            loadCategory(params.id);
        }
    }, [params.id]);

    const loadCategory = async (id) => {
        try {
            const data = await categoryService.getById(id);
            setName(data.name);
            setDescription(data.description || '');
        } catch (error) {
            console.error(error);
            Alert.alert(TEXTS.admin.error, 'Failed to load category details');
            router.back();
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert(TEXTS.admin.error, 'Name is required');
            return;
        }

        try {
            setLoading(true);
            const categoryData = { name, description };

            if (isEditing) {
                await categoryService.update(params.id, categoryData);
            } else {
                await categoryService.create(categoryData);
            }

            router.back();
            // Optionally trigger reload on previous screen if needed, 
            // but usually navigating back triggers re-mount or focus effect if handled correctly.
            // Easiest is to rely on useEffect in list screen or global state management.
            // Here list screen uses useEffect([], []) so it might not refresh automatically on back.
            // A better approach for list refresh is using useFocusEffect or passing a callback.
            // For now, let's assume simple navigation back.

        } catch (error) {
            console.error(error);
            Alert.alert(TEXTS.admin.error, 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
        );
    }

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
                <Text style={styles.headerTitle}>
                    {isEditing ? TEXTS.admin.editCategory : TEXTS.admin.createCategory}
                </Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formCard}>
                    <TextInput
                        label={TEXTS.admin.name}
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={COLORS.border}
                        activeOutlineColor={COLORS.primary}
                        textColor={COLORS.text}
                    />

                    <TextInput
                        label={TEXTS.admin.description}
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={COLORS.border}
                        activeOutlineColor={COLORS.primary}
                        textColor={COLORS.text}
                        multiline
                        numberOfLines={4}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={loading}
                        disabled={loading}
                        style={styles.saveButton}
                        contentStyle={styles.saveButtonContent}
                        labelStyle={styles.saveButtonLabel}
                    >
                        {TEXTS.admin.save}
                    </Button>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    formCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.sm,
    },
    input: {
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.surface,
    },
    saveButton: {
        marginTop: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primary,
    },
    saveButtonContent: {
        paddingVertical: SPACING.sm,
    },
    saveButtonLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
    },
});
