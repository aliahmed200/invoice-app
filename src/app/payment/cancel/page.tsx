import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-800 p-8">
      <h1 className="text-4xl font-bold mb-4">Payment Cancelled 😪</h1>
      <p className="text-lg mb-6">
        It looks like you canceled the payment. Feel free to try again anytime.
      </p>
      <Image
        src={
          "https://img.freepik.com/free-vector/anxiety-concept-illustration_114360-8024.jpg?t=st=1745601955~exp=1745605555~hmac=310e5a0ebf97752ec3c1dbd5062a12f08c1f0d1d189234b18fd82c42b7f94928&w=826"
        }
        alt="cancel image"
        width={500}
        height={500}
      />
    </div>
  );
}
