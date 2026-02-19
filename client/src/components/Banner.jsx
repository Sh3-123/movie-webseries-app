import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const cachedMovies = localStorage.getItem('banner_movies');
            if (cachedMovies) {
                setMovies(JSON.parse(cachedMovies));
            }

            try {
                const request = await axios.get('/api/movies/popular');
                if (request.data.movies && request.data.movies.length > 0) {
                    setMovies(request.data.movies);
                    localStorage.setItem('banner_movies', JSON.stringify(request.data.movies));
                }
            } catch (error) {
                console.error("Error fetching banner movies", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
            }, 10000); // 10 seconds
            return () => clearInterval(interval);
        }
    }, [movies]);

    const truncate = (string, n) => {
        return string?.length > n ? string.substr(0, n - 1) + '...' : string;
    };

    if (movies.length === 0) return <div className="banner skeleton"></div>;

    const movie = movies[currentIndex];

    const getHighResPoster = (url) => {
        if (!url) return '';
        return url.replace(/_SX300/g, '').replace(/_SX[0-9]+/g, '');
    };

    return (
        <header
            className="banner"
            onClick={() => navigate(`/details/${movie.imdbID}`)}
            style={{
                cursor: 'pointer',
                backgroundSize: 'cover',
                backgroundImage: `url("${getHighResPoster(movie?.Poster)}")`,
                backgroundPosition: 'top center', // Focus on top (heads)
            }}
        >
            <div className="banner__contents">
                <h1 className="banner__title">
                    {movie?.Title || movie?.Name || movie?.original_name}
                </h1>

                {/* Buttons Removed as requested */}

                <h1 className="banner__description">
                    {movie?.Plot ? truncate(movie?.Plot, 200) : ''}
                </h1>
            </div>

            <div className="banner--fadeBottom" />
        </header>
    );
};

export default Banner;
