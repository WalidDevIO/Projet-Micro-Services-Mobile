import { Slot } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <CartProvider>
            <Slot />
          </CartProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
