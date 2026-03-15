import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

import { usePokemon } from '@/context/PokemonContext';
import { PokemonDetail } from '@/types/pokemon';

const PokemonListItem = ({ item }: { item: PokemonDetail }) => {
  const spriteUrl = item.sprites.other['official-artwork'].front_default;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image source={{ uri: spriteUrl }} style={styles.sprite} contentFit="contain" />
        <Text variant="titleMedium" style={styles.name}>
          {item.name}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default function HomeScreen() {
  const { pokemonList, loading, error } = usePokemon();

  if (loading && pokemonList.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="headlineSmall">Error</Text>
        <Text variant="bodyMedium">{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Pokédex' }} />
      <FlatList
        data={pokemonList}
        renderItem={({ item }) => <PokemonListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 8 },
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
});
