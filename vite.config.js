import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy sends /api calls to the Express server, so no CORS setup is needed in the browser.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
});
