import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Button, ActivityIndicator, Portal, Modal, List } from 'react-native-paper';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TEXTS } from '../../../constants/theme';
import { articleService, categoryService } from '../../../services/ecommService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArticleFormScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const isEditing = !!params.id;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [categories, setCategories] = useState([]);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const cats = await categoryService.getAll();
            setCategories(cats);

            if (isEditing) {
                const data = await articleService.getById(params.id);
                setName(data.name);
                setDescription(data.description || '');
                setPrice(data.price.toString());
                setStock(data.stock.toString());
                setImageUrl(data.imageUrl || '');
                setCategoryId(data.categoryId);
            }
        } catch (error) {
            console.error(error);
            Alert.alert(TEXTS.admin.error, 'Failed to load data');
            router.back();
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim() || !price || !stock) {
            Alert.alert(TEXTS.admin.error, 'Name, Price and Stock are required');
            return;
        }

        try {
            setLoading(true);
            const articleData = {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl,
                categoryId: categoryId || null,
            };

            if (isEditing) {
                await articleService.update(params.id, articleData);
            } else {
                await articleService.create(articleData);
            }

            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert(TEXTS.admin.error, 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => c.id === categoryId);

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
                    {isEditing ? TEXTS.admin.editArticle : TEXTS.admin.createArticle}
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
                        numberOfLines={3}
                    />

                    <View style={styles.row}>
                        <TextInput
                            label={TEXTS.admin.price}
                            value={price}
                            onChangeText={setPrice}
                            mode="outlined"
                            style={[styles.input, styles.halfInput]}
                            outlineColor={COLORS.border}
                            activeOutlineColor={COLORS.primary}
                            keyboardType="numeric"
                            textColor={COLORS.text}
                        />
                        <TextInput
                            label={TEXTS.admin.stock}
                            value={stock}
                            onChangeText={setStock}
                            mode="outlined"
                            style={[styles.input, styles.halfInput]}
                            outlineColor={COLORS.border}
                            activeOutlineColor={COLORS.primary}
                            keyboardType="numeric"
                            textColor={COLORS.text}
                        />
                    </View>

                    <TextInput
                        label={TEXTS.admin.imageUrl}
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={COLORS.border}
                        activeOutlineColor={COLORS.primary}
                        textColor={COLORS.text}
                    />

                    <TouchableOpacity
                        style={styles.categorySelector}
                        onPress={() => setCategoryModalVisible(true)}
                    >
                        <Text style={styles.categorySelectorLabel}>{TEXTS.admin.category}</Text>
                        <View style={styles.categorySelectorInput}>
                            <Text style={selectedCategory ? styles.categoryText : styles.placeholderText}>
                                {selectedCategory ? selectedCategory.name : 'Select Category'}
                            </Text>
                            <MaterialCommunityIcons name="chevron-down" size={24} color={COLORS.textData} />
                        </View>
                    </TouchableOpacity>

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

            <Portal>
                <Modal
                    visible={categoryModalVisible}
                    onDismiss={() => setCategoryModalVisible(false)}
                    contentContainerStyle={styles.modalContent}
                >
                    <Text style={styles.modalTitle}>Select Category</Text>
                    <ScrollView style={styles.categoryList}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryItem,
                                    categoryId === category.id && styles.categoryItemActive
                                ]}
                                onPress={() => {
                                    setCategoryId(category.id);
                                    setCategoryModalVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.categoryItemText,
                                    categoryId === category.id && styles.categoryItemTextActive
                                ]}>
                                    {category.name}
                                </Text>
                                {categoryId === category.id && (
                                    <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button onPress={() => setCategoryModalVisible(false)} style={styles.modalCloseButton}>
                        Close
                    </Button>
                </Modal>
            </Portal>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    categorySelector: {
        marginBottom: SPACING.lg,
    },
    categorySelectorLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        marginBottom: SPACING.xs,
        marginLeft: 4,
    },
    categorySelectorInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    categoryText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text,
    },
    placeholderText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textLight,
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
    modalContent: {
        backgroundColor: 'white',
        padding: SPACING.lg,
        margin: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    categoryList: {
        marginBottom: SPACING.md,
    },
    categoryItem: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryItemActive: {
        backgroundColor: COLORS.primaryLight + '20', // 20% opacity
    },
    categoryItemText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text,
    },
    categoryItemTextActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    modalCloseButton: {
        marginTop: SPACING.sm,
    },
});
