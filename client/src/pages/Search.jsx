import React, { useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        try {
            const res = await axios.get(`/api/movies/search/${query}`);
            if (res.data.Search) {
                setResults(res.data.Search);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', padding: '100px 20px' }}>
            <Nav />
            <div className="container">
                <form onSubmit={handleSearch} style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for movies, series..."
                        style={{
                            flex: 1,
                            padding: '15px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '1.2rem',
                            backgroundColor: '#333',
                            color: 'white'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '1.2rem' }}>Search</button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                    {results.map(item => (
                        <div
                            key={item.imdbID}
                            onClick={() => navigate(`/details/${item.imdbID}`)}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                                alt={item.Title}
                                style={{ width: '100%', borderRadius: '4px' }}
                            />
                            <p style={{ color: 'white', marginTop: '10px', fontSize: '0.9rem', textAlign: 'center' }}>
                                {item.Title} ({item.Year})
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
