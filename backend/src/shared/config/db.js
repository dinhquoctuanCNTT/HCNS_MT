import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

export const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log("Connected to SQL Server");
    return pool;
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error("Database not connected yet");
  }
  return pool;
};

export { sql };
