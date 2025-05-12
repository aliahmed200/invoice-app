"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DOMAIN } from "../utils/constant";

interface Props {
  id: string;
  invoiceId: string;
  clientName: string;
  clientEmail: string;
}

export default function EditInvoiceDialog({
  id,
  invoiceId,
  clientName,
  clientEmail,
}: Props) {
  const [formData, setFormData] = useState({
    clientName,
    clientEmail,
  });
  const [invoiceState, setInvoiceState] = useState({
    loading: false,
    success: false,
    submitted: false,
  });
  const router = useRouter();

  async function EditInvoiceUserInfo() {
    setInvoiceState({
      loading: true,
      success: false,
      submitted: false,
    });
    try {
      await fetch(`${DOMAIN}/api/invoices/${id}/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setInvoiceState({
        loading: false,
        success: true,
        submitted: true,
      });
      router.refresh();
    } catch (err) {
      setInvoiceState({
        loading: false,
        success: false,
        submitted: true,
      });
      console.error("Error updating invoice", err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-[10px] cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
          <Edit2 width={16} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user info</DialogTitle>
          <DialogDescription>Make changes to user info here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.clientEmail}
              onChange={(e) =>
                setFormData({ ...formData, clientEmail: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={EditInvoiceUserInfo}>
            {invoiceState.loading ? (
              <div className="flex justify-center items-center">
                <div className="w-4 h-4 border-4 border-t-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
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
      </DialogContent>
    </Dialog>
  );
}
