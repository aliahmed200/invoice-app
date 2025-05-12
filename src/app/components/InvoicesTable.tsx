"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { InvoiceAndItems } from "@/app/utils/types";

const InvoicesTable = ({ invoices, userId }: InvoiceAndItems) => {
  return (
    <div className="mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>status</TableHead>
            <TableHead>items</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                <Link href={`/invoices/${userId}/${invoice.id}`}>
                  {" "}
                  {invoice.id}
                </Link>
              </TableCell>
              <TableCell>
                {" "}
                <Link href={`/invoices/${userId}/${invoice.id}`}>
                  {invoice.clientName}
                </Link>
              </TableCell>
              <TableCell>
                {" "}
                <Link href={`/invoices/${userId}/${invoice.id}`}>
                  {invoice.clientEmail}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  className={`rounded-sm px-[8px] py-[1px] text-[12px] ${invoice.status === "completed" ? "bg-green-400 dark:bg-green-400 text-white" : "bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-800"}`}
                  href={`/invoices/${userId}/${invoice.id}`}
                >
                  {invoice.status}
                </Link>
              </TableCell>
              <TableCell>
                {" "}
                <Link
                  className="block w-full h-full text-center"
                  href={`/invoices/${userId}/${invoice.id}`}
                >
                  {invoice?.items.length}
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/invoices/${invoice.id}`}>
                  ${invoice.totalAmount}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTable;
