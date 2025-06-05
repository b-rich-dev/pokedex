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


async function extractEvolutionDataWithImages(chain) {
    const evolution = [];

    for (let current = chain; current != null; current = current.evolves_to?.[0]) {
        const name = current.species.name;
        const response = await fetch(current.species.url);
        const data = await response.json();
        const id = data.id;
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
        evolution.push({ name, image });
    }

    return evolution;
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


            let speciesResponse = await fetch(detailData.species.url);
            let speciesData = await speciesResponse.json();

            let evoChainUrl = speciesData.evolution_chain?.url;

            let evolution = [];
            if (evoChainUrl) {
                let evoResponse = await fetch(evoChainUrl);
                let evoData = await evoResponse.json();
                evolution = await extractEvolutionDataWithImages(evoData.chain);
            }

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
                evolution_chain_url: evoChainUrl,
                evolution_chain: evolution

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
document.getElementById('overlay').addEventListener('click', function (event) {
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

    // const evolutionHtml = pokemon.evolution_chain.map((name, i) => {
    //     return `<span class="evo-step">${capitalize(name)}</span>${i < pokemon.evolution_chain.length - 1 ? ' ➜ ' : ''}`;
    // }).join('');

    const maxStat = {
        hp: 255,
        attack: 190,
        defense: 230,
        'special-attack': 194,
        'special-defense': 230,
        speed: 200
    };


    const statBarsHtml = pokemon.stats.map(s => {
        const statName = s.name;
        const base = s.value;
        const max = maxStat[statName] || 255;
        const percentage = Math.round((base / max) * 100);

        return `
            <div class="stats-container">
                <div class="p-tag">${statName}</div>
                <div class="bar">
                    <div class="inner-bar" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }).join('');


    let evolutionHtml = "";

    if (Array.isArray(pokemon.evolution_chain) && pokemon.evolution_chain.length > 0) {
        for (let i = 0; i < pokemon.evolution_chain.length; i++) {
            const evo = pokemon.evolution_chain[i];
            evolutionHtml += `
            <div class="evolution-entry">
                <img class="evo-img" src="${evo.image}" alt="${evo.name}" />
                <h3>${capitalize(evo.name)}</h3>
            </div>
        `;

            // Nur Pfeil hinzufügen, wenn nicht letztes Element
            if (i < pokemon.evolution_chain.length - 1) {
                evolutionHtml += `<div class="evo-arrow">»</div>`;
            }
        }
    } else {
        evolutionHtml = '<p>No evolution data available.</p>';
    }

    // const evolutionHtml = Array.isArray(pokemon.evolution_chain) ?
    //     pokemon.evolution_chain.map(evo => `
    //         <div class="evolution-entry">
    //             <img class="evo-img" src="${evo.image}" alt="${evo.name}" />
    //             <h3>${capitalize(evo.name)}</h3>
    //         </div>
    //     `).join('') : '<p>No evolution data available.</p>';


    return `
        <div class="overlay-area" onclick="bubblingProtection(event)">
            <div class="pokemon-details">
                <div class="headline-details">
                    <h2>#${pokemon.id}</h2>
                    <h2>${capitalize(pokemon.name)}</h2>
                </div>
                <div class="${pokemon.types[0]} img-container">
                    <img class="pokemon-details-img" src="${pokemon.image}" alt="${pokemon.name}" />
                </div>
                <div class="types">${typeIcons}</div>
                <div id="details-container">
                    <div class="tab-container">
                        <div id="details-main" onclick="changeToMain()" class="tab active"><h2>main</h2></div>
                        <div id="stats" onclick="changeToStats()" class="tab"><h2>stats</h2></div>
                        <div id="evo-chain" onclick="changeToEvoChain()" class="tab"><h2>evo chain</h2></div>
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
                    <div id="details-content-stats" style="display: none;">
                        ${statBarsHtml}
                    </div>
                    <div id="details-content-evo-chain" style="display: none;">
                            ${evolutionHtml}
                    </div>
                </div>
            </div>
        </div>`
}


function convertHp(hp) {
    return ((hp / (2 * hp + 204)) * 100).toFixed(2);
}

function convertBaseStat(baseStat) {
    return (2 * baseStat + 99).toFixed(0);
}


function convertHeight(height) {
    return (height / 10).toFixed(1);
}


function convertWeight(weight) {
    return (weight / 10).toFixed(1);
}


function changeToMain() {
    document.getElementById("stats").classList.remove("active");
    document.getElementById("evo-chain").classList.remove("active");
    document.getElementById("details-content-main").style.display = "flex";
    document.getElementById("details-content-stats").style.display = "none";
    document.getElementById("details-content-evo-chain").style.display = "none";
    document.getElementById("details-main").classList.add("active");
}


function changeToStats() {
    document.getElementById("details-main").classList.remove("active");
    document.getElementById("evo-chain").classList.remove("active");
    document.getElementById("details-content-stats").style.display = "flex";
    document.getElementById("details-content-main").style.display = "none";
    document.getElementById("details-content-evo-chain").style.display = "none";
    document.getElementById("stats").classList.add("active");
}


function changeToEvoChain() {
    document.getElementById("stats").classList.remove("active");
    document.getElementById("details-main").classList.remove("active");
    document.getElementById("details-content-evo-chain").style.display = "flex";
    document.getElementById("details-content-stats").style.display = "none";
    document.getElementById("details-content-main").style.display = "none";
    document.getElementById("evo-chain").classList.add("active");
}
// function bubblingProtection(event) {
//     event.stopPropagation();
// }