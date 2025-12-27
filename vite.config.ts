import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid "cwd does not exist on type Process" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Vital: Polyfill process.env so the existing code (using process.env.API_KEY) works in browser build
      'process.env': env
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});