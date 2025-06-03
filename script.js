let offset = 0;
const limit = 20;
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let pokemonData = [];
// let currentPokemon = [];
let currentIndex = 0;

async function init() {
    showSpinner();
    await loadingSpinner();
    showPage();
}


async function loadingSpinner() {
    await loadPokemon();
}


function showSpinner() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("loading-p-line").style.display = "block";
    document.getElementById("main-content").style.display = "none";
    document.getElementById("btn").style.display = "none";
}


function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loading-p-line").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    document.getElementById("btn").style.display = "flex";
}


async function loadPokemon() {
    try {
        let url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
        let response = await fetch(url);
        let data = await response.json();

        let pokemonList = data.results;
        let newPokemon = [];

        for (let i = 0; i < pokemonList.length; i++) {
            let detailUrl = pokemonList[i].url;
            let detailResponse = await fetch(detailUrl);
            let detailData = await detailResponse.json();

            newPokemon.push({
                id: detailData.id,
                name: detailData.name,
                image: detailData.sprites.other["home"].front_default,
                types: detailData.types.map(t => t.type.name),

                url: detailData.url,
                height: detailData.height,
                weight: detailData.weight,
                base_experience: detailData.base_experience,
                abilities: detailData.abilities.map(a => a.ability.name),
                stats: detailData.stats.map(s => ({
                    name: s.stat.name,
                    value: s.base_stat
                })),

                
            });
        }

        pokemonData.push(...newPokemon);
        renderPokemon(newPokemon);

        if (!data.next) {
            loadMoreButton.disabled = true;
            loadMoreButton.textContent = "no more Pokémon";
        }
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon:", error);
    }
}


function renderPokemon() {
    const container = document.getElementById("content");
    container.innerHTML = "";

    pokemonData.forEach((pokemon, index) => {
        const typeIcons = pokemon.types.map(type => `
            <div class="type">
                <img src="/assets/icons/${type}.svg"
                    alt="${type}"
                    title="${type}"
                    class="icon ${type}"/>
            </div>
        `).join("");

        container.innerHTML += `
            <div onclick="renderPokemonDetails(${index})" class="pokemon">
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


async function loadMorePokemon() {
    offset += limit;
    await init();
    document.getElementById("btn").scrollIntoView({ behavior: "smooth" });
}


function filterPokemon() {
    const searchTerm = document.getElementById("search").value.toLowerCase();

    if (searchTerm === "") {
        renderPokemon();
        document.getElementById("btn").style.display = "flex";
        return;
    }

    const filtered = pokemonData.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

        if (filtered.length === 0) {
        document.getElementById("content").innerHTML = "<h1>Kein Pokémon gefunden.</h1>";
        document.getElementById("btn").style.display = "none";
        return;
    }

    const original = [...pokemonData];
    pokemonData = filtered;
    renderPokemon();
    pokemonData = original;
}


function renderPokemonDetails(index){
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.toggle('d_none');

    overlayRef.innerHTML = getOverlayPokemon(index);
}


function getOverlayPokemon(index) {
    const pokemon = pokemonData[index];
    
    return `<div class="overlay-area" onclick="bubblingProtection(event)">
                <div onclick="renderPokemonDetails(${index})" class="pokemon-details">
                    <div class="headline-details">
                        <h2>#${pokemon.id}</h2>
                        <h2>${capitalize(pokemon.name)}</h2>
                    </div>
                    <img src="${pokemon.image}" alt="${pokemon.name}" class="${pokemon.types[0]}" />
                    <div class="types">{typeIcons}</div>
                </div>
                <div id="details-container">
                    <div>
                        <div id="details-main">main</div><div id="stats">stats</div><div id="evo-chain">evo chain</div>
                    </div>
                    <div id="details-content">
                    </div>
                </div>
            </div>`
}

// onclick="bubblingProtection(event)"
function bubblingProtection(event) {
    event.stopPropagation()
}