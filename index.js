const searchForm = document.getElementById("search-form")
const movieContainer = document.getElementById("movie-container")
const emptyState = document.getElementById("empty-state")
const failedSearch = document.getElementById("failed-search")

let watchlist = JSON.parse(localStorage.getItem("myWatchlist")) || []

searchForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const searchValue = document.getElementById('search-input').value.trim()

    if(searchValue){
        search(searchValue)
    }else {
        return
    }
})

async function search(value) {
    emptyState.style.display = "none"

    failedSearch.textContent = "Searching..."
    failedSearch.style.display = "block"
    movieContainer.innerHTML = "";

    try{
        const response = await fetch(`https://www.omdbapi.com/?apikey=ea7a8ed0&s=${encodeURIComponent(value)}`)
        const data = await response.json()
        
        if (data.Response === "False") {
            failedSearch.textContent = "Unable to find what you’re looking for. Please try another search..."
            return
        }

        const movieDetails = await Promise.all(
            data.Search.map((movie) => {
                return (fetch(`https://www.omdbapi.com/?apikey=ea7a8ed0&i=${movie.imdbID}&plot=short`)
                .then(response => response.json()))
            })
        )

        const htmlText = movieDetails.map(renderMovie).join("")
        movieContainer.innerHTML = htmlText

        failedSearch.style.display = "none"
    } catch (err) {
        failedSearch.textContent = "Something went wrong. Please try again."
        console.error(err);
    }
}

function renderMovie(movie) {
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
        <article class="movie">
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
            <button class="watch-btn" data-id="${movie.imdbID}" aria-label="Add to watchlist"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
        </article>
    `
}

document.addEventListener("click", (e) => {
    if (e.target.matches(".watch-btn")) {
        const id = e.target.dataset.id;

        if (!watchlist.includes(id)) {
            watchlist.unshift(id);
            localStorage.setItem("myWatchlist", JSON.stringify(watchlist));
        }
    }
})