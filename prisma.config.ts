import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrate/introspection need a direct (non-pooled) connection to Postgres.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
