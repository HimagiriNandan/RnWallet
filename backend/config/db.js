import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

// creates a Neon SQL client using the connection string from the environment variable
export const sql = neon(process.env.DB_URL)

export async function initDB(){
  try{
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_DATE
    )`

    console.log("Database initialized successfully.");
  }catch(err){
    console.error("Error initializing database:", err);
    process.exit(1); 
  }
}