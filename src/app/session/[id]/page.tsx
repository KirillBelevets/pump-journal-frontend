"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TrainingSessionEditForm from "../new/TrainingSessionEditForm";
import { TrainingSession, TrainingSessionFormValues } from "@/types/training";

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for editing
  const [form, setForm] = useState<TrainingSessionFormValues>({
    date: "",
    goal: "",
    dayOfWeek: "",
    timeOfDay: "",
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
          timeOfDay: data.timeOfDay || "",
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

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!session) return <p className="text-center mt-20">Session not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 sm:p-8 rounded-2xl shadow-2xl bg-white/95 border space-y-8 relative">
      <div className="flex justify-between items-center mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-10 rounded-full bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold shadow-lg transition-all duration-200 hover:scale-105 !px-3"
        >
          &larr; Back
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditMode(!editMode)}
            className="h-10 rounded-full bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold shadow-lg transition-all duration-200 hover:scale-105 !px-3"
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
          <Button
            type="button"
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
            className="h-10 rounded-full bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold shadow-lg transition-all duration-200 hover:scale-105 !px-3"
          >
            Delete
          </Button>
        </div>
      </div>

      {editMode ? (
        <TrainingSessionEditForm
          initial={form}
          onSave={async (updated) => {
            setError("");
            setLoading(true);
            try {
              const res = await fetch(
                `http://localhost:3000/trainings/${params.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(updated),
                }
              );
              if (!res.ok) throw new Error("Failed to update session");
              const updatedData = await res.json();
              setSession(updatedData);
              setForm(updatedData);
              setEditMode(false);
            } catch {
              setError("Failed to save changes.");
            } finally {
              setLoading(false);
            }
          }}
          loading={loading}
          error={error}
        />
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
            {session.timeOfDay && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {session.timeOfDay}
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
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <span className="font-semibold text-teal-700">
                      {ex.name}
                    </span>
                    <span className="inline-block rounded-lg px-2 py-1 text-xs font-semibold bg-teal-50 text-teal-700">
                      Tempo: {ex.tempo}
                    </span>
                    <span className="inline-block rounded-lg px-2 py-1 text-xs font-semibold bg-yellow-50 text-yellow-700">
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
