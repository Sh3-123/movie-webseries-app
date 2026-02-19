const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
require('dotenv').config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_URL = `http://www.omdbapi.com/`;

// @route   GET api/movies/search/:query
// @desc    Search movies/series
// @access  Public
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const type = req.query.type; // movie, series, episode

        let url = `${OMDB_URL}?s=${query}&apikey=${OMDB_API_KEY}`;
        if (type) {
            url += `&type=${type}`;
        }

        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/movies/detail/:id
// @desc    Get movie details
// @access  Protected
router.get('/detail/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const season = req.query.season;

        let url = `${OMDB_URL}?i=${id}&plot=full&apikey=${OMDB_API_KEY}`;
        if (season) {
            url += `&Season=${season}`;
        }

        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/movies/popular
// @desc    Get popular/recent movies (simulated as OMDb doesn't have a 'popular' endpoint, we might search for a common term or year)
// @access  Public
router.get('/popular', async (req, res) => {
    try {
        // Simulating popular by searching for a common term like "avengers" or year "2024"
        // In a real app with OMDb, we can't easily get "popular". Only search.
        // We will fetch a few specific searches to populate the home page.
        const searchTerms = ['avengers', 'star wars', 'harry potter', 'matrix'];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

        const response = await axios.get(`${OMDB_URL}?s=${randomTerm}&type=movie&apikey=${OMDB_API_KEY}`);
        const seriesResponse = await axios.get(`${OMDB_URL}?s=${randomTerm}&type=series&apikey=${OMDB_API_KEY}`);

        res.json({
            movies: response.data.Search || [],
            series: seriesResponse.data.Search || []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
