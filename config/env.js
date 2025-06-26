import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
if (!process.env.DB_URI) throw new Error("DB_URI not defined");
if (!process.env.PORT) throw new Error("PORT not defined");

export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_URI = process.env.DB_URI;
export const PORT = process.env.PORT || 3000;
