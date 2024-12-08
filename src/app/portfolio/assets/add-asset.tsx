"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Pair, Single } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { Assets, AssetsSchema } from ".";

interface Props {
  currencies: Pair[];
  cryptos: Single[];
  coins: Pair[];
  add: (data: Assets) => void;
}

export default function AddAsset({ currencies, cryptos, coins, add }: Props) {
  const [sheetIsOpen, setSheetIsOpen] = useState<boolean>(false);

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Button className="gap-0">
          <Plus />
          Add
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-full">
          <SheetHeader className="mb-3">
            <SheetTitle>Add asset</SheetTitle>
            <SheetDescription className="sr-only">
              Form to add assets
            </SheetDescription>
          </SheetHeader>
          <AssetsForm
            add={add}
            coins={coins}
            cryptos={cryptos}
            currencies={currencies}
            setSheetIsOpen={setSheetIsOpen}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function AssetsForm({
  add,
  setSheetIsOpen,
  currencies,
  cryptos,
  coins,
}: {
  add: (data: Assets) => void;
  setSheetIsOpen: (val: boolean) => void;
  currencies: Pair[];
  cryptos: Single[];
  coins: Pair[];
}) {
  const [assets, setAssets] = useState<
    {
      id: string;
      code: string | undefined;
      amount: number | undefined;
      unitBuyPrice: number | undefined;
      date: Date | undefined;
    }[]
  >([
    {
      id: crypto.randomUUID(),
      code: undefined,
      amount: undefined,
      unitBuyPrice: undefined,
      date: undefined,
    },
  ]);

  const handleAddAsset = () => {
    setAssets([
      ...assets,
      {
        id: crypto.randomUUID(),
        code: undefined,
        amount: undefined,
        unitBuyPrice: undefined,
        date: undefined,
      },
    ]);
  };

  const handleRemoveAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleAssetChange = (
    index: number,
    field: keyof (typeof assets)[0],
    value: string | number | Date | undefined
  ) => {
    setAssets(
      assets.map((asset, i) =>
        i === index ? { ...asset, [field]: value } : asset
      )
    );
  };

  const isValid = assets.every(
    (asset) => asset.code && asset.amount && asset.unitBuyPrice && asset.date
  );

  const handleSubmit = () => {
    const result = AssetsSchema.safeParse(assets);
    console.log(result);
    if (!result.success) return;

    add(result.data);
    setSheetIsOpen(false);
  };
  return (
    <div className="flex flex-col gap-4">
      {assets.map((item, index) => (
        <div key={item.id} className="bg-muted flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span>{index + 1}.</span>
            {assets.length > 1 && (
              <Button
                variant="ghost"
                className="text-destructive p-0 h-4 w-4"
                size="icon"
                onClick={() => handleRemoveAsset(assets.indexOf(item))}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 w-full gap-2">
            <Combobox
              value={item.code}
              onChange={(value) =>
                handleAssetChange(assets.indexOf(item), "code", value)
              }
              assetNames={[
                ...currencies.map((item) => item.code),
                ...cryptos.map((item) => item.code),
                ...coins.map((item) => item.code),
              ]}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={item.amount || ""}
              onChange={(e) =>
                handleAssetChange(
                  assets.indexOf(item),
                  "amount",
                  parseFloat(e.target.value)
                )
              }
              min="0"
            />
            <Input
              placeholder="Unit buy price"
              type="number"
              value={item.unitBuyPrice || ""}
              onChange={(e) =>
                handleAssetChange(
                  assets.indexOf(item),
                  "unitBuyPrice",
                  parseFloat(e.target.value)
                )
              }
              min="0"
            />
            <div className="flex gap-2">
              <DatePicker
                date={item.date}
                onSelect={(date) =>
                  handleAssetChange(assets.indexOf(item), "date", date)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2 w-full flex-wrap">
        <Button className="w-full" onClick={handleAddAsset} variant="outline">
          Add another asset
        </Button>
        <Button className="w-full" onClick={handleSubmit} disabled={!isValid}>
          Save assets
        </Button>
      </div>
    </div>
  );
}

function Combobox({
  assetNames,
  value,
  onChange,
}: {
  assetNames: string[];
  value?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground p-3"
        >
          {value
            ? assetNames.find((item) => item === value)?.toUpperCase()
            : "Select asset"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search asset..." />
          <CommandList>
            <CommandEmpty>No asset found.</CommandEmpty>
            <CommandGroup>
              {assetNames.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.toUpperCase()}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DatePicker({
  date,
  onSelect,
}: {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
