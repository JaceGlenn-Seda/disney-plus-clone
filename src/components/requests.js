const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDisney: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=2`,
  fetchPixar: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=3`,
  fetchMarvel: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=420`,
  fetchStarWars: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_keywords=180547`,
  fetchNatGeo: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=2739`,
};

export default requests;