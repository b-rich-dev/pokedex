let offset = 0;
const limit = 20;
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let pokemonData = [];
let currentIndex = 0;


window.addEventListener("resize", toggleCloseButton);


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
    document.getElementById("main").classList.add("background_image");
}


function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("loading-p-line").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    document.getElementById("btn").style.display = "flex";
    document.getElementById("main").classList.remove("background_image");
}


async function loadPokemon() {
    try {
        const url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
        const data = await fetchJson(url);

        const detailPromises = data.results.map(p => fetchJson(p.url));
        const detailDataList = await Promise.all(detailPromises);

        const speciesPromises = detailDataList.map(d => fetchJson(d.species.url));
        const speciesDataList = await Promise.all(speciesPromises);

        const evoPromises = speciesDataList.map(s =>
            s.evolution_chain?.url ? fetchJson(s.evolution_chain.url) : null
        );
        const evoDataList = await Promise.all(evoPromises);

        const evolutionChains = await Promise.all(
            evoDataList.map(e => e ? extractEvolutionDataWithImages(e.chain) : [])
        );

        const newPokemon = detailDataList.map((detail, i) =>
            buildPokemonObject(detail, speciesDataList[i], evolutionChains[i])
        );

        pokemonData.push(...newPokemon);
        renderPokemon(newPokemon);
        disableLoadIfNoNext(data.next);
    } catch (error) {
        console.error("Error loading Pokémon:", error);
    }
}


async function getPokemonDetails(pokemon) {
    const detailData = await fetchJson(pokemon.url);
    const speciesData = await fetchJson(detailData.species.url);

    const evolution = await getEvolutionData(speciesData);
    return buildPokemonObject(detailData, speciesData, evolution);
}


async function getEvolutionData(speciesData) {
    const url = speciesData.evolution_chain?.url;
    if (!url) return [];
    const evoData = await fetchJson(url);
    return extractEvolutionDataWithImages(evoData.chain);
}


async function fetchJson(url) {
    const response = await fetch(url);
    return response.json();
}


function disableLoadIfNoNext(next) {
    if (!next) {
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = "no more Pokémon";
    }
}


async function extractEvolutionDataWithImages(chain) {
    const evolution = [];
    let current = chain;

    while (current) {
        const name = current.species.name;
        const response = await fetch(current.species.url);
        const data = await response.json();
        const id = data.id;
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
        evolution.push({ name, image });

        current = current.evolves_to && current.evolves_to.length > 0 ? current.evolves_to[0] : null;
    }

    return evolution;
}


function renderPokemon() {
    document.getElementById("content").innerHTML = pokemonData
        .map((pokemon, index) => createPokemonCardHTML(pokemon, index))
        .join('');
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


const overlay = document.getElementById('overlay');
if (overlay) {
  overlay.addEventListener('click', function(event) {
    if (!event.target.closest('.overlay-area')) {
      this.classList.add('d_none');
      document.body.classList.remove('no-scroll');
    }
  });
}


function renderPokemonDetails(index) {
    currentIndex = index;
    const overlayRef = document.getElementById('overlay');

    overlayRef.innerHTML = "";
    overlayRef.innerHTML = getOverlayPokemon(index);
    toggleCloseButton();

    overlayRef.onclick = function (event) {
        if (!event.target.closest('.overlay-area')) {
            this.classList.add('d_none');
            document.body.classList.remove('no-scroll');
        }
    };

    overlayRef.classList.remove('d_none');
    document.body.classList.add('no-scroll');
}


function bubblingProtection(event) {
    event.stopPropagation();
}


function getOverlayPokemon(index) {
    const pokemon = pokemonData[index];

    const typeIcons = createTypeIcons(pokemon.types);
    const statBarsHtml = createStatBars(pokemon.stats);
    const evolutionHtml = createEvolutionChain(pokemon.evolution_chain);
    const tabMainHtml = createTabContentMain(pokemon);
    const navigationHtml = createNavigation();

    return createOverlayTemplate(
        pokemon,
        typeIcons,
        statBarsHtml,
        evolutionHtml,
        tabMainHtml,
        navigationHtml
    );
}


function convertHeight(height) {
    return (height / 10).toFixed(1);
}


function convertWeight(weight) {
    return (weight / 10).toFixed(1);
}


function changeTab(tab) {
    const tabIds = ["main", "stats", "evo-chain"];

    tabIds.forEach(id => {
        const buttonId = id === "main" ? "details-main" : id;
        const contentId = `details-content-${id}`;

        document.getElementById(buttonId).classList.toggle("active", id === tab);
        document.getElementById(contentId).style.display = id === tab ? "flex" : "none";
    });
}


function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        renderPokemonDetails(currentIndex);
    }
}


function goForward() {
    if (currentIndex < pokemonData.length - 1) {
        currentIndex++;
        renderPokemonDetails(currentIndex);
    }
}


function toggleCloseButton() {
    const closeButton = document.getElementById("close-button");
    if (!closeButton) return;

    if (window.innerWidth < 720) {
        closeButton.style.display = "flex";
    } else {
        closeButton.style.display = "none";
    }
}


function closeOverlay() {
    const overlay = document.querySelector(".overlay");
    if (overlay) overlay.classList.add('d_none');
    document.body.classList.remove('no-scroll');
}