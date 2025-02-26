import React from 'react';

const MovieCard = ({movie: {title, vote_average, poster_path, release_date, popularity, original_language }}) => {
    return (
       <div className='movie-card'>
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movies.jpg"} alt={title}/>
            <h2 className="mt-4 text-white">
                {title}
            </h2>
            <div className="content">
                <div className="rating">
                    <img src="./star.svg" alt="Star Icon"/>
                    <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
                </div>
                <span>&#x2022;</span>
                <p className="lang">{original_language}</p>
                <span>&#x2022;</span>
                <p className="year">{release_date ? release_date.split('-')[0] : "N/A"}</p>
                <span>&#x2022;</span>
                <p className="text-white">{popularity ? popularity : "N/A"}</p>
            </div>
       </div>
    )
}

export default MovieCard;