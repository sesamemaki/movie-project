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
  const movieCast = await fetchCast(movie.id);
  renderMovie(movieRes, movieCast);
  // console.log(movieCast)
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
  console.log(movies);
  const myCarouselElement = document.querySelector("#carousel");

  const content = movies.map((movie) => {
    const movieDiv = document.createElement("div");
    const movieBtn = `
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#movieModal"
      >
        Details
      </button>`;
    movieDiv.innerHTML = ` 
    <div class="card" style="width: 18rem; margin-bottom: 10PX;">
      <img src="${
        BACKDROP_BASE_URL + movie.backdrop_path
      }" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title text-center">${movie.title}</h5>
        <p class="card-text">${movie.overview.slice(0, 100)}</p>
        <p class="card-text ">vote Average: ${movie.vote_average}</p>
        <p class="card-text">vote Count: ${movie.vote_count}</p>    
      </div>
    </div>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });

  myCarouselElement.innerHTML = "<div class='carousel'>" + content + "</div>";
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, movieCast) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               movie.backdrop_path == null
                 ? "images/movieLogo2.jpg"
                 : BACKDROP_BASE_URL + movie.backdrop_path
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
            <ul id="actors" class="list-unstyled list-group list-group-horizontal"></ul>
    </div>`;
  renderCast(movieCast);
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
//returns actorRes

const fetchActor = async (person_id) => {
  const url = constructUrl(`person/${person_id}`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data);
  return data;
};

//fetch function for movies of a actor
//returns movieRes
const fetchActorMovies = async (person_id) => {
  const url = constructUrl(`person/${person_id}/movie_credits`);
  const res = await fetch(url);
  const data = await res.json();
  const movieRes = data.cast;
  const knownFor = document.querySelector("#knownFor");
  const movieCardList = document.createElement("ul");
  movieCardList.setAttribute(
    "class",
    "list-unstyled list-group list-group-horizontal"
  );
  for (let i = 0; i <= 4; i++) {
    const movieCard = document.createElement("li");
    movieCard.innerHTML = `    
    <li class="list-group-item m-2">
    <img id="movie-img" src="${
      movieRes[i].backdrop_path == null
        ? "images/movieLogo2.jpg"
        : PROFILE_BASE_URL + movieRes[i].backdrop_path
    }" style="width: 20rem; height: 10rem"><h5 class="card-title">${
      movieRes[i].title
    }</h5>     
      </li>`;
    movieCardList.appendChild(movieCard);
    knownFor.appendChild(movieCardList);
    movieCard.addEventListener("click", () => {
      movieDetails(movieRes[i]);
    });
  }
};

//function for actor infos
const actorInfo = async (actor) => {
  // console.log(actor);
  const actorRes = await fetchActor(actor.id);
  // const movieRes = await fetchActorMovies(actor.id);
  // console.log(movieRes);
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
      <div class="row justify-content-center" id="knownFor">     
      </div>    
      </div>`;
  fetchActorMovies(actor.id);
};

//function for fetching movie cast

const fetchCast = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.cast);
  return data.cast;
};

// function for displaying cast of a movie

const renderCast = (movieCast) => {
  const cast = document.querySelector("#actors");
  movieCast.slice(0, 4).map((actor) => {
    const actorCard = document.createElement("li");
    actorCard.innerHTML = `  
    <li class="list-group-item m-2"><img id="actor-img" src="${
      actor.profile_path == null
        ? "images/avatar.svg"
        : PROFILE_BASE_URL + actor.profile_path
    }" style="width: 9rem;"><h5 class="card-title">${actor.name}</h5>     
      </li>
    `;
    cast.appendChild(actorCard);
    actorCard.addEventListener("click", () => {
      actorInfo(actor);
    });
  });

  // console.log(movieCast);
};

document.addEventListener("DOMContentLoaded", autorun);
