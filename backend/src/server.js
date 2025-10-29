import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route kiểm tra server
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Khởi động server
const startServer = async () => {
  try {
    // Kết nối database
    await connectDatabase();
    console.log('✅ Database connected successfully.');

    // Lắng nghe cổng
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  }
};

startServer();
