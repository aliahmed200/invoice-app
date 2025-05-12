import prisma from "@/app/utils/db";
import { verifyToken } from "@/app/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

type Params = {
  params: Promise<{ userid: string; invoiceid: string }>;
};

// type Params = {
//   params: Promise<{ invoiceid: string; userid: string }>;
// };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { userid, invoiceid } = await params;
    const userFromToken = verifyToken(request);

    if (!userFromToken || userFromToken.id !== parseInt(userid)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceid) },
      include: { items: true },
    });

    if (!invoice || invoice.userId !== userFromToken.id) {
      return NextResponse.json(
        { message: "Invoice not found or not yours" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, quantity, unitPrice } = body;

    const newItem = await prisma.item.create({
      data: {
        name,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
        invoiceId: invoice.id,
      },
    });

    // تحديث البيانات
    const allItems = [...invoice.items, newItem];

    const totalAmount = allItems.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    // إنشاء جلسة دفع جديدة
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: allItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.unitPrice * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `http://localhost:3000/payment/success?invoiceId=${invoice.id}`,
      cancel_url: "https://invoice-seven-alpha.vercel.app/cancel",
      metadata: {
        invoiceId: invoice.id.toString(),
      },
    });

    // تحديث الفاتورة بالـ totalAmount الجديد وstripeLink
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        totalAmount,
        stripeLink: session.url || "",
      },
    });

    return NextResponse.json(updatedInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
