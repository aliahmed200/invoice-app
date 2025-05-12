import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import bcrypt from "bcryptjs";
import { setCookie } from "@/app/utils/generateToken";
import { loginSchema } from "@/app/utils/validationSchema";
import { LoginDto } from "@/app/utils/dto";
import { JWTPayload } from "@/app/utils/types";

/**
 * @method POST
 * @route  ~/api/users/login
 * @desc   Login user and return token (and set cookie)
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginDto;

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.issues[0].message, {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
      return NextResponse.json(
        { message: "please make an account first" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const jwtPayload: JWTPayload = {
      id: user.id,
      username: user.username,
    };

    const cookie = setCookie(jwtPayload);

    const response = NextResponse.json(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        message: "Login successful",
      },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );

    return response;
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
