"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
let $searchInput = $("#searchForm-term").val()

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm($searchInput) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let $showObj = await axios.get(`http://api.tvmaze.com/search/shows?q=${$searchInput}`, {
    headers: { Accept: "application/json" }
  })

  let showData = $showObj.data
  let showArr = showData.map(({ show }) => ({
    id: show.id,
    name: show.name,
    summary: show.summary,
    image: show.image && show.image.medium ? show.image.medium : 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
  }))
  return showArr;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    // let showId = show.show.id;
    // let showName = show.show.name;
    // let showSummary = show.show.summary;
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
           alt=${show.name}
           src="${show.image}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

$showsList.on("click", "button", async function (e) {
  let showIdBtnReturn = e.target.parentElement.parentElement.parentElement.getAttribute("data-show-id")

  let episodes = await getEpisodesOfShow(showIdBtnReturn);

  populateEpisodes(episodes);
})

async function getEpisodesOfShow(id) {
  let objOfEps = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`, { headers: { Accept: "application/json" } });
  console.log("obj of eps from axios = ", objOfEps)

  let arrayOfEps = objOfEps.data;
  console.log("array of eps = ", arrayOfEps)

  console.log("one element = ", arrayOfEps[0])
  console.log("one element id =", arrayOfEps[0].id)

    let epArr = arrayOfEps.map(episode => ({
      epId: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
  }))

  return epArr;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {

  /* unhide episodes area */
  $episodesArea.css("display", "block");
  $episodesArea.empty();

  /* iterate over episodes argument
  for every episode, add list item containing name, season, and episode number
  append every list item to unhidden episode area */

  for (let ep of episodes) {
    const $ep = $(
      `<li>${ep.name} (season: ${ep.season}, number: ${ep.number})</li>`
    )
    $episodesArea.append($ep)
  }

}
