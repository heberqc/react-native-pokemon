import apiClient from '@/api/client';
import { PokemonBase, PokemonDetail } from '@/types/pokemon';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBase[];
}

/**
 * Fetches an initial list of Pokémon and resolves their detailed data.
 * @returns A promise that resolves to an array of detailed Pokémon data.
 */
export const getPokemonListWithDetails = async (): Promise<PokemonDetail[]> => {
  try {
    const listResponse = await apiClient.get<PokemonListResponse>('pokemon?limit=20');

    const detailPromises = listResponse.data.results.map((pokemon) =>
      apiClient.get<PokemonDetail>(pokemon.url)
    );

    const detailResponses = await Promise.all(detailPromises);

    return detailResponses.map((response) => response.data);
  } catch (error) {
    console.error('Failed to fetch Pokémon list with details:', error);
    throw error;
  }
};
