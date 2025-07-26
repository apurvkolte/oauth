import './load-env.js';
import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import { connectDB } from './lib/mongodb.js';
import userRoutes from './routes/user.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json()); // ✅ critical for req.body
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(compression());
app.use(express.static(__dirname + '/products'));

// Routes
app.use('/api/auth', userRoutes);

// Error handling
process.on('uncaughtException', err => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// (async () => {
//     try {
//         await connectDB();
//         console.log("Database connected successfully...!");
//     } catch (error) {
//         console.error("Database connection failed:", error.message);
//         process.exit(1);
//     }
// })();


const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

process.on('unhandledRejection', err => {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});