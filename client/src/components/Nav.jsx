import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
    const [show, handleShow] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const { theme, cycleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            handleShow(true);
        } else {
            handleShow(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', transitionNavBar);
        return () => window.removeEventListener('scroll', transitionNavBar);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "WebSeries", path: "/series" },
        { name: "Movies", path: "/movies" },
        { name: "My List", path: "/saved" },
        { name: "History", path: "/watched" }
    ];

    // Helper for random color profile
    const getProfileColor = (name) => {
        const colors = ['#e50914', '#FFA500', '#008000', '#0000FF', '#800080'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const UserAvatar = ({ user, onClick }) => {
        const name = user?.firstName || user?.email || 'U';
        const initial = name.charAt(0).toUpperCase();
        const bgColor = getProfileColor(name);

        return (
            <div
                onClick={onClick}
                className="nav__avatar"
                style={{
                    backgroundColor: bgColor,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%', // Circle
                    cursor: 'pointer'
                }}
            >
                {initial}
            </div>
        );
    };

    return (
        <>
            <div className={`nav ${show && 'black'}`}>
                <div className="nav__contents container">
                    <div className="nav__left">
                        <div className="hamburger" onClick={toggleMenu}>
                            &#9776;
                        </div>
                        {/* Netflix Logo Removed as requested */}

                        <ul className="nav__links" style={{ marginLeft: '0' }}>
                            {navLinks.map((link) => (
                                <li key={link.name} className={location.pathname === link.path ? "active" : ""}>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="nav__right">
                        <Link to="/search" className="nav__icon" style={{ color: theme === 'light' ? '#000' : '#fff', marginRight: '20px' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </Link>

                        <div className="nav__icon theme-switch" onClick={cycleTheme} style={{ cursor: 'pointer', marginRight: '20px', color: theme === 'light' ? '#000' : '#fff' }}>
                            {theme === 'light' ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            )}
                        </div>

                        <div className="nav__icon" style={{ cursor: 'pointer', marginRight: '20px', color: theme === 'light' ? '#000' : '#fff' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>

                        {isAuthenticated ? (
                            <div className="nav__profile" onClick={() => navigate('/profile')}>
                                <UserAvatar user={user} />
                                <span className="nav__caret" style={{ color: theme === 'light' ? '#000' : '#fff' }}>▼</span>
                                <div className="nav__dropdown">
                                    <button onClick={handleLogout}>Sign out</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="side-menu"
                    >
                        <div className="side-menu__header">
                            <h2 style={{ color: '#e50914' }}>Menu</h2>
                            <span onClick={toggleMenu} className="close-btn">&times;</span>
                        </div>

                        {isAuthenticated && (
                            <div className="user-info">
                                <UserAvatar user={user} />
                                <div>
                                    <p>{user?.firstName} {user?.lastName}</p>
                                    <p className="email">{user?.email}</p>
                                </div>
                            </div>
                        )}

                        <ul className="side-menu__links">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} onClick={toggleMenu}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            {!isAuthenticated && (
                                <>
                                    <li><Link to="/login" onClick={toggleMenu}>Sign In</Link></li>
                                    <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
                                </>
                            )}
                            {isAuthenticated && (
                                <li style={{ marginTop: 'auto' }}>
                                    <button onClick={handleLogout} className="btn btn-secondary full-width">Sign Out</button>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
            {menuOpen && <div className="backdrop" onClick={toggleMenu}></div>}
        </>
    );
};


export default Nav;
