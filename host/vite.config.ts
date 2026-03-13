import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {
        remoteApp: {
          type: 'module',
          name: 'remoteApp',
          entry: 'http://localhost:5001/remoteEntry.js',
          entryGlobalName: 'remoteApp',
          shareScope: 'default',
        },
        remoteApp2: {
          type: 'module',
          name: 'remoteApp2',
          entry: 'http://localhost:5002/mf-manifest.json',
          entryGlobalName: 'remoteApp2',
          shareScope: 'default',
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
    react(),
  ],
  server: {
    port: 5000,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
});
