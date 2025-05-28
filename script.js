const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
const nextPokemon = "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20";


async function onloadFunc() {
    // let pokemonResponse = await getAllPokemon("name","url");
    loadData("/test");
    loadData("/url");
}


async function getAllPokemon(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}


async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    // Anstatt console.log
    return responseToJson;
}