"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DOMAIN } from "../utils/constant";

type Props = {
  id: string;
  invoiceId: string;
  itemid: number;
};

export default function DeleteItemsDialog({ id, invoiceId, itemid }: Props) {
  const router = useRouter();
  const [invoiceState, setInvoiceState] = useState({
    loading: false,
  });

  async function DeleteItem() {
    setInvoiceState({
      loading: true,
    });
    try {
      const res = await fetch(
        `${DOMAIN}/api/invoices/${id}/${invoiceId}/${itemid}`,
        {
          method: "Delete",
          headers: { "Content-Type": "application/json" },
        }
      );
      setInvoiceState({
        loading: false,
      });
      console.log(res);
      router.refresh();
    } catch (err) {
      setInvoiceState({
        loading: false,
      });
      console.error("Error updating invoice", err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-[10px] cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
          <Trash width={14} className="text-red-600" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete the Item.
        </p>
        <DialogFooter>
          <Button variant="destructive" onClick={DeleteItem}>
            {invoiceState.loading ? (
              <div className="flex justify-center items-center">
                <div className="w-4 h-4 border-4 border-t-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
