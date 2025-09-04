import { defineConfig } from '@rcmade/hono-docs'

export default defineConfig({
  tsConfigPath: './tsconfig.json',
  openApi: {
    openapi: '3.0.0',
    info: { title: 'API', version: '0.0.1' },
    servers: [
      {
        url: 'http://localhost:4101/forum'
      }
    ],
  },
  outputs: {
    openApiJson: './openapi/openapi.json',
  },
  apis: [
    {
      name: 'Forum Routes',
      apiPrefix: '/forum',
      appTypePath: 'src/types/routes-types.ts',
      api: [
        {
          api: '/health',
          method: 'get',
          summary: 'Get healthcheck',
          tag: ['Other'],
        },
      ],
    },
  ],
})