import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import tsconfigPaths from 'vite-tsconfig-paths';
import Sonda from 'sonda/vite';
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

function checkRuntime() {
  if (typeof Bun !== "undefined") {
    console.log("Running in Bun:", Bun.version);
  } else if (typeof process !== "undefined" && process.versions?.node) {
    console.log("Running in Node.js:", process.versions.node);
  } else {
    console.log("Unknown runtime");
  }
}

function onPreview(
  { prefixUrl, token }: { prefixUrl: string, token: string }
): Plugin {
  const name = "on-preview";

  return {
    name,
    configurePreviewServer(server) {
      server.httpServer.on("listening", async () => {
        try {
          const payload = {
            type: "on-preview",
            created_at: new Date(),
            data: null
          };

          const res = await fetch(`${prefixUrl}/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "TOKEN": token },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            console.log(`[${name}]:`, await res.json())
          }

          console.log(`[${name}]: Request sent after preview start:`, res.statusText);
        } catch (e) {
          console.error(`[${name}]: Failed to send request:`, e);
        }
      });
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', "PUBLIC_"])
  const host = env.VITE_APP_HOST
  const port = Number(env.VITE_APP_PORT)
  const token = env.VITE_SERVER_TOKEN;
  const prefixUrl = env.PUBLIC_ENV__API_PREFIX_URL;

  return {
    plugins: [
      tailwindcss(),
      vike(),
      react(),
      tsconfigPaths(),
      Sonda({ enabled: false }),
      onPreview({ prefixUrl, token }),
      viteStaticCopy({
        targets: [
          {
            src: 'dist/client/assets/sw.*.js',
            dest: '.',
            rename: 'worker.js'
          }
        ]
      })
    ],
    build: {
      target: "esnext",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
        input: {
          sw: './src/sw.ts'
        }
      }
    },
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['platejs/react']
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