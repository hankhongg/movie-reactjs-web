import React from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

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
    } catch (error) {
      console.log({error});
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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
        
        <section className='all-movies'>
          <h2 className="mt-[50px]">
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