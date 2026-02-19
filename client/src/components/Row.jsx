import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Row({ title, keyword, isLargeRow, type }) {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const cacheKey = `row_${keyword}_${title.replace(/\s+/g, '')}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                setMovies(JSON.parse(cachedData));
                // Optional: fetch in background to update cache? User requested persistent if offline.
                // Assuming we prioritize showing content immediately.
                // If we want to refresh cache, we can do it but for now just use cache first.
            }

            try {
                let request;
                let fetchKeyword = keyword;
                if (keyword === 'trending') fetchKeyword = 'avengers'; // Default trending keyword

                let url = `/api/movies/search/${fetchKeyword}`;
                if (type) {
                    url += `?type=${type}`;
                }

                request = await axios.get(url);

                if (request.data.Search) {
                    setMovies(request.data.Search);
                    localStorage.setItem(cacheKey, JSON.stringify(request.data.Search));
                }
            } catch (error) {
                console.error("Error fetching row", title, error);
            }
        }
        fetchData();
    }, [keyword, title]);

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">
                {movies.map(movie => (
                    <img
                        key={movie.imdbID}
                        onClick={() => navigate(`/details/${movie.imdbID}`)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x225?text=No+Poster"}
                        alt={movie.Title}
                    />
                ))}
            </div>
        </div>
    );
}

export default Row;
