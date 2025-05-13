"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";

import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DOMAIN } from "../utils/constant";

const formSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Unit price must be at least 0"),
      })
    )
    .min(1, "At least one item is required"),
});

export function CreateInvoiceForm({ userId }: { userId: string }) {
  const [invoiceState, setInvoiceState] = useState({
    loading: false,
    success: false,
    submitted: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      items: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setInvoiceState({
      loading: true,
      success: false,
      submitted: false,
    });
    try {
      await fetch(`${DOMAIN}/api/invoices/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      setInvoiceState({
        loading: false,
        success: true,
        submitted: true,
      });
    } catch (error) {
      setInvoiceState({
        loading: false,
        success: false,
        submitted: true,
      });
      console.error("Add Invoice Error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="md:flex-1">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>client Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="ali ahmed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:flex-1">
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>client Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="aliahmed@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-1">
              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. iPhone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:flex-1">
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:flex-1">
              <FormField
                control={form.control}
                name={`items.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end">
              <Button
                className=""
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap space-y-12">
          <Button
            type="button"
            variant="ghost"
            onClick={() => append({ name: "", quantity: 1, unitPrice: 0 })}
          >
            Add Item
          </Button>

          <Button className="w-full" type="submit">
            {invoiceState.loading ? (
              <div className="flex justify-center items-center">
                <div className="w-4 h-4 border-4 border-t-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Submit"
            )}
          </Button>

          {invoiceState.submitted && (
            <p
              className="-my-9 font-medium"
              style={{
                color: invoiceState.success ? "green" : "red",
              }}
            >
              {invoiceState.success
                ? "Invoice added successfully"
                : "There is a problem, try again"}
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
