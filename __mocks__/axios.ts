const mockPokemonList = {
  data: {
    count: 2,
    next: null,
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ],
  },
};

const mockPokemonDetail = (id: string, name: string) => ({
  data: {
    id: Number(id),
    name: name,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    },
  },
});

export default {
  get: jest.fn((url: string) => {
    const match = url.match(/pokemon\/(\d+)\/?$/);
    if (match) {
      const id = match[1];
      const name = id === '1' ? 'bulbasaur' : 'charmander';
      return Promise.resolve(mockPokemonDetail(id, name));
    }
    return Promise.resolve(mockPokemonList);
  }),
  create: jest.fn(function () {
    return this;
  }),
};
