import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tsconfigPaths from 'vite-tsconfig-paths';
import Sonda from 'sonda/vite';

const isDebug = false

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
        enabled: isDebug
      })
    ],
    build: {
      sourcemap: isDebug
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        "@tabler/icons-react": '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
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