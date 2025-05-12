import React from "react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "../utils/verifyToken";
import LogOut from "./LogOut";

const NavBar = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);

  return (
    <div className="flex items-center justify-between my-4 max-w-[1010px] mx-auto ">
      <Link href={`/?id=${payload?.id}`} className="text-2xl font-bold">
        EasyInvo
      </Link>
      <div className="flex items-center gap-4">
        {payload?.id ? (
          <div className="flex gap-3 items-center">
            <LogOut />
            Hello {payload.username}..!
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href={"/user/login"}>Login</Link>
            <Link href={"/user/register"}>register</Link>
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
