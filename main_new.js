const searchForm = document.querySelector("#music-search");
const searchResults = document.querySelector("#search-results");
const musicPlayer = document.querySelector("#music-player");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchBar = document.querySelector("#search-bar");
  const searchInput = searchBar.value;
  const searchValue = encodeURIComponent(searchInput);
  console.log(`Search: ${searchValue}`);

  if (searchValue === "") {
    searchBar.setCustomValidity("Please enter cool music to search");
    searchBar.reportValidity();
  } else {
    searchResults.replaceChildren();
    musicPlayer.replaceChildren();
    getItunesData(searchValue);
  }
});

// Helper function to create card elements
function createCardEl(type, classArray, parent) {
  let newElement = document.createElement(type);
  newElement.classList.add(...classArray);
  parent.appendChild(newElement);
  return newElement;
}

// Function to make a card given a song
function makeCard(song) {
  let card = document.createElement("div");
  card.classList.add("card", "col", "s12", "m9", "l4");

  let pic = createCardEl("img", ["card-image"], card);
  pic.src = song.artworkUrl100;

  let track = createCardEl("div", ["track-name"], card);
  let trackTitle = song.trackName;
  track.innerText = `"${trackTitle}"`;

  let name = createCardEl("div", ["artist-name"], card);
  let artName = song.artistName;
  name.innerText = artName;

  searchResults.appendChild(card);

  // let audioDiv = document.querySelector("#audio");
  // let nowPlay = document.querySelector("#nowPlay");

  card.addEventListener("click", function (event) {
    musicPlayer.replaceChildren();
    let audioDiv = createCardEl("audio", ["audio"], musicPlayer);
    audioDiv.src = song.previewUrl;
    audioDiv.controls = true;
    audioDiv.autoplay = true;
    let nowPlay = createCardEl("h6", ["nowPlay"], musicPlayer);
    nowPlay.innerText = `Now playing: "${song.trackName}" by ${song.artistName}`;
  });
}

// Function to fetch GET from iTunes API
function getItunesData(term) {
  let url =
    "https://itunes.apple.com/search?term=" + term + "&limit=24&entity=song";
  console.log(url);

  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.resultCount === 0) {
        let noResults = document.createElement("p");
        noResults.classList.add("noResults");
        noResults.innerText = `No results found! 😞
      Please search again.`;
        searchResults.appendChild(noResults);
        let losingHorn = document.createElement("audio");
        searchResults.appendChild(losingHorn);
        losingHorn.src = "The_Price_is_Right_Losing_Horn.mp3";
        losingHorn.autoplay = true;
      } else {
        for (let song of data.results) {
          makeCard(song);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}