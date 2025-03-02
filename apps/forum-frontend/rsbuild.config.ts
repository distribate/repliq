import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';
// import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { pluginCssMinimizer } from "@rsbuild/plugin-css-minimizer";

export default defineConfig({
  source: {
    entry: {
      index: './src/main.tsx'
    }
  },
  html: {
    template: './index.html',
  },
  plugins: [
    pluginReact(),
    pluginImageCompress(),
    pluginCssMinimizer()
  ],
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience'
    },
    // bundleAnalyze: { }
  },
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack(),
        // new RsdoctorRspackPlugin()
      ],
    }
  },
  server: {
    port: process.env.NODE_ENV === 'development' ? 3008 : 3000,
    host: '0.0.0.0',
  },
})