const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');
const watchedFile = path.join(__dirname, '../data/watched.json');
const savedFile = path.join(__dirname, '../data/saved.json');

// Ensure files exist
const ensureFile = (file) => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '[]');
    }
};
ensureFile(usersFile);
ensureFile(watchedFile);
ensureFile(savedFile);

const readData = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${file}:`, err);
        return [];
    }
};

const writeData = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${file}:`, err);
    }
};

const localDB = {
    // Users
    getUsers: () => readData(usersFile),
    saveUser: (user) => {
        const users = readData(usersFile);
        users.push(user);
        writeData(usersFile, users);
        return user;
    },
    findUserByEmail: (email) => {
        const users = readData(usersFile);
        return users.find(u => u.email === email);
    },
    findUserById: (id) => {
        const users = readData(usersFile);
        return users.find(u => u.id === id);
    },

    // Create new user with ID
    createUser: (userData) => {
        const users = readData(usersFile);
        // Generate a random ID (string)
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const newUser = { id, ...userData };
        users.push(newUser);
        writeData(usersFile, users);
        return newUser;
    },

    // Watched List
    getWatched: (userId) => {
        const watched = readData(watchedFile);
        return watched.filter(w => w.user_id === userId).sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at));
    },
    addWatched: (userId, contentId, type) => {
        const watched = readData(watchedFile);
        const exists = watched.find(w => w.user_id === userId && w.content_id === contentId);
        if (exists) return false;

        const newEntry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            user_id: userId,
            content_id: contentId,
            type,
            watched_at: new Date().toISOString()
        };
        watched.push(newEntry);
        writeData(watchedFile, watched);
        return true;
    },
    removeWatched: (userId, contentId) => {
        let watched = readData(watchedFile);
        const initialLength = watched.length;
        watched = watched.filter(w => !(w.user_id === userId && w.content_id === contentId));
        if (watched.length === initialLength) return false;

        writeData(watchedFile, watched);
        return true;
    },

    // Saved List
    getSaved: (userId) => {
        const saved = readData(savedFile);
        return saved.filter(s => s.user_id === userId).sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
    },
    addSaved: (userId, contentId, type) => {
        const saved = readData(savedFile);
        const exists = saved.find(s => s.user_id === userId && s.content_id === contentId);
        if (exists) return false;

        const newEntry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            user_id: userId,
            content_id: contentId,
            type,
            saved_at: new Date().toISOString()
        };
        saved.push(newEntry);
        writeData(savedFile, saved);
        return true;
    },
    removeSaved: (userId, contentId) => {
        let saved = readData(savedFile);
        const initialLength = saved.length;
        saved = saved.filter(s => !(s.user_id === userId && s.content_id === contentId));
        if (saved.length === initialLength) return false;

        writeData(savedFile, saved);
        return true;
    }
};

module.exports = localDB;
