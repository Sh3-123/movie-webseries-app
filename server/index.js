const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const pool = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/user', require('./routes/user'));

app.get('/', (req, res) => {
    res.send('Movie Web Series API is running');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
