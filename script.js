let offset = 0;
const limit = 20;
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let pokemonData = [];
let currentIndex = 0;


window.addEventListener("resize", toggleCloseButton);


async function init() {
    toggleLoading(true);
    await loadPokemon();
    toggleLoading(false);
}


async function loadingSpinner() {
    await loadPokemon();
}


function toggleLoading(isLoading) {
    const display = isLoading ? "block" : "none";
    const contentDisplay = isLoading ? "none" : "flex";

    document.getElementById("loader").style.display = display;
    document.getElementById("loading-p-line").style.display = display;
    document.getElementById("main-content").style.display = contentDisplay;
    document.getElementById("btn").style.display = contentDisplay;

    document.getElementById("main").classList.toggle("background_image", isLoading);
}


async function loadPokemon() {
    try {
        const data = await fetchPokemonList();
        const detailDataList = await fetchAllDetails(data.results);
        const speciesDataList = await fetchAllSpecies(detailDataList);
        const evolutionChains = await fetchAllEvolutions(speciesDataList);

        const newPokemon = buildAllPokemonObjects(detailDataList, speciesDataList, evolutionChains);

        handleLoadedPokemon(newPokemon, data);;
    } catch (error) {
        console.error("Error loading Pokémon:", error);
    }
}


async function fetchPokemonList() {
    const url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
    return await fetchJson(url);
}


async function fetchAllDetails(results) {
    const promises = results.map(p => fetchJson(p.url));
    return await Promise.all(promises);
}


async function fetchAllSpecies(details) {
    const promises = details.map(d => fetchJson(d.species.url));
    return await Promise.all(promises);
}


async function fetchAllEvolutions(speciesList) {
    const evoPromises = speciesList.map(s =>
        s.evolution_chain?.url ? fetchJson(s.evolution_chain.url) : null
    );

    const evoDataList = await Promise.all(evoPromises);

    return await Promise.all(
        evoDataList.map(e => e ? extractEvolutionDataWithImages(e.chain) : [])
    );
}


function buildAllPokemonObjects(details, speciesList, evolutionChains) {
    return details.map((detail, i) =>
        buildPokemonObject(detail, speciesList[i], evolutionChains[i])
    );
}


function handleLoadedPokemon(newPokemon, data) {
    pokemonData.push(...newPokemon);
    renderPokemon(newPokemon);
    disableLoadIfNoNext(data.next);
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
        return showAllPokemon();
    }

    const filtered = getFilteredPokemon(searchTerm);

    if (filtered.length === 0) {
        return showNoResults();
    }

    showFilteredPokemon(filtered);
}


function showAllPokemon() {
    renderPokemon();
    setLoadButtonVisible(true);
}


function getFilteredPokemon(searchTerm) {
    return pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
}


function showNoResults() {
    document.getElementById("content").innerHTML = "<h1>No Pokémon found</h1>";
    setLoadButtonVisible(false);
}


function showFilteredPokemon(filtered) {
    const original = [...pokemonData];
    pokemonData = filtered;
    renderPokemon();
    pokemonData = original;
    setLoadButtonVisible(false);
}


function setLoadButtonVisible(visible) {
    document.getElementById("btn").style.display = visible ? "flex" : "none";
}


const overlay = document.getElementById('overlay');
if (overlay) {
    overlay.addEventListener('click', function (event) {
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

    overlayRef.onclick = handleOverlayClick;

    overlayRef.classList.remove('d_none');
    document.body.classList.add('no-scroll');
}


function handleOverlayClick(event) {
    if (!event.target.closest('.overlay-area')) {
        event.currentTarget.classList.add('d_none');
        document.body.classList.remove('no-scroll');
    }
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