import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db"; // تأكد من مسار الـ Prisma Client في مشروعك.
import Stripe from "stripe";
import { Resend } from "resend";
import UserMessage from "@/app/components/UserMessage";
import { verifyToken } from "@/app/utils/verifyToken";
import { ARTICLE_PER_PAGE } from "@/app/utils/constant";
import { createInvoiceDto } from "@/app/utils/dto";

interface Props {
  params: Promise<{ userid: string }>;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { userid } = await params;
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const sort = request.nextUrl.searchParams.get("sort") || "asc";
    const userId = parseInt(userid);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const userFromToken = verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { message: "user not found" },
        {
          status: 404,
        }
      );
    }

    if (userFromToken != null && userFromToken.id === user.id) {
      const totalCount = await prisma.invoice.count({
        where: { userId: user.id },
      });
      const invoices = await prisma.invoice.findMany({
        where: { userId: user.id },
        skip: ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1),
        take: ARTICLE_PER_PAGE,
        orderBy: {
          createdAt: sort === "asc" ? "asc" : "desc",
        },
        include: {
          items: true,
        },
      });
      return NextResponse.json(
        { invoices: invoices, totalCount: totalCount },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "404 error" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching invoices", error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { userid } = await params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userid) },
    });
    const userFromToken = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { message: "only user him self can add this invoice" },
        {
          status: 403,
        }
      );
    }

    if (userFromToken != null && userFromToken.id === user.id) {
      const body = (await request.json()) as createInvoiceDto;
      const { clientName, clientEmail, items } = body;

      const totalAmount = items.reduce(
        (acc: number, item) => acc + item.quantity * item.unitPrice,
        0
      );

      // إنشاء الفاتورة
      const newInvoice = await prisma.invoice.create({
        data: {
          clientName,
          clientEmail,
          totalAmount,
          stripeLink: "",
          userId: user?.id,
          items: {
            create: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: newInvoice.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: item.unitPrice * 100, // بالملي سنت
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `http://localhost:3000/payment/success?invoiceId=${newInvoice.id}`,
        cancel_url: "https://invoice-seven-alpha.vercel.app/cancel",
        metadata: {
          invoiceId: newInvoice.id.toString(),
        },
      });

      const updatedInvoice = await prisma.invoice.update({
        where: {
          id: newInvoice.id,
        },
        data: {
          stripeLink: session.url || "",
        },
      });

      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Ali <onboarding@resend.dev>",
        to: newInvoice.clientEmail,
        subject: "welcome to EasyInvo",
        react: UserMessage({
          username: newInvoice.clientName,
          stripeLink: updatedInvoice.stripeLink,
        }),
      });

      return NextResponse.json(updatedInvoice, { status: 201 });
    }
    return NextResponse.json(
      { message: "user only can added a new invoice" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal error", error },
      { status: 500 }
    );
  }
}
