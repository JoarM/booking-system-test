"use server";

import { db } from "@/db";
import { loan } from "@/db/schema";
import { between, or } from "drizzle-orm";
import { DateRange } from "react-day-picker";

export async function CreateBooking(range: DateRange) {
  if (!range.from || !range.to) {
    return "Select start and end date";
  }
  const existingBookings = await db.select().from(loan).where(or(between(loan.start_date, range.from, range.to), between(loan.end_date, range.from, range.to)));
  if (existingBookings.length > 0) {
    return "There is already a booking blocking this booking please try another time period.";
  }
  try {
    await db.insert(loan).values({ start_date: range.from, end_date: range.to });
  } catch (e) {
    return "An error occured";
  }
}