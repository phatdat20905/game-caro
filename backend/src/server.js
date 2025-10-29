// src/server.js
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Auth API: /api/auth/register`);
    });
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
};

startServer();