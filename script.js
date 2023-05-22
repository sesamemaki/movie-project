"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const actorsContainer = document.getElementById("actorsContainer");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  // console.log(movies)
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
  // console.log(movieRes)
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
  // const data = await res.json();
  // console.log(data.results);
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

//Actors Page
const actorsButton = document.getElementById("actorsButton");

//function for listing actors on the Actors Page
const actorsList = async () => {
  const actors = await fetchActors();
  renderActors(actors);
  // console.log(actors);
};

actorsButton.addEventListener("click", actorsList);

//function for fetching actors
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results);
  return data.results;
};

//function for fetching one actor
const fetchActor = async (person_id) => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

//function for actor infos
const actorInfo = async (actor) => {
  // console.log(actor);
  const actorRes = await fetchActor(actor.id);
  renderActor(actorRes);
};

//Function for creating Actor page
const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  const actorsContainer = document.createElement("div");
  actorsContainer.setAttribute("class", "actorsList");

  actors.map((actor) => {
    const actorCard = document.createElement("div");
    actorCard.innerHTML = `<div class="card mb-3" style="width: 12rem;">
    <img id="actor-img" src="${
      actor.profile_path == null
        ? "images/avatar.svg"
        : PROFILE_BASE_URL + actor.profile_path
    }">
      <div class="card-body">
      <h5 class="card-title">${actor.name}</h5>
      </div>
      </div> `;

    actorCard.addEventListener("click", () => {
      actorInfo(actor);
      // console.log(actors);
    });

    actorsContainer.appendChild(actorCard);
    CONTAINER.appendChild(actorsContainer);
  });
};

//function for rendering single actor info
const renderActor = (actor) => {
  // console.log(actor);
  CONTAINER.innerHTML = "";
  CONTAINER.innerHTML = `
  <div class="row justify-content-center">
  <div class="actorDiv">
      <img id="actor-img" src="${
        actor.profile_path == null
          ? "images/avatar.svg"
          : PROFILE_BASE_URL + actor.profile_path
      }">
      </div>
      <div class="col-md-8">
      <h5 id="actor-name">${actor.name}</h5>
      <p id="actor-gender"><h3>Gender:</h3><p class="info"> ${
        actor.gender == 1 ? "Female" : "Male"
      }</p></p>
      <p id="actor-popularity"><h3>Popularity:</h3> <p class="info">${
        actor.popularity
      }</p></p>
      <p id="actor-birthday"><h3>Birthday:</h3> <p class="info">${
        actor.birthday == null ? "-" : actor.birthday
      }</p></p>
      <p id="actor-deathday"><h3>Deathday:</h3> <p class="info">${
        actor.deathday == null ? "-" : actor.deathday
      }</p></p>
      <h3>Biography</h3>
      <p class="info" id="biography">${
        actor.biography == "" ? "-" : actor.biography
      }</p></div><div>
      </div>
      <h3> Related Movies:</h3>
      <div class="row justify-content-center" id="knownFor"></div></div>`;
};
document.addEventListener("DOMContentLoaded", autorun);
