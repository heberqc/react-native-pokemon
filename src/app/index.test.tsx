import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

// Mock react-native-paper Portal to render children directly
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}>
      <PaperProvider>{component}</PaperProvider>
    </SafeAreaProvider>
  );
};

describe('HomeScreen', () => {
  const mockUsePokemon = usePokemon as jest.Mock;
  const mockRefreshPokemon = jest.fn();
  const mockLoadMorePokemon = jest.fn();

  const mockPokemonList: any[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      sprites: {
        front_default: 'url',
        other: {
          'official-artwork': {
            front_default: 'url',
          },
        },
      },
      weight: 69,
      height: 7,
      types: [{ type: { name: 'grass' } }],
    },
    {
      id: 4,
      name: 'Charmander',
      sprites: {
        front_default: 'url',
        other: {
          'official-artwork': {
            front_default: 'url',
          },
        },
      },
      weight: 85,
      height: 6,
      types: [{ type: { name: 'fire' } }],
    },
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

    renderWithProviders(<HomeScreen />);

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

    renderWithProviders(<HomeScreen />);

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

    renderWithProviders(<HomeScreen />);

    // Find the search bar and type 'char'
    const searchInput = screen.getByPlaceholderText('Search Pokémon');
    fireEvent.changeText(searchInput, 'char');

    // Charmander should still be visible, but Bulbasaur should be gone
    expect(screen.getByText('Charmander')).toBeTruthy();
    expect(screen.queryByText('Bulbasaur')).toBeNull();
  });

  it('opens the modal and displays pokemon details when a card is pressed', async () => {
    mockUsePokemon.mockReturnValue({
      pokemonList: mockPokemonList,
      loading: false,
      error: null,
      loadingMore: false,
      loadMorePokemon: mockLoadMorePokemon,
      refreshPokemon: mockRefreshPokemon,
    });

    renderWithProviders(<HomeScreen />);

    const card = await screen.findByTestId('pokemon-card-1');
    fireEvent.press(card);

    // Using regex to loosely match the numbers, in case your Modal formats them (e.g., "Weight: 6.9 kg")
    expect(await screen.findByText(/6\.9/)).toBeTruthy();
    expect(await screen.findByText(/0\.7/)).toBeTruthy();
  });
});
