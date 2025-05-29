"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Set {
  reps: number;
  weight: number;
  comment?: string;
}
interface Exercise {
  name: string;
  tempo: string;
  rest: number;
  sets: Set[];
}
interface TrainingSession {
  _id: string;
  date: string;
  goal: string;
  dayOfWeek?: string;
  heartRate?: { start: number; end: number };
  exercises: Exercise[];
  sessionNote?: string;
}

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for editing
  const [form, setForm] = useState<Omit<TrainingSession, "_id">>({
    date: "",
    goal: "",
    dayOfWeek: "",
    exercises: [],
    sessionNote: "",
    heartRate: { start: 0, end: 0 },
  });

  // Fetch the session by ID
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchSession = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/trainings/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch session");
        const data = await res.json();
        setSession(data);
        setForm({
          date: data.date || "",
          goal: data.goal || "",
          dayOfWeek: data.dayOfWeek || "",
          exercises: data.exercises || [],
          sessionNote: data.sessionNote || "",
          heartRate: data.heartRate || { start: 0, end: 0 },
        });
      } catch {
        setError("Could not load session.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.id]);

  // Handle edits
  const handleInput = (
    field: keyof Omit<TrainingSession, "_id" | "exercises" | "heartRate">,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHeartRate = (key: "start" | "end", value: string) => {
    setForm((prev) => {
      const currentStart =
        key === "start" ? Number(value) : prev.heartRate?.start ?? 0;
      const currentEnd =
        key === "end" ? Number(value) : prev.heartRate?.end ?? 0;

      return {
        ...prev,
        heartRate: {
          start: currentStart,
          end: currentEnd,
        },
      };
    });
  };

  const handleSave = async () => {
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/trainings/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update session");
      const updated = await res.json();
      setSession(updated);
      setEditMode(false);
    } catch {
      setError("Failed to save changes.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!session) return <p className="text-center mt-20">Session not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 sm:p-8 rounded-2xl shadow-2xl bg-white/95 border space-y-8 relative">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="!px-3"
        >
          &larr; Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditMode(!editMode)}
            className="!px-3"
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!confirm("Delete this session? This cannot be undone."))
                return;
              try {
                const res = await fetch(
                  `http://localhost:3000/trainings/${params.id}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                if (!res.ok) throw new Error("Failed to delete");
                router.push("/dashboard");
              } catch {
                setError("Delete failed.");
              }
            }}
            className="!px-3"
          >
            Delete
          </Button>
        </div>
      </div>

      {editMode ? (
        <div className="space-y-4">
          <Input
            type="date"
            value={form.date}
            onChange={(e) => handleInput("date", e.target.value)}
          />
          <Input
            placeholder="Day of Week"
            value={form.dayOfWeek}
            onChange={(e) => handleInput("dayOfWeek", e.target.value)}
          />
          <Input
            placeholder="Goal"
            value={form.goal}
            onChange={(e) => handleInput("goal", e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Heart Rate Start"
              type="number"
              value={form.heartRate?.start ?? ""}
              onChange={(e) => handleHeartRate("start", e.target.value)}
            />
            <Input
              placeholder="Heart Rate End"
              type="number"
              value={form.heartRate?.end ?? ""}
              onChange={(e) => handleHeartRate("end", e.target.value)}
            />
          </div>
          <textarea
            placeholder="Session Notes"
            value={form.sessionNote || ""}
            onChange={(e) => handleInput("sessionNote", e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
          />

          <Button
            onClick={handleSave}
            className="w-full rounded-full bg-teal-500 text-white hover:bg-yellow-400 hover:text-black font-bold shadow-lg mt-2"
          >
            Save
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <span className="font-semibold text-lg text-teal-700">
              {session.date.slice(0, 10)}
            </span>
            {session.dayOfWeek && (
              <span className="inline-block px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider">
                {session.dayOfWeek}
              </span>
            )}
            {session.goal && (
              <span className="ml-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-700 font-semibold text-sm">
                {session.goal}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <span className="bg-slate-100 rounded-lg px-3 py-1 text-xs">
              <strong>Heart Rate:</strong> {session.heartRate?.start ?? "-"}–
              {session.heartRate?.end ?? "-"}
            </span>
            {session.sessionNote && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs italic">
                {session.sessionNote}
              </span>
            )}
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2 mt-3">Exercises</h2>
            {session.exercises.map((ex, idx) => {
              console.log({ ex });

              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl border p-3 mb-4 shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-teal-700">
                      {ex.name}
                    </span>
                    <span className="bg-gray-50 rounded px-2 text-xs">
                      {ex.tempo}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                      Rest: {ex.rest}s
                    </span>
                  </div>
                  <ul className="ml-4 mt-2 text-sm">
                    {ex.sets.map((s, i) => (
                      <li key={i} className="flex gap-4 items-center py-1">
                        <span className="bg-yellow-50 rounded px-2 text-xs">
                          {s.reps} reps
                        </span>
                        <span className="bg-teal-50 rounded px-2 text-xs">
                          {s.weight} kg
                        </span>
                        {s.comment && (
                          <span className="bg-slate-200 text-slate-700 rounded px-2 text-xs italic">
                            {s.comment}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
