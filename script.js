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
        console.error("Error loading Pokémon:", error);
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
        document.getElementById("content").innerHTML = "<h1>No Pokémon found</h1>";
        document.getElementById("btn").style.display = "none";
        return;
    }

    const original = [...pokemonData];
    pokemonData = filtered;
    renderPokemon();
    pokemonData = original;
}


// function renderPokemonDetails(index){
//     let overlayRef = document.getElementById('overlay');
//     overlayRef.classList.toggle('d_none');

//     if (overlayRef.classList.contains('overlay')) {
        
//         overlayRef.innerHTML = getOverlayPokemon(index);
//     }
// }


// function renderPokemonDetails(index) {
//     let overlayRef = document.getElementById('overlay');
    
//     // Wenn das Overlay versteckt ist (d_none = true) → Inhalt rendern + anzeigen
//     if (overlayRef.classList.contains('d_none')) {
//         overlayRef.innerHTML = getOverlayPokemon(index);
//         overlayRef.classList.remove('d_none'); // Overlay anzeigen
//     } 
//     // Wenn das Overlay bereits sichtbar ist → nur verstecken (d_none hinzufügen)
//     else {
//         overlayRef.classList.add('d_none');
//     }
// }
// Overlay-Listener für Klicks auf den Hintergrund
document.getElementById('overlay').addEventListener('click', function(event) {
    // Schließe nur bei Klicks auf den Hintergrund
    if (!event.target.closest('.overlay-area')) {
        this.classList.add('d_none');
    }
});

function renderPokemonDetails(index) {
    const overlayRef = document.getElementById('overlay');
    
    if (overlayRef.classList.contains('d_none')) {
        overlayRef.innerHTML = getOverlayPokemon(index);
        overlayRef.classList.remove('d_none');
        
        // Neu: Event-Listener für den Schließen-Button (falls vorhanden)
        const closeBtn = overlayRef.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlayRef.classList.add('d_none');
            });
        }
    }
    // Kein else-Zweig mehr nötig, da der Klick-Listener das Overlay schließt
}

// Funktion muss im globalen Scope sein!
function bubblingProtection(event) {
    event.stopPropagation();
}

function getOverlayPokemon(index) {
    const pokemon = pokemonData[index];

    const typeIcons = pokemon.types.map(type => `
        <div class="type">
            <img src="/assets/icons/${type}.svg"
                alt="${type}"
                title="${type}"
                class="icon ${type}"/>
        </div>
    `).join("");
    
    return `
        <div class="overlay-area" onclick="bubblingProtection(event)">
            <div onclick="renderPokemonDetails(${index})" class="pokemon-details">
                <div class="headline-details">
                    <h2>#${pokemon.id}</h2>
                    <h2>${capitalize(pokemon.name)}</h2>
                </div>
                <img src="${pokemon.image}" alt="${pokemon.name}" class="${pokemon.types[0]}" />
                <div class="types">${typeIcons}</div>
            </div>
            <div id="details-container">
                <div class="details-header">
                    <div id="details-main"><h3>main</h3></div>
                    <div id="stats"><h3>stats</h3></div>
                    <div id="evo-chain"><h3>evo chain</h3></div>
                </div>
                <div id="details-content-main">
                    <table>
                        <tr>
                            <td>Height</td>
                            <td>: ${convertHeight(pokemon.height)} m</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>: ${convertWeight(pokemon.weight)} kg</td>
                        </tr>
                        <tr>
                            <td>Base experience</td>
                            <td>: ${pokemon.base_experience}</td>
                        </tr>
                        <tr>
                            <td>Abilitis</td>
                            <td>${pokemon.abilities.map(a => `<div class="ability">: ${a}</div>`).join('')}</td>
                        </tr>
                    </table>
                </div>
                <div id="details-content-stats" style="display: none;"></div>
                <div id="details-content-evo-chain" style="display: none;"></div>
            </div>
        </div>`
}


function convertHeight(height) {
    return (height / 10).toFixed(1);
}


function convertWeight(weight) {
    return (weight / 10).toFixed(1);
}


// function bubblingProtection(event) {
//     event.stopPropagation();
// }