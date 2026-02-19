import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Nav from '../components/Nav';
import { useNavigate } from 'react-router-dom';

const Lists = ({ type }) => {
    // type: 'watched' or 'saved'
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        async function fetchList() {
            if (!isAuthenticated) return;
            try {
                // Fetch user profile which contains the lists
                const res = await axios.get('/api/user/profile', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });

                const listData = type === 'watched' ? res.data.watched : res.data.saved;

                // Now fetch details for each item
                // Use Promise.all
                const detailsPromises = listData.map(item =>
                    axios.get(`/api/movies/detail/${item.content_id}`, {
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    })
                );

                const detailsRes = await Promise.all(detailsPromises);
                const fullItems = detailsRes.map(r => r.data);

                setItems(fullItems);
                setLoadingList(false);
            } catch (err) {
                console.error(err);
                setLoadingList(false);
            }
        }
        fetchList();
    }, [isAuthenticated, type]);

    const removeFromList = async (id) => {
        try {
            await axios.delete(`/api/user/${type}/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setItems(items.filter(item => item.imdbID !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || loadingList) return <div className="container" style={{ paddingTop: '100px', color: 'white' }}>Loading...</div>;

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', padding: '100px 20px 20px' }}>
            <Nav />
            <h1 style={{ color: 'white', marginBottom: '20px' }}>
                {type === 'watched' ? 'Watched Content' : 'My List'}
            </h1>

            {items.length === 0 ? (
                <p style={{ color: '#aaa' }}>No items found.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                    {items.map(item => (
                        <div key={item.imdbID} style={{ position: 'relative' }}>
                            <img
                                src={item.Poster}
                                alt={item.Title}
                                style={{ width: '100%', borderRadius: '4px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => navigate(`/details/${item.imdbID}`)}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFromList(item.imdbID); }}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer'
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Lists;
