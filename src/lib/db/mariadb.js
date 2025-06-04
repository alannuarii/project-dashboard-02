// src/lib/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT); // pastikan ini angka
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

// Buat koneksi pool ke MariaDB
const pool = mysql.createPool({
    host,       // contoh: 'localhost' atau '127.0.0.1'
    port,       // contoh: 3306
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
