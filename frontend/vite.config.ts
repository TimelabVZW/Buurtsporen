import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.txt'],
  server: {
    port: 3001,
    fs: {
      allow: ['.'] // Allow serving files from the root directory
    }
  }
});