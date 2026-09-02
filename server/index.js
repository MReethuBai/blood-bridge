import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import hospitalRoutes from './routes/hospitals.js';
import donorRoutes from './routes/donors.js';
import requestRoutes from './routes/requests.js';
import { initSocketIO } from './sockets/socketHandler.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for Vite frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Initialize WebSockets
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
initSocketIO(io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    system: 'eRaktKosh AI Emergency Response Platform',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas!');

    // Auto-seed if database is fresh
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 eRaktKosh AI Backend running on port ${PORT}`);
      console.log(`⚡ WebSockets listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
