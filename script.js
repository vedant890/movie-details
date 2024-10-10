const API_KEY = "29c7e83";
const BASE_URL = "http://www.omdbapi.com";
const SEARCH_URL = `${BASE_URL}/?apikey=${API_KEY}&s=`;
const searchForm = document.getElementById("search-form");
const searchQuery = document.getElementById("query");
const movieContainer = document.getElementById("root");

let moviesList = [];
let currentPage = 1;
let isSearching = false;

// Fetch JSON data from URL
async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

const fetchAndDisplayMovies = async (url) => {
    const data = await fetchJson(url);
    if (data && data.Search) {
        renderMovies(data.Search);
    } else {
        renderMovies([]);
    }
};

const loadPageResults = (query, page) => {
    const url = `${SEARCH_URL}${query}&page=${page}`;
    fetchAndDisplayMovies(url);
};

const createMovieCard = (movie) =>
    `<div class="col">
          <div class="card">
            <a class="card-media" href="${movie.Poster}" target="_blank">
              <img src="${movie.Poster}" alt="${movie.Title}" width="100%" />
            </a>

            <div class="card-content">
              <div class="card-header">
                <div class="header-left">
                  <h3 style="font-weight: 600; color: #3d5afe;">${movie.Title}</h3>
                  <span style="color: #ff4081;">${movie.Year}</span>
                </div>
                <div class="header-right">
                  <a href="${movie.Poster}" target="_blank" class="btn">View Image</a>
                </div>
              </div>

              <div class="description">
                ${movie.Type}
              </div>
            </div>
          </div>
        </div>`;

const renderMovies = (items) => {
    let content = !isSearching ? movieContainer.innerHTML : "";
    if (items && items.length > 0) {
        items.forEach((item) => {
            let { Poster, Title, Year, Type } = item;

            Poster = Poster !== "N/A" ? Poster : "./img-01.jpeg";

            Title = Title.length > 20 ? Title.slice(0, 20) + "..." : Title;
            Type = Type || "Type not specified";

            const movieItem = {
                Poster,
                Title,
                Year,
                Type,
            };

            content += createMovieCard(movieItem);
        });
    } else {
        content += "<p>No results found!</p>";
    }

    movieContainer.innerHTML = content; // Inject content into container
};

const loadMoreMovies = () => {
    const searchTerm = searchQuery.value.trim();
    loadPageResults(searchTerm, ++currentPage);
};

const checkScrollAndLoadMore = () => {
    const docElement = document.documentElement;
    if (!isSearching && docElement.scrollTop + docElement.clientHeight >= docElement.scrollHeight - 5) {
        loadMoreMovies();
    }
};

searchForm.addEventListener("submit", async (e) => {
    isSearching = true;
    e.preventDefault();
    const searchTerm = searchQuery.value.trim();
    if (searchTerm) {
        movieContainer.innerHTML = ""; // Clear previous results
        currentPage = 1; // Reset page number
        fetchAndDisplayMovies(SEARCH_URL + searchTerm);
    }
    searchQuery.value = "";
});

window.addEventListener("scroll", checkScrollAndLoadMore);

function initialize() {
    isSearching = false;
    const popularMoviesURL = `${BASE_URL}/?i=tt3896198&apikey=${API_KEY}`;
    fetchAndDisplayMovies(popularMoviesURL);
}

initialize();
