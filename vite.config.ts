/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { target: 'es2019' },
  test: { environment: 'jsdom', include: ['tests/**/*.test.{ts,tsx}'] },
});
