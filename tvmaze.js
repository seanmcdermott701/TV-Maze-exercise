"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodeList = $("#episodes-list")

async function getShowsByTerm(term) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  return res.data.map(res => {
    let show = res.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : 'https://icons8.com/icon/Dr6ZRXLR8tfR/page-not-found'
    }
  });
}


function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" style="background-color: rgb(28, 124, 253)">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  let term = $("#search-query").val();
  term = '';
});


async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return res.data.map((episode) => {
    return {
      id: episode.id,
      number: episode.number,
      name: episode.name,
      season: episode.season
    }
  })
}


function populateEpisodes(episodes) {
  $episodeList.empty()
  for (let episode of episodes) {
    const $e = $(
      `<li>
      ${episode.name}, Season (${episode.season}), episode ${episode.number}
      </li>`
    );
    $episodeList.append($e);
  }
  $episodesArea.show();
}

// Had to consult the solution for the higher level id location.
async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest("[data-show-id]").data("show-id");
  console.log(showId)
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on('click', '.Show-getEpisodes', getEpisodesAndDisplay);