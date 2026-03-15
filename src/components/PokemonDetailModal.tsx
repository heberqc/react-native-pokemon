import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Modal, Portal, Text } from 'react-native-paper';

import { PokemonDetail } from '@/types/pokemon';

interface PokemonDetailModalProps {
  pokemon: PokemonDetail | null;
  visible: boolean;
  onDismiss: () => void;
}

export const PokemonDetailModal = ({ pokemon, visible, onDismiss }: PokemonDetailModalProps) => {
  if (!pokemon) {
    return null;
  }

  return (
    <Portal>
      <Modal contentContainerStyle={styles.modalContainer} visible={visible} onDismiss={onDismiss}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
            style={styles.modalImage}
            contentFit="contain"
          />
          <Text variant="headlineMedium" style={styles.name}>
            {pokemon.name}
          </Text>
          <View style={styles.typesContainer}>
            {pokemon.types.map((typeInfo) => (
              <Chip key={typeInfo.type.name}>
                <Text style={styles.typeChip}>{typeInfo.type.name}</Text>
              </Chip>
            ))}
          </View>
          <View style={styles.statsContainer}>
            <Text variant="titleMedium">Height: {pokemon.height / 10} m</Text>
            <Text variant="titleMedium">Weight: {pokemon.weight / 10} kg</Text>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default PokemonDetailModal;

const styles = StyleSheet.create({
  name: {
    marginTop: 8,
    textTransform: 'capitalize',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 16,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  typeChip: {
    textTransform: 'capitalize',
  },
});
