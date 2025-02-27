import React from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";
import { useEffect, useState } from "react";

// API - Application Programming Interface - a set of rules that allows one software application to talk to another

const BASE_API_KEY= 'https://api.themoviedb.org/3';
const API_KEY= import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}



const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');



  // debounce search term to avoid API call on each key press if the user stop typing for 500ms
  useDebounce(() => 
    setDebouncedSearchTerm(searchTerm), 500, [searchTerm]
  );

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endPoint= query ? `${BASE_API_KEY}/search/movie?query=${encodeURIComponent(query)}` :`${BASE_API_KEY}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok){
        throw new Error('Something went wrong while fetching data');
      }
      const data = await response.json();
      if (data.respone === false){
        setErrorMessage(data.Error || 'Something went wrong while fetching data');
        setMovies([]);
        return;
      }
      setMovies(data.results || []);
      // update search count
      if (query && data.results.length > 0){ // if query is not empty and we have some results
        await updateSearchCount(query, data.results[0]); // await if needed since this is an async function
      }
    } catch (error) {
      console.log({error});
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Something went wrong while fetching trending movies');
      return [];
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies()
  },[]);

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img className="w-100 h-100" src="./movies-banner.jpg" alt="Movies Banner"/>
          <h1>
            Find <span className="text-gradient">Movies</span> that you'd love here without efforts!
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        
        <section className='trending'>
          <h2>Trending Movies</h2>
          {trendingMovies.length > 0 && (
            <ul>
              {trendingMovies.map((movie, index) => {
                return (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title}/>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className='all-movies'>
          <h2>
            All Movies
          </h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p> ) : (
              <ul>
                {movies.map((movie) => {
                  return (
                    <MovieCard key={movie.key} movie={movie} />
                  )
                })}
              </ul>
            )
          }
        </section>
      </div>
    </main>
  )
}

export default App