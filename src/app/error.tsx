"use client";

import Link from "next/link";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}
const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <div className="h-dvh flex flex-col justify-center items-center gap-5">
      <div className="text-2xl font-extrabold text-red-950">
        Something went wrong..!
      </div>
      <h2>Error Message : {error.message}</h2>
      <button
        onClick={() => reset()}
        className="bg-gray-100 px-4 py-2 rounded-md "
      >
        Try again
      </button>
      <Link className="bg-gray-100 w-fit underline text-xl" href={"/"}>
        go to home
      </Link>
    </div>
  );
};

export default ErrorPage;
