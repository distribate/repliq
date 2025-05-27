import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';
import { pluginCssMinimizer } from "@rsbuild/plugin-css-minimizer";

export default defineConfig({
  source: {
    entry: {
      index: './src/main.tsx'
    },
  },
  html: {
    template: './index.html',
  },
  plugins: [
    pluginReact(),
    pluginImageCompress(["jpeg", "pngLossless", "ico"]),
    pluginCssMinimizer()
  ],
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience'
    },
  },
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack(),
      ],
    }
  },
  output: {
    polyfill: 'off',
    distPath: {
      root: process.env.NODE_ENV === 'development' ? "dist" : "build",
    }
  },
  server: {
    port: process.env.NODE_ENV === 'development'
      ? Number(process.env.DEV_PORT)
      : Number(process.env.PROD_PORT),
    host: '0.0.0.0',
  },
})