import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [tailwindcss(), react()],
    build: {
        outDir: 'dist'
    },
    server: {
        proxy: {
            '/api': {
                target: process.env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:4000',
                changeOrigin: true,
                rewrite: (path) => path
            }
        },
        allowedHosts: [
            'tatty-connately-masako.ngrok-free.dev',
            'localhost',
            '127.0.0.1',
            '10.223.210.155'
        ]
    }
});

