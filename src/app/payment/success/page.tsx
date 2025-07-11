import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await searchParams;
  // const searchParams = useSearchParams();
  // const invoiceId = searchParams.get("invoiceId");

  if (invoiceId) {
    fetch("/api/mark-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId }),
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-slate-800">
        Payment Successful 😀
      </h1>
      <p className="text-lg mb-6">
        Thank you! Your payment has been received successfully.
      </p>
      <Image
        src={
          "https://img.freepik.com/free-vector/product-quality-concept-illustration_114360-7301.jpg?t=st=1745602567~exp=1745606167~hmac=6543e4106efeb05952f6aa464d077bb794446a07961447c42b6cccd526d4e44c&w=826"
        }
        alt="success image"
        width={500}
        height={500}
      />
    </div>
  );
}
