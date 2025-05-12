import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSingleInvoice } from "@/apicalls/invoiceApiCalls";
import { invoiceswithItems } from "@/app/utils/types";
import dynamic from "next/dynamic";

// import EditInvoiceDialog from "@/app/components/EditInvoiceDialog";
// import { DeleteInvoiceDialog } from "@/app/components/DeleteInvoiceDialog";
// import CreateItemDialog from "@/app/components/CreateItemDialog";
// import EditItemDialog from "@/app/components/EditItemDialog";
// import { DeleteItemsDialog } from "@/app/components/DeleteItemDialog";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const EditInvoiceDialog = dynamic(
  () => import("@/app/components/EditInvoiceDialog")
);

const DeleteInvoiceDialog = dynamic(
  () => import("@/app/components/DeleteInvoiceDialog")
);

const CreateItemDialog = dynamic(
  () => import("@/app/components/CreateItemDialog")
);

const EditItemDialog = dynamic(() => import("@/app/components/EditItemDialog"));

const DeleteItemsDialog = dynamic(
  () => import("@/app/components/DeleteItemDialog")
);

interface Props {
  params: Promise<{
    id: string;
    invoiceId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const cookieStore = await cookies();

  const token = cookieStore.get("jwtToken")?.value;
  if (!token) {
    redirect("/user/login/");
  }
  const { id, invoiceId } = await params;
  const invoice: invoiceswithItems = await getSingleInvoice(id, invoiceId);

  return (
    <section className="w-[1010px] m-auto mt-16">
      <div className="flex justify-between items-end mb-8">
        <div className="flex justify-between items-center gap-1 text-2xl font-bold">
          <Link href={`/invoices/${id}/?pageNumber=1`}>
            <ArrowLeft />
          </Link>
          Invoice #{id}
          <DeleteInvoiceDialog id={id} invoiceId={invoiceId} />
          <EditInvoiceDialog
            id={id}
            invoiceId={invoiceId}
            clientEmail={invoice.clientEmail}
            clientName={invoice.clientName}
          />
        </div>
        <p>
          {formatDistanceToNow(new Date(invoice.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <p>{invoice.clientName}</p>
          <p>{invoice.clientEmail}</p>
        </div>
        <div className="flex flex-col items-end">
          <p>${invoice.totalAmount}</p>
          <Badge
            className={`${invoice.status === "completed" ? "bg-green-400 dark:bg-green-400" : "bg-slate-700 dark:bg-slate-200"}`}
          >
            {invoice.status}
          </Badge>
        </div>
      </div>
      <div className="w-fit">
        <CreateItemDialog id={id} invoiceId={invoiceId} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {invoice.items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{item.name}</CardTitle>
                <div className="flex">
                  <DeleteItemsDialog
                    id={id}
                    invoiceId={invoiceId}
                    itemid={item.id}
                  />
                  <EditItemDialog
                    id={id}
                    invoiceId={invoiceId}
                    itemid={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    unitPrice={item.unitPrice}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>#{item.id}</div>
              <div>quantity : {item.quantity}</div>
              <div>unitPrice : {item.unitPrice}</div>
              <div>totalPrice : {item.totalPrice}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Page;
