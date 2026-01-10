import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function AdminLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="categories/index" />
            <Stack.Screen name="categories/form" />
            <Stack.Screen name="articles/index" />
            <Stack.Screen name="articles/form" />
        </Stack>
    );
}
