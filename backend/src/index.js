import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';

// wczytuje zmienne środowiskowe
dotenv.config();

// tworzy instancję aplikacji, app to obiekt który reprezentuje web server
const app = express();
const PORT = process.env.PORT || 3000;

// middleware do parsowania JSON z body requestu
app.use(express.json());

// test endpoint - główna strona
app.get('/', (req, res) => {
    res.json({
        message: 'Kantor API Server',
        status: 'running'
    });
});

// test endpoint - sprawdzenie połączenia z bazą
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        
        res.json({
            status: 'OK',
            database: 'connected',
            test_query_result: rows[0].result,  
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'disconnected',
            error: error.message
        });
    }
});

// start serwera HTTP
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});