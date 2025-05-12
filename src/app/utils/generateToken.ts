import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

export function generateJwt(jwtPayload: JWTPayload): string {
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  return token;
}

export function setCookie(jwtPayload: JWTPayload): string {
  const token = generateJwt(jwtPayload);
  console.log(token);

  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cookie;
}
