import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { invoiceId } = await req.json();

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
  }

  await prisma.invoice.update({
    where: { id: Number(invoiceId) },
    data: { status: "completed" },
  });

  return NextResponse.json({ message: "Invoice marked as completed" });
}
