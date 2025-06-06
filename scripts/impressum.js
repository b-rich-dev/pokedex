function headerSearchOff() {
    const headerSearch = document.getElementById('search');
    if (headerSearch) {
        headerSearch.style.display = 'none';
    }
}


function renderImpressumContent() {
    let impressumRef = document.getElementById('impressum')
    impressumRef.innerHTML += getImpressumContent();
}


function getImpressumContent() {
    return `<div class="impressum_container">
                <h1>Impressum</h1>

                <p>Eugen Birich<br />
                    Mittlauer Weg 36<br />
                    63571 Gelnhausen</p>

                <h2>Kontakt</h2>
                <p>Telefon: 0175 1032571<br />
                    E-Mail: lex8787@web.de</p>

                <p>Quelle: <a href="https://www.e-recht24.de">e-recht24.de</a></p>
                <p>Bildquellen und Urheberrechtshinweise:</p>
                <p>Bilder sind von Pixabay, Lizenz: Pixabay License</p>
                <p>Pokemon Logo ist von seeklogo.com, Lizenz: Seeklogo License</p>
                <p>Alle Daten & Bilder von Pokemon sind von https://pokeapi.co</p>
            </div>`
}