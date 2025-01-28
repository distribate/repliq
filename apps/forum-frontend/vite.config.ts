import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import svg from '@neodx/svg/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i,
      exclude: undefined,
      include: undefined,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: false,
        plugins: [],
      },
      png: {
        quality: 100,
      },
      jpeg: {
        quality: 100,
      },
      jpg: {
        quality: 100,
      },
      tiff: {
        quality: 100,
      },
      gif: {},
      webp: {
        lossless: true,
      },
      avif: {
        lossless: true,
      },
      cache: false,
      cacheLocation: undefined,
    }),
    TanStackRouterVite(),
    svg({
      root: '../../packages/assets/svgs',
      group: true,
      output: 'public/sprites',
      fileName: '{name}.{hash:8}.svg',
      metadata: {
        path: '../../packages/shared/ui/sprite.gen.ts',
        runtime: {
          size: true,
          viewBox: true,
        },
      },
    })
  ],
  server: {
    port: 3000,
  },
  preview: {
    allowedHosts: ['https://cc.fasberry.su', 'cc.fasberry.su'],
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  }
})