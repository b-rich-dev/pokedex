function buildPokemonObject(detail, species, evolution) {
    return {
        id: detail.id,
        name: detail.name,
        image: detail.sprites.other["home"].front_default,
        types: detail.types.map(t => t.type.name),
        url: detail.url,
        height: detail.height,
        weight: detail.weight,
        base_experience: detail.base_experience,
        abilities: detail.abilities.map(a => a.ability.name),
        stats: detail.stats.map(s => ({
            name: s.stat.name,
            value: s.base_stat
        })),
        evolution_chain_url: species.evolution_chain?.url || null,
        evolution_chain: evolution
    };
}


function createTypeIconsHTML(types) {
    return types.map(type => `
        <div class="type">
            <img src="./assets/icons/${type}.svg"
                 alt="${type}"
                 title="${type}"
                 class="icon ${type}"/>
        </div>
    `).join('');
}


function createPokemonCardHTML(pokemon, index) {
    return `
        <div onclick="renderPokemonDetails(${index})" class="pokemon">
            <div class="headline">
                <h3>#${pokemon.id}</h3>
                <h3>${capitalize(pokemon.name)}</h3>
            </div>
            <img src="${pokemon.image}" alt="${pokemon.name}" class="${pokemon.types[0]}" />
            <div class="types">${createTypeIconsHTML(pokemon.types)}</div>
        </div>
    `;
}


function createOverlayTemplate(pokemon, typeIcons, statBarsHtml, evolutionHtml, tabMainHtml, navigationHtml) {
    return `
        <div class="overlay-area" onclick="bubblingProtection(event)">
            <div class="pokemon-details">
                <div class="headline-details">
                    <h2>#${pokemon.id}</h2>
                    <h2>${capitalize(pokemon.name)}</h2>
                    <div id="close-button" onclick="closeOverlay()" style="display: none;">✖</div>
                </div>
                <div class="${pokemon.types[0]} img-container">
                    <img class="pokemon-details-img" src="${pokemon.image}" alt="${pokemon.name}" />
                </div>
                <div class="types">${typeIcons}</div>
                <div id="details-container">
                    <div class="tab-container">
                        <div id="details-main" onclick="changeTab('main')" class="tab active"><h2>main</h2></div>
                        <div id="stats" onclick="changeTab('stats')" class="tab"><h2>stats</h2></div>
                        <div id="evo-chain" onclick="changeTab('evo-chain')" class="tab"><h2>evo chain</h2></div>
                    </div>
                    <div id="details-content-main">${tabMainHtml}</div>
                    <div id="details-content-stats" style="display: none;">${statBarsHtml}</div>
                    <div id="details-content-evo-chain" style="display: none;">${evolutionHtml}</div>
                </div>
                ${navigationHtml}
            </div>
        </div>`;
}


function createTypeIcons(types) {
    return types.map(type => `
        <div class="type">
            <img src="./assets/icons/${type}.svg" alt="${type}" title="${type}" class="icon ${type}"/>
        </div>
    `).join("");
}


function createStatBars(stats) {
    const maxStat = {
        hp: 255, attack: 190, defense: 230,
        'special-attack': 194, 'special-defense': 230, speed: 200
    };

    return stats.map(({ name, value }) => {
        const percentage = Math.round((value / (maxStat[name] || 255)) * 100);
        return `
            <div class="stats-container">
                <div class="p-tag">${name}</div>
                <div class="bar">
                    <div class="inner-bar" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }).join('');
}


function createEvolutionChain(evolution_chain) {
    if (!Array.isArray(evolution_chain) || evolution_chain.length === 0) {
        return '<p>No evolution data available.</p>';
    }

    return evolution_chain.map((evo, i) => `
        <div class="evolution-entry">
            <img class="evo-img" src="${evo.image}" alt="${evo.name}" />
            <h3>${capitalize(evo.name)}</h3>
        </div>
        ${i < evolution_chain.length - 1 ? '<div class="evo-arrow">»</div>' : ''}
    `).join('');
}


function createTabContentMain(pokemon) {
    return `
        <table>
            <tr><td>Height</td><td>: ${convertHeight(pokemon.height)} m</td></tr>
            <tr><td>Weight</td><td>: ${convertWeight(pokemon.weight)} kg</td></tr>
            <tr><td>Base experience</td><td>: ${pokemon.base_experience}</td></tr>
            <tr><td>Abilitis</td><td>${pokemon.abilities.map(a => `<div class="ability">: ${a}</div>`).join('')}</td></tr>
        </table>
    `;
}


function createNavigation() {
    return `
        <div class="navigation">
            <img src="./assets/icons/chevron-back-outline.svg" alt="Back buttton" class="back_button" onclick="goBack()">
            <img src="./assets/img/pokemon-seeklogo.png" alt="Pokemon Logo" class="pokemon_logo">
            <img src="./assets/icons/chevron-forward-outline.svg" alt="Forward button" id="forward-button" class="forward_button" onclick="goForward()">
        </div>
    `;
}