import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // #postgresql
    // url: `postgresql://${process.env.POSTGRES_USER}.${process.env.POOLER_TENANT_ID}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_DEV_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
    
    // #sqlite
    url: "G:/web_projects/forum/data/sqlite.db"
  },
});