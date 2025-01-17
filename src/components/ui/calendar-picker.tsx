"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CalendarPickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  description?: string;
  disabledDates?: (date: Date) => boolean;
};
const CalendarPicker = ({
  value,
  onChange,
  description,
  disabledDates,
}: CalendarPickerProps) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "pl-3 text-left font-normal w-full",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disabledDates}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

CalendarPicker.displayName = "CalendarPicker";

export { CalendarPicker };
