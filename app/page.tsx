"use client"

import { CreateBooking } from "@/actions/book";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string): Promise<DateRange[]> => fetch(url).then(async (res) => {
  const dates: DateRange[] = [];
  const data = JSON.parse(await res.json());
  for (let i = 0; i < data.length; i++) {
    const range = {
      from: new Date(data[i].from),
      to: new Date(data[i].to)
    }
    if (!isNaN(range.from.getDate()) && !isNaN(range.to.getDate())) {
      dates.push(range);
    }
  }
  return dates;
});

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [booking, startBooking] = useTransition();
  const [month, setMonth] = useState(new Date());
  const [local, setLocal] = useState<DateRange[]>([]);

  const { data, isLoading, error } = useSWR(`/api/bookings/${month.toUTCString()}`, fetcher);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  function book() {
    if (!range) {
      return;
    }
    startBooking(async () => {
      if (!range.from || !range.to) {
        toast.error("Select start and end date");
        return;
      };
      const error = await CreateBooking(range);
      if (error) {
        toast.error(error); 
        return;
      };
      toast.success(`Booked ${format(range.from, "PPP")} to ${format(range.to, "PPP")}`);
      setLocal([...local, range]);
      setRange(undefined);
    });
  }

  return (
    <main className="grid min-h-screen place-items-center p-24">
      <div className="max-w-64 flex items-center justify-center flex-col">
        <div className="relative">
          <Calendar 
          disabled={data && local.concat(data)}
          month={month}
          fromDate={new Date()}
          onMonthChange={(e) => setMonth(e)}
          mode="range"
          selected={range}
          onSelect={setRange}
          />
          {isLoading && (
            <div className="absolute top-12 left-3 right-3 bottom-2 bg-muted/80 rounded-md grid place-items-center">
              <Loader2 
              className="size-8 animate-spin"
              />
            </div>
          )}
        </div>
        <Button 
        className="w-full mt-2"
        disabled={booking}
        onClick={book}
        >
          {booking && (
            <Loader2
            className="size-4 mr-2 animate-spin"
            />
          )}
          Book
        </Button>
      </div>
    </main>
  );
}
