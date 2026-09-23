import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../config/env";
import * as schema from "./schema";

export const connectionPool = mysql.createPool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connectionPool, { schema, mode: "default" });

export async function checkDbConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const connection = await connectionPool.getConnection();
    await connection.ping();
    connection.release();
    return { connected: true, message: "Database connected successfully" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return { connected: false, message };
  }
}
