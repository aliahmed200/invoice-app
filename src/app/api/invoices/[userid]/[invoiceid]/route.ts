import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import { verifyToken } from "@/app/utils/verifyToken";
import { UpdateInvoiceDto } from "@/app/utils/dto";
import { Resend } from "resend";
import UserMessage from "@/app/components/UserMessage";

type Params = {
  params: Promise<{ invoiceid: string; userid: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { invoiceid, userid } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceid) },
      include: { items: true },
    });

    const userFromToken = verifyToken(request);

    if (
      userFromToken === null ||
      parseInt(userid) !== userFromToken.id ||
      invoice?.userId !== userFromToken.id
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(invoice, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching invoice", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { invoiceid, userid } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceid) },
      include: {
        items: true,
      },
    });

    const userFromToken = verifyToken(request);

    if (
      !invoice ||
      invoice.userId !== userFromToken?.id ||
      invoice.userId !== parseInt(userid)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const ItemsIds: number[] = invoice?.items.map((item) => item.id);

    await prisma.item.deleteMany({
      where: { id: { in: ItemsIds } },
    });

    await prisma.invoice.delete({
      where: { id: parseInt(invoiceid) },
    });

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting invoice", error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { invoiceid, userid } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceid) },
      include: {
        items: true,
      },
    });

    const userFromToken = verifyToken(request);

    if (
      !invoice ||
      invoice.userId !== userFromToken?.id ||
      invoice.userId !== parseInt(userid)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    } else {
      const body = (await request.json()) as UpdateInvoiceDto;

      const updatedInvoice = await prisma.invoice.update({
        where: { id: parseInt(invoiceid) },
        data: {
          clientName: body.clientName,
          clientEmail: body.clientEmail,
        },
      });
      const resend = new Resend(process.env.RESEND_API_KEY);

      if (body.clientEmail !== invoice.clientEmail) {
        await resend.emails.send({
          from: "Ali <onboarding@resend.dev>",
          to: updatedInvoice.clientEmail,
          subject: "Invoice updated - EasyInvo",
          react: UserMessage({
            username: updatedInvoice.clientEmail,
            stripeLink: updatedInvoice.stripeLink,
          }),
        });
      }

      return NextResponse.json(updatedInvoice, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating invoice", error },
      { status: 500 }
    );
  }
}
