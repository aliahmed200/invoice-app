import Image from "next/image";
import React from "react";
import authImage from "@/assets/authImage.png";
import { LoginForm } from "@/app/components/LoginForm";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyTokenForPage } from "@/app/utils/verifyToken";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value || "";
  const payload = verifyTokenForPage(token);

  if (payload) {
    redirect(`/?id=${payload.id}`);
  }
  return (
    <section className="flex justify-center gap-6 items-center py-20 w-[1010px] m-auto">
      <Image src={authImage} alt="auth image" width={590} />
      <div className="max-w-md w-full space-y-6">
        <h3 className="font-bold text-3xl">Welcom To Invoice</h3>
        <p className="text-slate-400">
          Manage your invoices with ease and professionalism — organize your
          finances and let the smart solutions work for you!
        </p>
        <LoginForm />
        <p>
          <span className="text-slate-500">Don&apos;t have an account? </span>
          <Link
            className="text-slate-900 dark:text-slate-100"
            href={"/user/register"}
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default page;
