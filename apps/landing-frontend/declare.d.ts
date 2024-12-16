declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONITORING_API_URL: string,
      MINECRAFT_SERVER_FASBERRY_PORT: number,
      MINECRAFT_SERVER_BISQUITE_PORT: number
      MINECRAFT_SERVER_FASBERRY_IP: string,
      SECRET_TOKEN: string
    }
  }
}