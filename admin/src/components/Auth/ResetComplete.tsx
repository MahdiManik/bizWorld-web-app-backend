"use client";

import { useRouter } from "next/navigation";
import { LuCircleCheckBig } from "react-icons/lu";

export default function ResetCompleteForm() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/login");
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <LuCircleCheckBig className="h-20 w-20 text-[#3366FF] mx-auto" />
        <div className="my-8">
          <h1 className="text-2xl font-bold text-[#002C69]">
            Password Reset Complete
          </h1>
          <p className="text-[#002C69] text-lg my-4">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 cursor-pointer font-semibold bg-[#002C69] text-white rounded-md hover:bg-[#002C69]/80 transition-colors"
        >
          Back To Login Page
        </button>
      </div>
    </div>
  );
}
