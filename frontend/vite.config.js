/* eslint-disable no-undef */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
  ],

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'react-router-dom', '@ton/core', '@ton/crypto', '@tonconnect/ui-react'],
    exclude: [],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },

  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    allowedHosts: [
      'durov.online',
      'localhost',
      '6384-85-159-228-25.ngrok-free.app',
      // Добавьте ваш ngrok домен здесь при необходимости
    ],
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'http://bff:5000',
        changeOrigin: true,
        secure: false,
        // НЕ удаляем /api префикс, так как backend ожидает полный путь
      },
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          router: ['react-router-dom'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Используем стандартную минификацию esbuild (встроена в Vite)
    minify: true,
    target: 'es2015',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '/api'),
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
});
