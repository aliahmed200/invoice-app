import prisma from "@/app/utils/db";
import { verifyToken } from "@/app/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});
type Params = {
  params: Promise<{ userid: string; invoiceid: string; itemid: string }>;
};

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { userid, invoiceid, itemid } = await params;
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
        { message: "Items not found or not yours" },
        { status: 404 }
      );
    }

    const item = await prisma.item.findFirst({
      where: {
        id: parseInt(itemid),
        invoiceId: parseInt(invoiceid),
      },
    });

    const body = await request.json();
    const { name, quantity, unitPrice } = body;

    if (item) {
      await prisma.item.update({
        where: {
          id: parseInt(itemid),
        },
        data: {
          name,
          quantity,
          unitPrice,
        },
      });
    }

    const updatedItems = await prisma.item.findMany({
      where: {
        invoiceId: parseInt(invoiceid),
      },
    });

    const totalAmount = updatedItems.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: updatedItems.map((item) => ({
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

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ userid: string; invoiceid: string; itemid: string }> }
) {
  try {
    const { userid, invoiceid, itemid } = await params;
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
        { message: "Items not found or not yours" },
        { status: 404 }
      );
    }
    const currentItems = await prisma.item.findMany({
      where: {
        invoiceId: parseInt(invoiceid),
      },
    });
    if (currentItems.length <= 1) {
      return NextResponse.json(
        { message: "Can't delete the last item in the invoice" },
        { status: 400 }
      );
    }

    await prisma.item.delete({
      where: {
        id: parseInt(itemid),
      },
    });

    const updatedItems = await prisma.item.findMany({
      where: {
        invoiceId: parseInt(invoiceid),
      },
    });

    const totalAmount = updatedItems.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: updatedItems.map((item) => ({
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
