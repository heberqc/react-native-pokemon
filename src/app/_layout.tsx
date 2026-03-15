import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PokemonProvider } from '@/context/PokemonContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <PokemonProvider>
          <Stack />
        </PokemonProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
