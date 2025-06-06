"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResetUrl("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setStatus("success");
      setResetUrl(data.resetUrl || "");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Enter your email and we&apos;ll send a password reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {status === "error" && <p className="text-red-500 text-sm">{error}</p>}
        {status === "success" && (
          <p className="text-green-600 text-sm">
            ✅ Reset link has been generated below.
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-10 rounded-full py-3 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {resetUrl && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <p className="mb-1 font-semibold">Reset link:</p>
          <a href={resetUrl} className="text-blue-600 underline break-all">
            {resetUrl}
          </a>
        </div>
      )}
    </div>
  );
}
