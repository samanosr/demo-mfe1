import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  base: 'http://localhost:5002/',
  plugins: [
    federation({
      name: 'remoteApp2',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './UserStats': './src/components/UserStats.tsx',
        './AnalyticsDashboard': './src/components/AnalyticsDashboard.tsx',
      },
      remotes: {
        remoteApp: 'http://localhost:5001/mf-manifest.json',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
    react(),
  ],
  server: {
    port: 5002,
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
