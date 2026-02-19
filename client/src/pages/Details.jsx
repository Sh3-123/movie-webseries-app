import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Nav from '../components/Nav';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [content, setContent] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [expandedSeason, setExpandedSeason] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDetails() {
            if (!id) return;
            try {
                // Fetch basic details
                const res = await axios.get(`/api/movies/detail/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                if (res.data.Response === 'False') {
                    throw new Error(res.data.Error || "Movie details not found");
                }
                setContent(res.data);
                setLocalLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    navigate('/login'); // Redirect to login if unauthorized
                }
                setError(err.message || "Failed to load content");
                setLocalLoading(false);
            }
        }
        if (isAuthenticated) fetchDetails();
        else if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [id, isAuthenticated, loading, navigate]);

    const toggleSeason = async (seasonNum) => {
        if (expandedSeason === seasonNum) {
            setExpandedSeason(null);
        } else {
            setExpandedSeason(seasonNum);
            // Fetch episodes if not already fetched (mocking cache logic or just fetch always for simplicity)
            // We need to store episodes per season.
            // Let's use a simple state object: seasonsData[seasonNum] = episodes
            // Actually, let's just fetch and store in a map.
        }
    };

    // Helper to fetch episodes for a season
    // Since OMDb requires separate call: ?i=ID&Season=N
    const [seasonEpisodes, setSeasonEpisodes] = useState({});

    const getEpisodes = async (seasonNum) => {
        if (seasonEpisodes[seasonNum]) return; // Already fetched
        try {
            // We need a backend proxy for this too? backend/detail/:id only returns main info.
            // We need a new backend route or reuse search?
            // OMDb usage: ?i=tt...&Season=1
            // My backend doesn't support this explicitly in `detail/:id`.
            // I should update backend or just use a workaround.
            // Workaround: `axios.get(OMDB)` directly? No, key is hidden.
            // I'll update backend to support season fetching.
            // GET /api/movies/detail/:id?season=X

            const res = await axios.get(`/api/movies/detail/${id}?season=${seasonNum}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setSeasonEpisodes(prev => ({ ...prev, [seasonNum]: res.data.Episodes }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSeasonClick = (num) => {
        toggleSeason(num);
        if (expandedSeason !== num) {
            getEpisodes(num);
        }
    };

    const [isWatched, setIsWatched] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const markUserAction = async (action, type) => {
        try {
            await axios.post(`/api/user/${action}`, {
                content_id: id,
                type: type
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            if (action === 'watched') setIsWatched(true);
            if (action === 'saved') setIsSaved(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Calculate seasonList properly
    const totalSeasons = content && content.totalSeasons ? parseInt(content.totalSeasons) : 0;
    const seasonList = [];
    for (let i = 1; i <= totalSeasons; i++) {
        seasonList.push(i);
    }

    if (loading || localLoading) return <div className="container" style={{ paddingTop: '100px', color: '#fff' }}>Loading...</div>;
    if (error) return <div className="container" style={{ paddingTop: '100px', color: '#fff' }}>Error: {error}</div>;
    if (!content) return <div className="container" style={{ paddingTop: '100px', color: '#fff' }}>Content not found</div>;

    const getHighResPoster = (url) => {
        if (!url) return '';
        return url.replace(/_SX300/g, '').replace(/_SX[0-9]+/g, '');
    };

    return (
        <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: '#fff' }}>
            <Nav />
            <div
                className="banner"
                style={{
                    height: '60vh',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(20,20,20,1) 100%), url(${getHighResPoster(content.Poster)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '0 4% 40px',
                    position: 'relative'
                }}
            >
                <div style={{ maxWidth: '800px', zIndex: 10 }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{content.Title}</h1>
                    <div style={{ margin: '20px 0', fontSize: '1.2rem', display: 'flex', gap: '20px', fontWeight: '600', color: '#ccc' }}>
                        <span>{content.Year}</span>
                        <span style={{ border: '1px solid #ccc', padding: '0 5px', fontSize: '1rem' }}>{content.Rated}</span>
                        <span>{content.Runtime}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => !isWatched && markUserAction('watched', content.Type)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            {isWatched ? '✓ Watched' : '▶ Mark as Watched'}
                        </button>
                        <button
                            onClick={() => !isSaved && markUserAction('saved', content.Type)}
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        >
                            {isSaved ? '✓ Saved' : '+ My List'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', marginTop: '-50px', position: 'relative', zIndex: 20 }}>
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <h3 style={{ borderLeft: '3px solid #e50914', paddingLeft: '10px', marginBottom: '20px' }}>Plot</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px', color: '#dedede' }}>{content.Plot}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', background: '#1f1f1f', padding: '20px', borderRadius: '8px' }}>
                        <p><strong>Genre:</strong> <span style={{ color: '#aaa' }}>{content.Genre}</span></p>
                        <p><strong>Director:</strong> <span style={{ color: '#aaa' }}>{content.Director}</span></p>
                        <p><strong>Actors:</strong> <span style={{ color: '#aaa' }}>{content.Actors}</span></p>
                        <p><strong>IMDb Rating:</strong> <span style={{ color: '#aaa' }}>{content.imdbRating}</span></p>
                    </div>

                    {['series', 'episode'].includes(content.Type) && totalSeasons > 0 && (
                        <div style={{ marginTop: '40px' }}>
                            <h2 style={{ marginBottom: '20px' }}>Seasons</h2>
                            {seasonList.map(num => (
                                <div key={num} style={{ marginBottom: '10px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                        onClick={() => handleSeasonClick(num)}
                                        style={{ padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2f2f2f', borderBottom: expandedSeason === num ? '1px solid #444' : 'none' }}
                                    >
                                        <span style={{ fontWeight: 'bold' }}>Season {num}</span>
                                        <span>{expandedSeason === num ? '▲' : '▼'}</span>
                                    </div>
                                    {expandedSeason === num && (
                                        <div style={{ padding: '20px' }}>
                                            {seasonEpisodes[num] ? (
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    {seasonEpisodes[num].map(ep => (
                                                        <div key={ep.imdbID} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span><strong>{ep.Episode}.</strong> {ep.Title}</span>
                                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>{ep.Released}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ color: '#aaa' }}>Loading episodes...</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;
