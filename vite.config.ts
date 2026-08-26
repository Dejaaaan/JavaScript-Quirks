import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

function devServerTimestampPlugin(): Plugin {
  return {
    name: 'dev-server-timestamp',
    configureServer() {
      const now = new Date();
      console.log(`\n==================================================`);
      console.log(`⚡ [Dev Server] Started at: ${now.toISOString()} | Local: ${now.toLocaleString()}`);
      console.log(`==================================================\n`);
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      devServerTimestampPlugin(),
      react(),
      tailwindcss(),
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: './src/paraglide',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('prismjs')) {
                return 'vendor-prism';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
