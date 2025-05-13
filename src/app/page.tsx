import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import manImage from "@/assets/man.png";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "./utils/verifyToken";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);
  return (
    <section className="w-[300px] md:w-[600px] lg:w-[1010px] m-auto mt-16">
      <div className="mb-10 lg:mb-0 flex items-center justify-end">
        {payload && (
          <Link href={`/invoices/${id}?pageNumber=1`}>
            <Button className="cursor-pointer" variant="default">
              see Invoices
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-center">
        <h1 className="flex-1 font-bold text-2xl text-center lg:text-left md:text-4xl lg:text-6xl ">
          Streamline Your Invoices, Simplify Payments, and Enhance Your Workflow
        </h1>
        <div className="flex-1 md:flex-1">
          <Image src={manImage} alt="man" width={500} height={500} />
        </div>
      </div>
    </section>
  );
}
