import { useEffect, useState } from 'react';

import { PokemonDetail } from '@/types/pokemon';

/**
 * Custom hook to handle searching/filtering a list of Pokémon.
 * @param pokemonList The original list of Pokémon.
 * @returns {object} An object containing the search query, setter for search query, and the filtered list.
 */
export const usePokemonSearch = (pokemonList: PokemonDetail[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonDetail[]>([]);

  useEffect(() => {
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchQuery, pokemonList]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPokemon,
  };
};
