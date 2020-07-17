const searchInput = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn');
const output = document.querySelector('.output');

searchBtn.addEventListener('click', suggestSongs);
document.addEventListener('keyup', function(e) {
    if(e.keyCode ===13) {
        suggestSongs();
    }
})

// function for suggesting songs based on user search
function suggestSongs() {
    // checks if there's already something in the output and clears it out before doing a new search
    if(output.innerHTML != '') {
        output.classList.remove('active');
        output.innerHTML = '';
    }

    var suggestURL = 'https://api.lyrics.ovh/suggest/' + searchInput.value;
    fetch(suggestURL)
    .then((response) => response.json())
    .then((data) => {
        // loop through the data array and do something with the data at each index. The object from the API is called data, also...hence data.data
        for(i = 0; i < data.data.length; i++) {
            // use the += to add each of the data sets (with = only, it stops at the first one)
            // accessing the .title (song title) and .artist.name (artist name) from each data.data[i]
            output.innerHTML += `<p class="song-suggestion">
                <div id="title">
                    ${data.data[i].title}
                </div>
                <div id="artist">
                    ${data.data[i].artist.name}
                </div>
                </p><br>`;
            // add the active class so the output slides up
            output.classList.add('active');
        }
    })
}

// get the title that the user clicks on and find its lyrics
output.addEventListener('click', function(event) {
    const song = event.target;
    const title = song.textContent;
    // the title is in its own div with id of #title, and this grabs the div containing the artist name next to it
    const artist = song.nextElementSibling.textContent;

    // alright, we got the target...now let's find the lyrics by adding it to the api URL
    const lyricsURL = 'https://api.lyrics.ovh/v1/' + artist + '/' + title;

    // time to fetch the lyrics!
    fetch(lyricsURL)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.lyrics)
        output.innerHTML = `
            <h2>${title} - ${artist}</h2>
            <br>
            ${data.lyrics.replace(/\n/g, '<br>')}
            `;
    })
    .catch((error) => output.innerHTML = 'We couldn\'t find those lyrics. Bummer! Try a different song');
})