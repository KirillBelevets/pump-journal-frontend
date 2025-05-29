"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TrainingSession {
  _id: string;
  date: string;
  goal: string;
  dayOfWeek?: string;
  exercises: { name: string }[];
}

export default function DashboardPage() {
  const { token, setToken } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch("http://localhost:3000/trainings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        setSessions(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Could not load sessions.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token, router]);

  const handleLogout = () => {
    setToken(null);
    router.push("/login");
  };

  if (!token) return <p className="text-center mt-20">Checking auth...</p>;
  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pump Journal</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No sessions logged yet.</p>
        ) : (
          sessions.map((session) => (
            <Link key={session._id} href={`/session/${session._id}`}>
              <div className="border rounded p-4 cursor-pointer hover:shadow-lg hover:bg-teal-50 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">
                      {session.date.slice(0, 10)}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {session.dayOfWeek}
                    </span>
                    <span>
                      {session.dayOfWeek === "Sunday"
                        ? "☀️"
                        : session.dayOfWeek === "Saturday"
                        ? "🎉"
                        : "🏋️"}
                    </span>
                  </div>
                  <span className="italic">{session.goal}</span>
                </div>
                <div className="mt-2 text-sm">
                  <strong>Exercises:</strong>{" "}
                  {session.exercises.map((e) => e.name).join(", ")}
                </div>
                <div className="text-xs text-gray-500">
                  {session.exercises.length} exercises
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <Button onClick={() => router.push("/session/new")}>+ Add Session</Button>
    </div>
  );
}
