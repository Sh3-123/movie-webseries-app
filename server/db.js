const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = mysql.createPool(dbConfig);

const createTables = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to Aiven MySQL database');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_watched (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                content_id VARCHAR(50),
                type VARCHAR(20), -- 'movie' or 'series'
                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_watch (user_id, content_id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_saved (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                content_id VARCHAR(50),
                type VARCHAR(20),
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_save (user_id, content_id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS app_watched_episodes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                series_id VARCHAR(50),
                season_number INT,
                episode_number INT,
                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_episode_watch (user_id, series_id, season_number, episode_number)
            )
        `);

        await connection.query(`
             CREATE TABLE IF NOT EXISTS app_watched_seasons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                series_id VARCHAR(50),
                season_number INT,
                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_season_watch (user_id, series_id, season_number)
            )
        `);

        console.log('Tables created or verified successfully');
        connection.release();
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();

module.exports = pool;
