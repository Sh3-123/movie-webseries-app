const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
};

async function inspect() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables);

        const [columns] = await connection.query('DESCRIBE users');
        console.log('Users columns:', columns);

        connection.end();
    } catch (err) {
        console.error(err);
    }
}

inspect();
