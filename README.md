# 🔥 Pokédex App

A modern, interactive Pokémon encyclopedia that presents all Pokémon from the first generation and beyond.

![Pokedex Preview](./assets/img/pokeball.png)

## ✨ Features

### 🎯 Core Features
- **📱 Responsive Design** - Optimized for all devices (Desktop, Tablet, Mobile)
- **🔍 Live Search** - Real-time filtering of Pokémon list
- **📊 Detail View** - Comprehensive information for each Pokémon
- **⚡ Lazy Loading** - Performant data loading with "Load More" button
- **🔄 Evolution Chains** - Visualization of Pokémon evolutions

### 🎨 Design Highlights
- **🌙 Dark Theme** - Modern, dark design
- **🌈 Type Color Coding** - Color-coded Pokémon types
- **✨ Animations** - Smooth hover effects and transitions
- **📐 Clean Layout** - Clear and user-friendly interface

### 🔍 Pokémon Details
- **📏 Height & Weight** - Physical characteristics
- **⚔️ Base Stats** - HP, Attack, Defense, Speed etc.
- **🎯 Abilities** - List of all Pokémon abilities
- **🔄 Evolution Tree** - Complete evolution chains
- **🏷️ Types** - Primary and secondary Pokémon types

## 🛠️ Technical Details

### 💻 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **API**: [PokéAPI](https://pokeapi.co/) - RESTful API for Pokémon data
- **Design**: CSS Grid, Flexbox, Custom Properties
- **Icons**: SVG icons for Pokémon types

### 📁 Project Structure
```
pokedex/
├── index.html              # Main page
├── impressum.html          # Legal notice/Privacy
├── style.css              # Main styling
├── script.js              # Core JavaScript logic
├── assets/
│   ├── img/               # Images and logos
│   ├── icons/             # Type icons (SVG)
│   └── fonts/             # Fonts
├── scripts/
│   ├── templates.js       # HTML template functions
│   └── impressum.js       # Legal notice specific functions
└── styles/
    ├── standard.css       # Base styling
    ├── header_main_footer.css # Layout components
    ├── icons.css          # Icon styling
    └── impressum.css      # Legal notice styling
```

### 🔧 Main Functions (JavaScript)

#### API Integration
```javascript
// Asynchronous data loading from PokéAPI
async function loadPokemon() {
    const data = await fetchPokemonList();
    const detailDataList = await fetchAllDetails(data.results);
    // ... further processing
}
```

#### Responsive Design
```css
/* Mobile-First Approach */
@media (max-width: 768px) {
    .pokemon-details { /* Mobile adjustments */ }
}
```

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls)

### 🔽 Installation
1. **Clone repository**
   ```bash
   git clone https://github.com/b-rich-dev/pokedex.git
   cd pokedex
   ```

2. **Start project**
   ```bash
   # Simply open index.html in a browser
   # OR with a local server (recommended):
   
   # With Python
   python -m http.server 8000
   
   # With Node.js (npx)
   npx serve
   
   # With PHP
   php -S localhost:8000
   ```

3. **Open**
   - Open browser and navigate to `http://localhost:8000`
   - Or directly open `index.html` by double-clicking

## 📱 Usage

### 🔍 Search Pokémon
1. Use search field in navigation
2. Enter name (e.g. "Pikachu")
3. Results are filtered live

### 📊 Show Details
1. Click on a Pokémon card
2. Modal with detail view opens
3. Navigate between tabs: **Main**, **Stats**, **Evo Chain**

### ⏭️ Load More Pokémon
1. "Load More Pokémon" button at the end of the list
2. Automatically loads the next 20 Pokémon

## 🌐 API Reference

This app uses the [PokéAPI](https://pokeapi.co/):

```javascript
// Base endpoints
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Load Pokémon list
GET /pokemon?limit=20&offset=0

// Pokémon details
GET /pokemon/{id}

// Species information
GET /pokemon-species/{id}

// Evolution chains
GET /evolution-chain/{id}
```

## 📄 Browser Support

| Browser | Version | Status |
|---------|---------|---------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |

## 🤝 Contributing

Contributions are welcome! Please note:

1. **Fork** the repository
2. **Create** branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### 🐛 Bug Reports
- Use GitHub Issues
- Describe the problem in detail
- Add screenshots (if relevant)

## 📞 Contact

**Eugen Birich**
- 📧 Email: [info@birich.it](mailto:info@birich.it)
  
## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **[PokéAPI](https://pokeapi.co/)** - For the comprehensive and free Pokémon API
- **[Seeklogo](https://seeklogo.com/)** - For the Pokémon logos
- **[Pixabay](https://pixabay.com/)** - For additional images
- **Developer Akademie** - For training and support

## 🔄 Version History

### Version 1.0.0 (2025-11-12)
- ✅ Initial version
- ✅ Pokémon list with search
- ✅ Detail view with stats
- ✅ Evolution chains
- ✅ Responsive design
- ✅ Shiny hover effects

---

![Powered by PokéAPI](https://img.shields.io/badge/Powered%20by-PokéAPI-red?style=for-the-badge&logo=pokemon)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)