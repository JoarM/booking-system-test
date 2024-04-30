import { db } from "@/db";
import { loan } from "@/db/schema";
import { or, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { DateRange } from "react-day-picker";

export async function GET(req: NextRequest, {
  params
}: {
  params: {
    date: string,
  }
}) {
  const month = new Date(params.date).getMonth() + 1;
  if (isNaN(month)) {
    return Response.json("Invalid date", {
      status: 400,
    });
  }

  try {
    const dates: DateRange[] = await db.select({
      from: loan.start_date,
      to: loan.end_date,
    }).from(loan).where(or(sql`MONTH(${loan.start_date})=${month}`, sql`MONTH(${loan.end_date})=${month}`));
    return Response.json(JSON.stringify(dates), {
      status: 200,
    });
  } catch (e) {
    
  }
  return Response.json("An unexpected error occured", {
    status: 500,
  });
}