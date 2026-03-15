export type PokemonBase = {
  name: string;
  url: string;
};

type PokemonTypeInfo = {
  name: string;
  url: string;
};

type PokemonType = {
  slot: number;
  type: PokemonTypeInfo;
};

type PokemonSprites = {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
};

export interface PokemonDetail extends PokemonBase {
  id: number;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: PokemonSprites;
}
