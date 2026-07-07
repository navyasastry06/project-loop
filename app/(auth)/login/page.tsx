"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import { signIn } from "next-auth/react";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(data: LoginForm) {
  setError("");
  setSuccess("");

  const result = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (!result) {
    setError("Something went wrong.");
    return;
  }

  if (result.error) {
    setError("Invalid email or password.");
    return;
  }

  setSuccess("Login successful.");

  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500">
          Login to your LOOP workspace
        </p>

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

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create one
          </a>
        </p>
      </form>
    </main>
  );
}