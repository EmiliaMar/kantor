import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// database connection test
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Połączono z bazą MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error.message);
    return false;
  }
};

testConnection();

export default db;