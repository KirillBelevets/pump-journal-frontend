"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Missing reset token.");
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Reset failed");
      }

      setStatus("success");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {status === "success" && (
        <p className="text-green-600 mb-4">
          ✅ Password has been reset! Redirecting to login...
        </p>
      )}

      {token && status !== "success" && (
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full h-10 rounded-full py-3 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}
