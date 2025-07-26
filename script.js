const searchForm = document.getElementById("search-form")
const movieContainer = document.getElementById("movie-container")

searchForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const searchValue = document.getElementById('search-input').value.trim()
    if(searchValue){
        fetch(`https://www.omdbapi.com/?apikey=ea7a8ed0&s=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            let htmltext = ``
            for(let i = 0; i < data.Search.length; i++) {
                htmltext += `
                                <div class = "movie">
                                    <img class = "movie-image" src = "${data.Search[i].Poster}" alt="${data.Search[i].Title}">
                                    <div class = "movie-details">
                                        <p class = "movie-title">Title: ${data.Search[i].Title}</p>
                                        <p class = "movie-type">Type: ${data.Search[i].Type}</p>
                                        <p class = "movie-year">Year: ${data.Search[i].Year}</p>
                                    </div>
                                </div>
                            `    
            }
            movieContainer.innerHTML = htmltext
        })
    }
})