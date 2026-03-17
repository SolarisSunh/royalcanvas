import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { testDbConnection } from './db/sql.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'royalcanvas-api' });
});

app.get('/health/db', async (req, res) => {
  try {
    const dbResult = await testDbConnection();
    res.json({ status: 'ok', db: dbResult });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DB health check failed', err);
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`RoyalCanvas API running on port ${PORT}`);
});

