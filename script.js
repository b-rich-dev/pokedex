const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
const nextPokemon = "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20";

let pokemonData = [];
let mySpin;


function init() {
    onloadFunc();
    loadingSpinner();
}


function loadingSpinner() {
  mySpin = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("loading-headline").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
  document.getElementById("btn").style.display = "flex";
}


async function onloadFunc() {
    let response = await fetch(BASE_URL);
    let data = await response.json();

    let pokemonList = data.results;

    for (let i = 0; i < pokemonList.length; i++) {
        let detailUrl = pokemonList[i].url;
        let detailResponse = await fetch(detailUrl);
        let detailData = await detailResponse.json();

        pokemonData.push({
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.other["home"].front_default,
            types: detailData.types.map(t => t.type.name)
        });
    }

    renderPokemon();

}


function renderPokemon() {
    const container = document.getElementById("content");
    container.innerHTML = "";

    pokemonData.forEach(pokemon => {
        const typeIcons = pokemon.types.map(type => `
            <div class="type">
                <img src="/assets/icons/${type}.svg"
                    alt="${type}"
                    title="${type}"
                    class="icon ${type}"/>
            </div>
        `).join("");

        container.innerHTML += `
            <div class="pokemon">
                <div class="headline">
                    <h3>#${pokemon.id}</h3>
                    <h3>${capitalize(pokemon.name)}</h3>
                </div>
                <img src="${pokemon.image}" alt="${pokemon.name}" class="${pokemon.types[0]}" />
                <div class="types">${typeIcons}</div>
            </div>
        `;
    });
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}