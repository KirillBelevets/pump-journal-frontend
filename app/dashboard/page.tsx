"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { TrainingSession } from "../../types/training";
import { DashboardFilters, DashboardFilterState } from "./DashboardFilters";

export default function DashboardPage() {
  const { token, setToken } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<DashboardFilterState>({
    dateFrom: undefined,
    dateTo: undefined,
    dayOfWeek: "any",
    exercise: "",
    goal: "",
  });

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/trainings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    router.push("/auth/login");
  };

  if (!token) return <p className="text-center mt-20">Checking auth...</p>;
  if (loading) return <p className="text-center mt-20">Loading...</p>;

  const filteredSessions = sessions.filter((session) => {
    // Assume session.date is a string like "2025-06-01"
    const sessionDate = session.date ? new Date(session.date) : null;

    if (filters.dateFrom && sessionDate && sessionDate < filters.dateFrom)
      return false;
    if (filters.dateTo && sessionDate && sessionDate > filters.dateTo)
      return false;
    if (filters.dayOfWeek !== "any" && session.dayOfWeek !== filters.dayOfWeek)
      return false;
    if (
      filters.exercise &&
      !session.exercises.some((e) =>
        e.name.toLowerCase().includes(filters.exercise.toLowerCase())
      )
    )
      return false;
    if (
      filters.goal &&
      !session.goal?.toLowerCase().includes(filters.goal.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 px-2 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-700">Pump Journal</h1>
        <Button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-yellow-400 hover:text-black text-gray-800 font-bold transition"
        >
          Logout
        </Button>
      </div>

      <DashboardFilters filters={filters} setFilters={setFilters} />

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <p className="text-muted-foreground">No sessions logged yet.</p>
        ) : (
          filteredSessions.map((session) => (
            <Link key={session._id} href={`/session/${session._id}`} passHref>
              <div
                className="border rounded-2xl p-4 cursor-pointer bg-white/90 hover:bg-accent/30 hover:shadow-xl transition flex flex-col gap-1"
                style={{ boxShadow: "0 4px 16px rgba(45, 212, 191, 0.12)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-teal-700 text-lg">
                      {session.date.slice(0, 10)}
                    </span>
                    {session.dayOfWeek && (
                      <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">
                        {session.dayOfWeek}
                      </span>
                    )}
                    <span>
                      {session.dayOfWeek === "Sunday"
                        ? "☀️"
                        : session.dayOfWeek === "Saturday"
                        ? "🎉"
                        : "🏋️"}
                    </span>
                  </div>
                  {session.goal && (
                    <span className="italic text-primary font-semibold">
                      {session.goal}
                    </span>
                  )}
                </div>
                <div className="text-sm mt-1 text-gray-700">
                  <strong>Exercises:</strong>{" "}
                  {session.exercises.map((e) => e.name).join(", ")}
                </div>
                <div className="flex gap-3 items-center mt-1 text-xs text-gray-500">
                  <span className="bg-teal-50 text-teal-700 rounded px-2 py-0.5">
                    {session.exercises.length} exercises
                  </span>
                  <span>Click for details &rarr;</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="pb-6 pt-2">
        <Button
          onClick={() => router.push("/session/new")}
          className="w-full rounded-full py-3 font-bold text-gray-900 bg-gray-300 hover:bg-yellow-400 hover:text-black shadow-md transition-colors"
        >
          + Add Session
        </Button>
      </div>
    </div>
  );
}
