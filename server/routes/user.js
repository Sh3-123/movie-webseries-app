const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

// @route   GET api/user/profile
// @desc    Get user profile with watched and saved lists
// @access  Protected
router.get('/profile', auth, async (req, res) => {
    try {
        const user_id = req.user.id;

        // Fetch user data
        const [users] = await pool.query('SELECT firstName, lastName, email, phone FROM app_users WHERE id = ?', [user_id]);
        const user = users[0];

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Fetch watched content
        const [watched] = await pool.query('SELECT * FROM app_watched WHERE user_id = ? ORDER BY watched_at DESC', [user_id]);

        // Fetch saved content
        const [saved] = await pool.query('SELECT * FROM app_saved WHERE user_id = ? ORDER BY saved_at DESC', [user_id]);

        res.json({
            user,
            watched,
            saved
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/user/watched
// @desc    Mark content as watched
// @access  Protected
router.post('/watched', auth, async (req, res) => {
    try {
        const { content_id, type } = req.body;
        const user_id = req.user.id;

        // Check if already watched
        const [existing] = await pool.query('SELECT * FROM app_watched WHERE user_id = ? AND content_id = ?', [user_id, content_id]);
        if (existing.length > 0) {
            return res.status(400).json({ msg: 'Already in watched list' });
        }

        // Add to watched
        await pool.query('INSERT INTO app_watched (user_id, content_id, type) VALUES (?, ?, ?)', [user_id, content_id, type]);

        res.json({ msg: 'Added to watched list' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/user/watched/:content_id
// @desc    Remove content from watched
// @access  Protected
router.delete('/watched/:content_id', auth, async (req, res) => {
    try {
        const content_id = req.params.content_id;
        const user_id = req.user.id;

        await pool.query('DELETE FROM app_watched WHERE user_id = ? AND content_id = ?', [user_id, content_id]);

        res.json({ msg: 'Removed from watched list' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/user/saved
// @desc    Save content for later
// @access  Protected
router.post('/saved', auth, async (req, res) => {
    try {
        const { content_id, type } = req.body;
        const user_id = req.user.id;

        // Check if already saved
        const [existing] = await pool.query('SELECT * FROM app_saved WHERE user_id = ? AND content_id = ?', [user_id, content_id]);
        if (existing.length > 0) {
            return res.status(400).json({ msg: 'Already saved' });
        }

        // Add to saved
        await pool.query('INSERT INTO app_saved (user_id, content_id, type) VALUES (?, ?, ?)', [user_id, content_id, type]);

        res.json({ msg: 'Saved for later' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/user/saved/:content_id
// @desc    Remove content from saved
// @access  Protected
router.delete('/saved/:content_id', auth, async (req, res) => {
    try {
        const content_id = req.params.content_id;
        const user_id = req.user.id;

        await pool.query('DELETE FROM app_saved WHERE user_id = ? AND content_id = ?', [user_id, content_id]);

        res.json({ msg: 'Removed from saved list' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
