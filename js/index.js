const cardBox = document.getElementById("cardBox");
let games = [];

const gameDetail = document.getElementById('gameDetail');

// API options
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '6f0fa0b4bdmshe78696eb36a8956p1cca64jsn5f2966c64021', // Replace with your API key
        'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
    }
};

// Fetch games based on category
async function getGames(id) {
    const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${id ? id : "mmorpg"}`,
        options
    );
    const data = await response.json();
    games = data;
    display(); // Render games after fetching them
}

// Fetch game details by ID
async function getDetails(gameId) {
    const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`,
        options
    );
    const data = await response.json();
    showCardDetails(data);
}

// Display the fetched games on the homepage
function display() {
    let gameCards = "";

    games.forEach((game) => {
        gameCards += `
            <div class="card bg-dark border-2 ms-3 mb-4" style="width: 19rem;" data-id="${game.id}">
                <img src="${game.thumbnail}" class="card-img-top p-2" alt="${game.title}">
                <div class="card-body w-100">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="card-title text-white">${game.title}</h3>
                        <span><button class="btn rounded-2 border-0 text-light ps-2 pe-2 pt-0 pb-0">free</button></span>
                    </div>
                    <p class="card-text text-white-50">${game.short_description}</p>
                </div>
                <hr class="text-black">
                <div class="card-body p-2 pt-0 d-flex justify-content-between align-items-center">
                    <span><button class="border-0 rounded-2 bg-dark bg-gradient text-light p-2 m-1">MMORPG</button></span>
                    <span><button class="border-0 rounded-2 bg-dark bg-gradient text-light p-2 m-1">PC (Windows)</button></span>
                </div>
            </div>`;
    });

    cardBox.innerHTML = gameCards;

    // Add event listeners to dynamically created cards
    const cards = cardBox.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute("data-id");
            window.location.href = `game-detail.html?gameId=${gameId}`;
        });
    });
}

// Show the details of a selected game on the details page
function showCardDetails(game) {
    let detailContent = `
        <div class="d-flex justify-content-start align-items-center mb-4">
            <img src="${game.thumbnail}" class="p-5" alt="Game Thumbnail">
            <div class="content text-white pl-5">
                <h3 class="text-white">Title: ${game.title}</h3>
                <p>Category: 
                    <span>
                        <button class="bg-info border-0 rounded-2 text-dark">${game.genre}</button>
                    </span>
                </p>
                <p>Platform: 
                    <span>
                        <button class="bg-info border-0 rounded-2 text-dark">${game.platform}</button>
                    </span>
                </p>
                <p>Status: 
                    <span>
                        <button class="bg-info border-0 rounded-2 text-dark">Live</button>
                    </span>
                </p>
                <p>${game.description}</p>
                <button class="bg-transparent border-warning btn-show rounded-2 p-2">
                    <a class="text-white text-decoration-none" href="${game.game_url}" target="_blank">Show Game</a>
                </button>
            </div>
        </div>`;

    if (gameDetail) {
        gameDetail.innerHTML = detailContent;
    }
}

// Handle the URL parameter for gameId on the 'game-detail.html' page
if (window.location.pathname === '/game-detail.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    
    if (gameId) {
        getDetails(gameId);  // Fetch and display game details if gameId exists
    } else {
        console.error("Game ID not found in URL.");
    }
}



// Add event listeners to category buttons to filter games by category
const categoryButtons = document.querySelectorAll('.nav-link');
categoryButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        getGames(btn.innerHTML); // Fetch and display games based on the selected category
    });
});

// Initialize the page with default category (MMORPG)
getGames();  // Default category is MMORPG
