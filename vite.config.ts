import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: () => '/api/v3',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (!req.url) return;
            const parsed = new URL(req.url, 'http://localhost');
            const endpoint = parsed.searchParams.get('endpoint');
            if (endpoint) {
              parsed.searchParams.delete('endpoint');
              proxyReq.path = `/api/v3/${endpoint}?${parsed.searchParams.toString()}`;
            }
          });
        },
      },
      '/api/rpc/eth': {
        target: 'https://cloudflare-eth.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/eth/, ''),
      },
      '/api/rpc/polygon': {
        target: 'https://polygon-rpc.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/polygon/, ''),
      },
      '/api/rpc/arbitrum': {
        target: 'https://arb1.arbitrum.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/arbitrum/, '/rpc'),
      },
      '/api/rpc/optimism': {
        target: 'https://mainnet.optimism.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/optimism/, ''),
      },
      '/api/rpc/base': {
        target: 'https://mainnet.base.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/base/, ''),
      },
      '/api/rpc/bsc': {
        target: 'https://bsc-dataseed1.binance.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/bsc/, ''),
      },
      '/api/rpc/avalanche': {
        target: 'https://api.avax.network',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/avalanche/, '/ext/bc/C/rpc'),
      },
      '/api/rpc/sepolia': {
        target: 'https://rpc.sepolia.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rpc\/sepolia/, ''),
      },
    },
  },
});
