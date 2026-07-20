"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";

type SignupForm = {
  workspaceName: string;
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const { register, handleSubmit } = useForm<SignupForm>();
  const router = useRouter();

  async function onSubmit(data: SignupForm) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log(result);

    if (result.success) {
      alert("Workspace created successfully!");
      router.push("/login");
    } else {
      alert(result.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center">
          Create Workspace
        </h1>

        <Input
          label="Workspace Name"
          {...register("workspaceName")}
        />

        <Input
          label="Full Name"
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}