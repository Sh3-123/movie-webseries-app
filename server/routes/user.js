const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const pool = require('../db'); // Replaced by localDB
const localDB = require('../utils/localDB');

// @route   GET api/user/profile
// @desc    Get user profile with watched and saved lists
// @access  Protected
router.get('/profile', auth, async (req, res) => {
    try {
        const user_id = req.user.id;

        // Fetch user data
        const user = localDB.findUserById(user_id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Fetch watched content
        const watched = localDB.getWatched(user_id);

        // Fetch saved content
        const saved = localDB.getSaved(user_id);

        res.json({
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            },
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

        // Check if already watched and add
        const success = localDB.addWatched(user_id, content_id, type);

        if (!success) {
            return res.status(400).json({ msg: 'Already in watched list' });
        }

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

        localDB.removeWatched(user_id, content_id);
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

        const success = localDB.addSaved(user_id, content_id, type);

        if (!success) {
            return res.status(400).json({ msg: 'Already saved' });
        }

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

        localDB.removeSaved(user_id, content_id);
        res.json({ msg: 'Removed from saved list' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
