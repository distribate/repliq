import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'
import { pluginImageCompress } from '@rsbuild/plugin-image-compress';
// import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { pluginCssMinimizer } from "@rsbuild/plugin-css-minimizer";
// import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

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
    pluginCssMinimizer(),
    // pluginTypeCheck({
    //   enable: true,
    //   tsCheckerOptions: {
    //     typescript: {
    //       configFile: "./tsconfig.json",
    //     }
    //   }
    // })
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
    port: 3000,
    host: '0.0.0.0',
  }
})