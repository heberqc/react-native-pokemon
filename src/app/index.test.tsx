import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { usePokemon } from '@/context/PokemonContext';
import HomeScreen from './index';

// Mock the usePokemon hook from PokemonContext
jest.mock('@/context/PokemonContext');

// Mock the expo-router Stack.Screen component
jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
}));

describe('HomeScreen', () => {
  const mockUsePokemon = usePokemon as jest.Mock;
  const mockRefreshPokemon = jest.fn();
  const mockLoadMorePokemon = jest.fn();

  const mockPokemonList: any[] = [
    { id: 1, name: 'Bulbasaur', sprites: { front_default: 'url' }, weight: 69, height: 7 },
    { id: 4, name: 'Charmander', sprites: { front_default: 'url' }, weight: 85, height: 6 },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders a list of pokemon', () => {
    mockUsePokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      loading: false,
      error: null,
      loadingMore: false,
      loadMorePokemon: mockLoadMorePokemon,
      refreshPokemon: mockRefreshPokemon,
    });

    render(<HomeScreen />);

    expect(screen.getByText('Bulbasaur')).toBeTruthy();
    expect(screen.getByText('Charmander')).toBeTruthy();
  });

  it('shows an error message if there is an error', () => {
    mockUsePokemon.mockReturnValue({
      pokemonList: [],
      loading: false,
      error: 'Something went wrong',
      loadingMore: false,
      loadMorePokemon: mockLoadMorePokemon,
      refreshPokemon: mockRefreshPokemon,
    });

    render(<HomeScreen />);

    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('filters the pokemon list when searching', () => {
    mockUsePokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      loading: false,
      error: null,
      loadingMore: false,
      loadMorePokemon: mockLoadMorePokemon,
      refreshPokemon: mockRefreshPokemon,
    });

    render(<HomeScreen />);

    // Find the search bar and type 'char'
    const searchInput = screen.getByPlaceholderText('Search Pokémon');
    fireEvent.changeText(searchInput, 'char');

    // Charmander should still be visible, but Bulbasaur should be gone
    expect(screen.getByText('Charmander')).toBeTruthy();
    expect(screen.queryByText('Bulbasaur')).toBeNull();
  });

  it('opens the modal and displays pokemon details when a card is pressed', () => {
    mockUsePokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      loading: false,
      error: null,
      loadingMore: false,
      loadMorePokemon: mockLoadMorePokemon,
      refreshPokemon: mockRefreshPokemon,
    });

    render(<HomeScreen />);

    fireEvent.press(screen.getByText('Bulbasaur'));

    // Using regex to loosely match the numbers, in case your Modal formats them (e.g., "Weight: 69kg")
    expect(screen.getByText(/69/)).toBeTruthy();
    expect(screen.getByText(/7/)).toBeTruthy();
  });
});
