// backend/api/index.js
import serverless from 'serverless-http';
import app from '../app.js';

// Export Vercel handler
export default serverless(app);
// (Vercel also supports named export: export const handler = serverless(app))
