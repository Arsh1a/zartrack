"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  items: {
    value: string;
    label: string;
  }[];
  placeholder?: string;
  buttonLabel?: string;
  onValueChange?: (value: string) => void;
  value: string;
  customLabel?: (value: string, label: string) => React.ReactNode;
  customButtonLabel?: (value: string, label: string) => React.ReactNode;
}

const Combobox = ({
  items = [],
  placeholder = "Search...",
  buttonLabel = "Select an option...",
  onValueChange,
  value,
  customLabel,
  customButtonLabel,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState<string>(value);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === val ? "" : selectedValue;
    setVal(newValue);
    setOpen(false);
    onValueChange?.(newValue);
  };

  const valLabel = items.find((item) => item.value === val)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <span className="truncate">
            {val
              ? customButtonLabel && valLabel
                ? customButtonLabel?.(val, valLabel)
                : valLabel
              : buttonLabel}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-xl">
        <Command
          filter={(value, search) => {
            const item = items.find((item) => item.value === value);
            if (!item) return 0;
            if (
              item.label.toLowerCase().includes(search.toLowerCase()) ||
              item.value.toLowerCase().includes(search.toLowerCase())
            )
              return 1;

            return 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      val === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {customLabel?.(item.value, item.label) ?? item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
Combobox.displayName = "Combobox";

export { Combobox };
