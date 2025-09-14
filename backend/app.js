// backend/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import './src/db.js';
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import preorderRoutes from './src/routes/preorders.js';
import adminRoutes from './src/routes/admin.js';
import uploadRoutes from './src/routes/upload.js';
import Preorder from './src/models/Preorder.js';

const app = express();

// __dirname helper (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

// CORS: support one or many origins via CLIENT_ORIGIN="https://site1,https://site2"
const allowList = (process.env.CLIENT_ORIGIN || '*')
  .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowList.includes('*') || allowList.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`), false);
  },
  credentials: true
}));

// Static (ephemeral on Vercel; OK if you just serve)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limit
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 240, standardHeaders: true }));

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/preorders', preorderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Live counter
app.get('/api/stats/preorders/count', async (_req, res) => {
  const count = await Preorder.countDocuments({ status: { $ne: 'cancelled' } });
  res.json({ count });
});

export default app;
