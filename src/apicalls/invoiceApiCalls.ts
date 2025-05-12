import { DOMAIN } from "@/app/utils/constant";
import { InvoicesForUser, invoiceswithItems } from "@/app/utils/types";
import { cookies } from "next/headers";

export async function getInvoices(
  userid: string,
  pageNumber: string | undefined,
  sort: string
): Promise<InvoicesForUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  const response = await fetch(
    `${DOMAIN}/api/invoices/${userid}?pageNumber=${pageNumber}&sort=${sort}`,
    {
      headers: {
        Cookie: `jwtToken=${token}`,
      },
      cache: "no-store",
    }
  );
  return response.json();
}

export async function getSingleInvoice(
  id: string,
  invoiceId: string
): Promise<invoiceswithItems> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;

  const response = await fetch(`${DOMAIN}/api/invoices/${id}/${invoiceId}`, {
    headers: {
      Cookie: `jwtToken=${token}`,
    },
    cache: "no-store",
  });
  return response.json();
}
