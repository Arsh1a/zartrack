"use client";

import { Single } from "@/types";
import { addAssets } from "./actions";
import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitForm } from "@/hooks/useFormSubmit";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddMultipleAssets, addMultipleAssetsSchema } from "./schemas";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { PriceInput } from "@/components/price-input";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash } from "lucide-react";
import DisplayAsset from "@/components/display-asset";
import { useState } from "react";

interface Props {
  prices: Single[];
}

export default function AddAsset({ prices }: Props) {
  const [open, setOpen] = useState(false);
  const { handleSubmit, isLoading } = useSubmitForm({
    action: addAssets,
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const form = useForm<AddMultipleAssets>({
    resolver: zodResolver(addMultipleAssetsSchema),
    defaultValues: {
      assets: [
        {
          amount: "",
          boughtAt: undefined,
          buyPrice: "",
          code: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const onSubmit = async (values: AddMultipleAssets) => {
    handleSubmit(values);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>
          Register new asset <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle>Add asset</SheetTitle>
            <SheetDescription className="sr-only">Add asset</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {fields.map((field, index) => (
                <AssetFormItem
                  key={field.id}
                  index={index}
                  fieldId={field.id}
                  form={form}
                  prices={prices}
                  remove={remove}
                />
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({
                      amount: "",
                      boughtAt: undefined,
                      buyPrice: "",
                      code: "",
                    })
                  }
                >
                  <Plus /> Add new asset
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Submit all
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
interface AssetFormItemProps {
  index: number;
  fieldId: string;
  form: ReturnType<typeof useForm<AddMultipleAssets>>;
  prices: Single[];
  remove: (index: number) => void;
}

function AssetFormItem({
  index,
  fieldId,
  form,
  prices,
  remove,
}: AssetFormItemProps) {
  return (
    <Card key={fieldId} className="rounded-2xl bg-card">
      <CardHeader className="flex flex-row items-center justify-between relative">
        <h3 className="text-lg font-semibold">{index + 1}.</h3>
        {form.watch().assets.length > 1 && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
            className="absolute right-0"
          >
            <Trash />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`assets.${index}.code`}
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
            name={`assets.${index}.boughtAt`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bought at</FormLabel>
                <CalendarPicker
                  value={field.value}
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
            name={`assets.${index}.buyPrice`}
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
            name={`assets.${index}.amount`}
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
      </CardContent>
    </Card>
  );
}
