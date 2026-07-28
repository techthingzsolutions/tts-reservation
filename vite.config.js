import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const projectRoot = process.cwd();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    // Pin the API origin so MSW matches the same absolute URLs in tests as it
    // does in the browser.
    env: {
      VITE_API_URL: 'http://localhost:8000/api',
      VITE_USE_MOCK_API: 'true',
      VITE_DEFAULT_TENANT_SLUG: 'demo-salon',
    },
  },
});
