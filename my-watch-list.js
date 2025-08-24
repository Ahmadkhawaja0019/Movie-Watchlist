const movieContainerWatchlist = document.getElementById("movie-container-watchlist")
const emptyStateWatchlist = document.getElementById("empty-state-watchlist")

let watchlistMovies = JSON.parse(localStorage.getItem("myWatchlist")) || [];

async function watchlistSearch() {
    let watchlistFromLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))
    
    if (watchlistFromLocalStorage.length > 0) {
        emptyStateWatchlist.style.display = "none"
        watchlistMovies = watchlistFromLocalStorage

        const watchlistMovieDetails = await Promise.all(
            watchlistFromLocalStorage.map((movie) => {
                return (fetch(`https://www.omdbapi.com/?apikey=ea7a8ed0&i=${movie}&plot=short`)
                .then(response => response.json()))
            })
        )

        const htmlText = watchlistMovieDetails.map(renderWatchlistMovie).join("");
        movieContainerWatchlist.innerHTML = htmlText;
    }else {
        movieContainerWatchlist.innerHTML = "";
        emptyStateWatchlist.style.display = "grid"
    }
}

function renderWatchlistMovie(movie) {
    const poster =  movie.Poster && movie.Poster !== "N/A" ? 
                movie.Poster : "data:image/svg+xml;utf8,\
                            <svg xmlns='http://www.w3.org/2000/svg' width='172' height='240'>\
                            <rect width='100%' height='100%' fill='%23202028'/>\
                            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%238c8c94' font-family='sans-serif' font-size='14'>No Poster</text>\
                            </svg>"
    const rating = (movie.imdbRating && movie.imdbRating !== "N/A") ? `⭐ ${movie.imdbRating}` : "⭐ N/A"
    const runtime = (movie.Runtime && movie.Runtime !== "N/A") ? movie.Runtime : ""
    const genre = (movie.Genre && movie.Genre !== "N/A") ? movie.Genre : ""
    const plot = (movie.Plot && movie.Plot !== "N/A") ? movie.Plot : "Plot unavailable."

    return `
        <article class="movie movie-watchlist">
            <img class="poster" src="${poster}" alt="${movie.Title} poster"/>
            <div class="description">
                <div class="row1">
                    <h3 class="title">${movie.Title}</h3>
                    <span class="rating">${rating}</span>
                </div>
                <div class="row2">
                    <span>${runtime}</span>
                    <span>${genre}</span>
                </div>
                <p class="plot">${plot}</p>
            </div>
            <button class="remove-btn" data-id="${movie.imdbID}" aria-label="remove from watchlist"><i class="fa-solid fa-circle-minus"></i> Remove</button>
        </article>
    `
}

document.addEventListener("click", (e) => {
    if (e.target.matches(".remove-btn")) {
        const id = e.target.dataset.id;
        watchlistMovies = watchlistMovies.filter(movieId => movieId !== id);
        
        localStorage.setItem("myWatchlist", JSON.stringify(watchlistMovies));
        watchlistSearch()
    }
})

document.addEventListener("DOMContentLoaded", () => {
    watchlistSearch()
})