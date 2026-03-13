import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  base: 'http://localhost:5001/',
  plugins: [
    federation({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './Counter': './src/components/Counter.tsx',
        './Card': './src/components/Card.tsx',
        './Store': './src/store.ts',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
    react(),
  ],
  server: {
    port: 5001,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
});
