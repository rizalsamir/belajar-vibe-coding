export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  DB: {
    HOST: process.env.DATABASE_HOST || "127.0.0.1",
    PORT: Number(process.env.DATABASE_PORT || 3306),
    USER: process.env.DATABASE_USER || "root",
    PASSWORD: process.env.DATABASE_PASSWORD || "",
    NAME: process.env.DATABASE_NAME || "belajar_vibe_coding",
  },
} as const;
