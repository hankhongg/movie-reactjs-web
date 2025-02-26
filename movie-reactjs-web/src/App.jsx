import React from "react";
import Search from "./components/Search";
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

  const fetchMovies = async () => {
    try {
      const endPoint=`${BASE_API_KEY}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok){
        throw new Error('Something went wrong while fetching data');
      }
      const data = await response.json();
      if (data.respone === false){
        setErrorMessage(data.Error || 'Something went wrong while fetching data');
      }
    } catch (error) {
      console.log({error});
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="wrapper">
      <header>
        <img className="w-100 h-100" src="./movies-banner.jpg" alt="Movies Banner"/>
        <h1>
          Find <span className="text-gradient">Movies</span> that you'd love here without efforts!
        </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </header>
      
      <section>
        <h2 className='all-movies'>
          All Movies
        </h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </section>
    </div>
  )
}

export default App