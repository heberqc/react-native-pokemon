import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { getPokemonListWithDetails } from '@/services/pokemonService';
import { PokemonDetail } from '@/types/pokemon';

interface PokemonContextType {
  pokemonList: PokemonDetail[];
  loading: boolean;
  error: string | null;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

interface PokemonProviderProps {
  children: ReactNode;
}

const POKEMON_CACHE_KEY = '@pokemon_list_cache';

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      let hasCachedData = false;
      try {
        const cachedData = await AsyncStorage.getItem(POKEMON_CACHE_KEY);
        if (cachedData) {
          setPokemonList(JSON.parse(cachedData));
          hasCachedData = true;
          setLoading(false); // Display cached UI immediately
        } else {
          setLoading(true); // Only show loading spinner if no cache exists
        }

        const data = await getPokemonListWithDetails();
        setPokemonList(data);
        await AsyncStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(data));
        setError(null);
      } catch (err) {
        if (!hasCachedData) {
          setError('Failed to fetch Pokémon data.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, []); // Empty dependency array ensures this runs only once on mount

  const value = { pokemonList, loading, error };

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};
