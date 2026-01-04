import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  // Note: Vite automatically exposes environment variables prefixed with VITE_ via import.meta.env
  // No need to manually define import.meta.env.* variables
  // For process.env usage in services, we use import.meta.env.VITE_* instead
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
