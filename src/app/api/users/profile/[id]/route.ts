import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/utils/db";
import { verifyToken } from "@/app/utils/verifyToken";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method DELETE
 * @route  ~/api/users/profile/:id
 * @desc   DELETE Profile
 * @access private (inlt uesr)
 */

// export async function DELETE(request: NextRequest, { params }: Props) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(params.id) },
//       include: { invoices: true },
//     });
//     if (!user) {
//       return NextResponse.json(
//         { message: "user not found" },
//         {
//           status: 404,
//         }
//       );
//     }

//     const userFromToken = verifyToken(request);

//     if (userFromToken != null && userFromToken.id === user.id) {
//       // delete user

//       // const itemIds: number[] = user?.invoices?.items.map((item) => item.id);
//       // await prisma.item.deleteMany({ where: { id: { in: itemIds } } });

//       const invoiceIds: number[] = user?.invoices.map((invoice) => invoice.id);
//       await prisma.invoice.deleteMany({ where: { id: { in: invoiceIds } } });

//       await prisma.user.delete({ where: { id: parseInt(params.id) } });

//       return NextResponse.json(
//         { message: "your profile account has been deleted" },
//         {
//           status: 200,
//         }
//       );
//     }

//     return NextResponse.json(
//       { message: "only user himeslf can delete profile" },
//       {
//         status: 403, // forbidden
//       }
//     );
//   } catch (err) {
//     return NextResponse.json(
//       { message: "internal server error" },
//       {
//         status: 500,
//       }
//     );
//   }
// }

/**
 * @method GET
 * @route  ~/api/users/profile/:id
 * @desc   Get Profile by Id
 * @access private (only uesr himself can get userProfile)
 */

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    const userFromToken = verifyToken(request);
    console.log("Token Data:", userFromToken);

    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "you are not allawed access denied" },
        { status: 403 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "internal server error", err },
      {
        status: 500,
      }
    );
  }
}

/**
 * @method PUT
 * @route  ~/api/users/profile/:id
 * @desc   update Profile by Id
 * @access private (only uesr himself can get userProfile)
 */

// export async function PUT(request: NextRequest, { params }: Props) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(params.id) },
//       select: {
//         id: true,
//         email: true,
//         username: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ message: "user not found" }, { status: 400 });
//     }

//     const userFromToken = verifyToken(request);

//     if (userFromToken === null || userFromToken.id !== user.id) {
//       return NextResponse.json(
//         { message: "you are not allawed access denied" },
//         { status: 200 }
//       );
//     }

//     const body = (await request.json()) as UpdateUserDto;
//     const validation = updateUserSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { message: validation.error.issues[0].message },
//         { status: 404 }
//       );
//     }

//     if (body.password) {
//       const salt = await bcrypt.genSalt(10);
//       body.password = await bcrypt.hash(body.password, salt);
//     }

//     const updateUser = await prisma.user.update({
//       where: { id: parseInt(params.id) },
//       data: {
//         username: body.username,
//         email: body.email,
//         password: body.password,
//       },
//     });
//     return NextResponse.json(updateUser, { status: 200 });
//   } catch (err) {
//     return NextResponse.json(
//       { message: "internal server error" },
//       {
//         status: 500,
//       }
//     );
//   }
// }
