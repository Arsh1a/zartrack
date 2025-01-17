"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CalculatedAsset, EditAsset, editAssetSchema } from "./schemas";
import DisplayAsset from "@/components/display-asset";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitForm } from "@/hooks/useFormSubmit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editAsset } from "./actions";
import { PriceInput } from "@/components/price-input";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Single } from "@/types";
import { DataTableColumnHeader } from "@/components/ui/data-table";

const assetsTableColumn = (
  handleRemove: (id: string) => void,
  prices: Single[]
): ColumnDef<CalculatedAsset>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      const code = row.original.code;
      return (
        <div className="w-44">
          <DisplayAsset code={code} showCode={false} />
        </div>
      );
    },
  },
  {
    accessorKey: "buyPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy price" />
    ),
    cell: ({ row }) => {
      const formatted = Number(row.getValue("buyPrice")).toLocaleString();
      return formatted;
    },
  },
  {
    accessorKey: "marketPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Market price" />
    ),
    cell: ({ row }) => {
      const formatted = Number(row.getValue("marketPrice")).toLocaleString();
      return formatted;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total cost" />
    ),
    cell: ({ row }) => {
      const formatted = Number(row.getValue("totalCost")).toLocaleString();
      return formatted;
    },
  },
  {
    accessorKey: "totalMarketPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total market price" />
    ),
    cell: ({ row }) => {
      const formatted = Number(
        row.getValue("totalMarketPrice")
      ).toLocaleString();
      return formatted;
    },
  },
  {
    accessorKey: "profitAndLoss",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PNL" />
    ),
    cell: ({ row }) => {
      const profitAndLoss = Number(row.getValue("profitAndLoss"));
      const profitAndLossPercentage = Number(
        row.original.profitAndLossPercentage
      );
      return (
        <div
          className={cn(
            "flex flex-col gap-[2px] font-semibold",
            profitAndLoss > 0 && "text-green-600",
            profitAndLoss < 0 && "text-destructive"
          )}
        >
          <span>
            {profitAndLoss > 0 ? "+" : ""}
            {profitAndLoss.toLocaleString()}
          </span>
          <span className="text-xs">
            {profitAndLoss > 0 ? "+" : ""}
            {profitAndLossPercentage.toFixed(2)}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const code = row.original.code;
      const amount = row.original.amount;
      const buyPrice = row.original.buyPrice;
      const boughtAt = row.original.boughtAt;

      return (
        <div className="flex gap-3">
          <DeleteButton handleRemove={handleRemove} id={id} />
          <EditButton
            initialData={{ code, id, amount, buyPrice, boughtAt }}
            prices={prices}
          />
        </div>
      );
    },
  },
];

export default assetsTableColumn;

function DeleteButton({
  id,
  handleRemove,
}: {
  id: string;
  handleRemove: (id: string) => void;
}) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handleButtonClick = () => {
    if (isPopoverOpen) {
      handleRemove(id);
    } else {
      setPopoverOpen(true);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          className="p-0 h-8 w-8"
          size="sm"
          onClick={handleButtonClick}
        >
          <Trash />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 text-sm text-center px-4 py-2">
        Click again to remove
      </PopoverContent>
    </Popover>
  );
}

function EditButton({
  initialData,
  prices,
}: {
  prices: Single[];
  initialData: EditAsset;
}) {
  const [isOpen, setOpen] = useState(false);

  const { handleSubmit, isLoading } = useSubmitForm({
    action: editAsset,
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const form = useForm<EditAsset>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: EditAsset) => {
    handleSubmit(values);
  };

  return (
    <Sheet onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button className="self-start p-0 h-8 w-8" size="sm" variant="outline">
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle>Edit asset</SheetTitle>
            <SheetDescription className="sr-only">Edit asset</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`code`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset</FormLabel>
                      <Combobox
                        items={prices.map((item) => ({
                          label: item.name,
                          value: item.code,
                        }))}
                        placeholder="Search asset..."
                        buttonLabel="Select asset..."
                        onValueChange={field.onChange}
                        value={field.value}
                        customLabel={(value) => (
                          <DisplayAsset code={value} showCode={false} />
                        )}
                        customButtonLabel={(value) => (
                          <DisplayAsset code={value} showCode={false} />
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`boughtAt`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bought at</FormLabel>
                      <CalendarPicker
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabledDates={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`buyPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy price</FormLabel>
                      <FormControl>
                        <PriceInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onKeyDown={(e) => {
                            if (e.code === "Minus") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
