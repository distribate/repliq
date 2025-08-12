import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tsconfigPaths from 'vite-tsconfig-paths';
import Sonda from 'sonda/vite';
import cssSourcemap from 'vite-plugin-css-sourcemap';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const host = env.VITE_APP_HOST
  const port = Number(env.VITE_APP_PORT)

  return {
    plugins: [
      vike(),
      react(),
      tsconfigPaths(),
      Sonda({
        enabled: false
      }),
      cssSourcemap()
    ],
    build: {
      sourcemap: true
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: [
        {
          find: '@tabler/icons-react',
          replacement: '@tabler/icons-react/dist/esm/icons/index.mjs'
        }
      ],
    },
    preview: {
      host,
      port,
      allowedHosts: true
    },
    server: {
      host,
      port,
      strictPort: true,
      allowedHosts: true
    }
  }
});