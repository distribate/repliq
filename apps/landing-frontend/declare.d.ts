declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MONITORING_API_URL: string,
      NEXT_PUBLIC_SUPABASE_URL: string,
      NEXT_PUBLIC_MINECRAFT_SERVER_FASBERRY_PORT: number,
      NEXT_PUBLIC_MINECRAFT_SERVER_BISQUITE_PORT: number
      NEXT_PUBLIC_MINECRAFT_SERVER_FASBERRY_IP: string,
      SECRET_TOKEN: string,
      SUPABASE_SERVICE_ROLE_KEY: string,
      NEXT_PUBLIC_SKIN_BACKEND_PORT: number
    }
  }
}