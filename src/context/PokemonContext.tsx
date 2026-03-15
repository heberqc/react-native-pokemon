import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { getPokemonPage } from '@/services/pokemonService';
import { PokemonDetail } from '@/types/pokemon';

interface PokemonContextType {
  pokemonList: PokemonDetail[];
  loading: boolean;
  error: string | null;
  loadingMore: boolean;
  loadMorePokemon: () => void;
  refreshPokemon: () => Promise<void>;
}

const DEFAULT_FIRST_PAGE = 'pokemon?limit=20';
const POKEMON_CACHE_KEY = '@pokemon_list_cache';

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

interface PokemonProviderProps {
  children: ReactNode;
}

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>(DEFAULT_FIRST_PAGE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      let hasCachedData = false;
      try {
        const cachedData = await AsyncStorage.getItem(POKEMON_CACHE_KEY);
        if (cachedData) {
          setPokemonList(JSON.parse(cachedData));
          hasCachedData = true;
          setLoading(false); // Display cached
        } else {
          setLoading(true); // Show loading spinner if no cache exists
        }

        const { details, nextUrl: newNextUrl } = await getPokemonPage(DEFAULT_FIRST_PAGE);
        setPokemonList(details);
        setNextUrl(newNextUrl);
        setError(null);
        await AsyncStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(details));
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
  }, []);

  const loadMorePokemon = async () => {
    if (loadingMore || !nextUrl) {
      return;
    }

    setLoadingMore(true);
    try {
      const { details: newDetails, nextUrl: newNextUrl } = await getPokemonPage(nextUrl);
      const updatedList = [...pokemonList, ...newDetails];
      setPokemonList(updatedList);
      setNextUrl(newNextUrl);
      await AsyncStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to load more Pokémon:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshPokemon = async () => {
    setLoading(true);
    try {
      const { details, nextUrl: newNextUrl } = await getPokemonPage(DEFAULT_FIRST_PAGE);
      setPokemonList(details);
      setNextUrl(newNextUrl);
      setError(null);
      await AsyncStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(details));
    } catch (err) {
      setError('Failed to refresh Pokémon data.');
      console.error('Failed to refresh Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = { pokemonList, loading, error, loadingMore, loadMorePokemon, refreshPokemon };

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};
