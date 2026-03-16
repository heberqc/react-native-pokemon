import apiClient from '@/api/client';
import { getPokemonPage } from './pokemonService';

// Mock the api client directly for this test suite
jest.mock('@/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('pokemonService error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Keep test output clean from console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws an error when Axios rejects with a 500 status', async () => {
    // Mock an Axios 500 error rejection
    const mockAxiosError = new Error('Network Error');
    (mockAxiosError as any).response = { status: 500, data: 'Internal Server Error' };

    (apiClient.get as jest.Mock).mockRejectedValueOnce(mockAxiosError);

    // Attempt to fetch and verify that the service throws the error forward
    await expect(getPokemonPage('https://pokeapi.co/api/v2/pokemon')).rejects.toThrow(
      'Network Error'
    );

    // Verify the endpoint was called
    expect(apiClient.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon');
  });
});
