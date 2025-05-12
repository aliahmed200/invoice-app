import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const token = jwtToken?.value as string;

  console.log(token);
  if (!token) {
    return NextResponse.json(
      { message: "no token provided, access denied from middle ware" },
      {
        status: 401,
      }
    );
  }
}

export const config = {
  matcher: ["/api/invoices/:path*", "/api/users/profile/:path*"],
};
