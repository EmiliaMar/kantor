import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: 'Kantor API Server',
        status: 'running',
        version: '1.0.0'
    });
});

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

app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint nie znaleziony',
        path: req.path
    });
});

app.use((err, req, res, next) => {
    console.error('Błąd:', err.stack);
    res.status(500).json({
        success: false,
        error: 'internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Auth test: http://localhost:${PORT}/api/auth/test`);
});