import apiClient from '@/api/client';
import { PokemonBase, PokemonDetail } from '@/types/pokemon';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBase[];
}

/**
 * Fetches a page of Pokémon, resolves their detailed data, and returns the next page URL.
 * @param url The API endpoint to fetch the Pokémon list from.
 * @returns A promise that resolves to an object containing the detailed Pokémon data and the URL for the next page.
 */
export const getPokemonPage = async (
  url: string
): Promise<{ details: PokemonDetail[]; nextUrl: string | null }> => {
  try {
    // URL can be a relative path or a full URL from the 'next' property
    const listResponse = await apiClient.get<PokemonListResponse>(url);

    const detailPromises = listResponse.data.results.map((pokemon) =>
      apiClient.get<PokemonDetail>(pokemon.url)
    );

    const detailResponses = await Promise.all(detailPromises);
    const details = detailResponses.map((response) => response.data);

    return { details, nextUrl: listResponse.data.next };
  } catch (error) {
    console.error('Failed to fetch Pokémon list with details:', error);
    throw error;
  }
};
