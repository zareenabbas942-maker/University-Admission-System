import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { router } from './server/routes';
import { seedInitialData } from './server/seed';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize database seed
  try {
    await seedInitialData();
    console.log('Initial university seed data verified/loaded.');
  } catch (err) {
    console.error('Error seeding initial data:', err);
  }

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Mount API Endpoints
  app.use('/api', router);

  // Vite middleware in dev / static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`University Admission Management System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
