// invoices/[id]/createinvoice/page.tsx

import React from "react";
import { CreateInvoiceForm } from "../../../components/CreateInvoiceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;
  if (!token) {
    redirect("/user/login/");
  }

  return (
    <section className="w-[300px] md:w-[600px] lg:w-[1010px] m-auto mt-16">
      <div className="flex mb-5 items-center gap-1 text-2xl font-bold">
        <Link href={`/invoices/${id}/?pageNumber=1`}>
          <ArrowLeft />
        </Link>
        create a new Invoice
      </div>

      <CreateInvoiceForm userId={id} />
    </section>
  );
};

export default Page;
