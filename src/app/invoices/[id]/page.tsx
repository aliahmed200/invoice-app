// import InvoicesTable from "../../components/InvoicesTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getInvoices } from "@/apicalls/invoiceApiCalls";
import { InvoicesForUser } from "@/app/utils/types";
import { ARTICLE_PER_PAGE } from "@/app/utils/constant";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
const InvoicesTable = dynamic(() => import("../../components/InvoicesTable"));

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    pageNumber: string;
    sort: string;
  }>;
  params: Promise<{ id: string }>;
}

const Page = async ({ params, searchParams }: Props) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;
  if (!token) {
    redirect("/user/login/");
  }

  const { id } = await params;
  const { pageNumber, sort } = await searchParams;
  const pageNumberForNavigation = parseInt(pageNumber);

  const res: InvoicesForUser = await getInvoices(id, pageNumber, sort);

  const { invoices, totalCount } = res;
  const totalPages = Math.ceil(totalCount / ARTICLE_PER_PAGE);

  return (
    <div className="w-[300px] md:w-[600px] lg:w-[1010px] m-auto mt-16">
      <div className="flex justify-between items-center mb-5">
        <h3 className="flex items-center gap-2 font-bold text-2xl">
          {" "}
          <Link href={`/?id=${id}`}>
            <ArrowLeft />
          </Link>
          Invoices
        </h3>
        <div className="flex items-center gap-6">
          <Link
            className="p-[10px] cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            href={`/invoices/${id}/?pageNumber=${pageNumber}&sort=${sort === "asc" ? "desc" : "asc"}`}
          >
            <ArrowUpDown size={16} />
          </Link>
          <Link href={`/invoices/${id}/createinvoice`}>
            <Button className="cursor-pointer" variant="default">
              Add Invoice
            </Button>
          </Link>
        </div>
      </div>

      <InvoicesTable invoices={invoices} userId={id} />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/invoices/${id}/?pageNumber=${pageNumberForNavigation > 1 ? pageNumberForNavigation - 1 : 1}`}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href={`/invoices/${id}/?pageNumber=${i + 1}`}
                isActive={pageNumberForNavigation === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={`/invoices/${id}/?pageNumber=${pageNumberForNavigation < totalCount ? pageNumberForNavigation + 1 : totalCount}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Page;
