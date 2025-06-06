"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { token } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to change password");
      }

      setStatus("success");
      setOldPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="h-10 rounded-full px-4 py-2 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
        >
          ← Back
        </Button>

        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>

      {status === "success" && (
        <p className="text-green-600 text-sm mb-4">
          ✅ Password changed successfully.
        </p>
      )}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <Input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full h-10 rounded-full py-3 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
