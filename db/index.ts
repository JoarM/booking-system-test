import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: "127.0.0.1",
    database: "bookingtest",
    user: "test",
    password: "123"
});

export const db = drizzle(connection);