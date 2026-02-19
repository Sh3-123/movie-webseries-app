import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Details from './pages/Details';
import Lists from './pages/Lists';
import Search from './pages/Search';
import './index.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/series" element={<Home type="series" />} />
              <Route path="/movies" element={<Home type="movie" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/watched" element={<Lists type="watched" />} />
              <Route path="/saved" element={<Lists type="saved" />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
