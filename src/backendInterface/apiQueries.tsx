const API_URL = 'https://rickandmortyapi.com/api';


export interface Character {
    id: number,
    name: string,
    image: string,
    episode: [string]
}

export interface CharacterResult{
    error?: string,
    results?: Character[]
}

export const fetchCharactersByName = async (name: string) => {
    let resp:CharacterResult = {};
    try {
        const response = await fetch(`${API_URL}/character/?name=${name}`);
        resp = await response.json();
    } catch (error) {
        alert("Error fetching characters");
    }
   
    return resp;
}