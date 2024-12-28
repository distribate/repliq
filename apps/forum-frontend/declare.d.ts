declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MONITORING_API_URL: string,
      NEXT_PUBLIC_SUPABASE_URL: string,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string,
      SECRET_TOKEN: string,
      ASP_NET_API_URL: string,
      CONNECTION_STRING: string,
      NEXT_PUBLIC_SKIN_BACKEND_PORT: number
    }
  }
}