const API_URL = "https://rickandmortyapi.com/api";

export interface Character {
  id: number;
  name: string;
  image: string;
  episode: [string];
}

export const fetchCharactersByName = async (name: string) => {
  let characters: Character[] = [];
  try {
    const response = await fetch(`${API_URL}/character/?name=${name}`);
    const resp = await response.json();

    console.log('resp.results', resp.results)
    characters = resp.results ?? [];
  } catch (e) {
    alert(
      "Something went wrong while fetching characters. (ERROR CODE: CHAR-919)"
    ); // if clients send ss about the error, we can check the error code and understand the problem
    characters = [];
    console.log(e);
  }

  console.log('characters', characters)

  return characters;
};
