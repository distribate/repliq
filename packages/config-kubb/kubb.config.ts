import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/swagger-ts'

export default defineConfig({
  root: '.',
  input: {
    path: './supabase.yaml',
  },
  output: {
    path: '../shared/api/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs()
  ],
})