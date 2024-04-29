import { date, int, mysqlTable } from "drizzle-orm/mysql-core";

export const loan = mysqlTable("loan", {
    booking_id: int("booking_id").primaryKey().autoincrement(),
    start_date: date("start_date").notNull(),
    end_date: date("end_date").notNull(),
})