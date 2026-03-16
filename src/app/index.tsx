import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Card, FAB, Searchbar, Text } from 'react-native-paper';

import { PokemonDetailModal } from '@/components/PokemonDetailModal';
import { usePokemon } from '@/context/PokemonContext';
import { PokemonDetail } from '@/types/pokemon';

const PokemonListItem = React.memo(
  ({ item, onPress }: { item: PokemonDetail; onPress: () => void }) => {
    const spriteUrl = item.sprites.front_default;

    return (
      <Card style={styles.card} onPress={onPress}>
        <Card.Content style={styles.cardContent}>
          <Image source={{ uri: spriteUrl }} style={styles.sprite} contentFit="contain" />
          <Text variant="titleMedium" style={styles.name}>
            {item.name}
          </Text>
        </Card.Content>
      </Card>
    );
  }
);

export default function HomeScreen() {
  const { pokemonList, loading, error, loadingMore, loadMorePokemon, refreshPokemon } =
    usePokemon();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonDetail[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchQuery, pokemonList]);

  const numOfColumns = useMemo(() => {
    if (width < 375) {
      return 1;
    } else if (width < 600) {
      return 2;
    } else if (width < 900) {
      return 3;
    }
    return 4;
  }, [width]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="headlineSmall">Error</Text>
        <Text variant="bodyMedium">{error}</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!loadingMore) return null;

    return <ActivityIndicator animating={true} size="large" style={styles.footerSpinner} />;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Pokédex' }} />
      <Searchbar
        placeholder="Search Pokémon"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredPokemon}
        renderItem={({ item }) => (
          <PokemonListItem item={item} onPress={() => setSelectedPokemon(item)} />
        )}
        key={numOfColumns}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numOfColumns}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onEndReached={searchQuery === '' ? loadMorePokemon : null} // Only load more if not searching
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <PokemonDetailModal
        pokemon={selectedPokemon}
        visible={!!selectedPokemon}
        onDismiss={() => setSelectedPokemon(null)}
      />
      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={refreshPokemon}
        loading={loading && pokemonList.length > 0}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 8 },
  searchbar: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  card: {
    flex: 1,
    margin: 4,
  },
  cardContent: {
    alignItems: 'center',
    padding: 8,
  },
  sprite: {
    width: 100,
    height: 100,
  },
  name: {
    marginTop: 8,
    textTransform: 'capitalize',
  },
  footerSpinner: {
    marginVertical: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
