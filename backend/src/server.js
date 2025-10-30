// src/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/error.middleware.js';
import http from 'http';
import { initSocket } from './socket/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // Dùng server
const io = initSocket(server);        // Gắn Socket.IO vào server

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Static files
app.use('/sounds', express.static(path.join(__dirname, '../public/sounds')));
app.use('/avatars', express.static(path.join(__dirname, '../public/avatars')));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Khởi động
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected successfully.');

    const PORT = process.env.PORT || 5000;
    
    server.listen(PORT, () => {
      console.log(`Server + Socket.IO running on http://localhost:${PORT}`);
      console.log(`WebSocket ready at ws://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
};

startServer();