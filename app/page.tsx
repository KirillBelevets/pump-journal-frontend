"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { Button } from "../components/ui/button";

export default function Home() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-b from-gray-50 via-white to-gray-100 p-6">
      {/* Hero Illustration */}
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="w-full flex justify-center mt-6 mb-8">
          <Image
            src="/hero-fitness.svg"
            alt="Fitness Hero Banner"
            width={320}
            height={240}
            className="max-h-60 sm:max-h-80 w-auto drop-shadow-lg select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>
      {/* Header / Branding */}
      <header className="flex flex-col items-center">
        <Image
          src="/fitness-tracker.svg"
          alt="Pump Journal Logo"
          width={64}
          height={64}
        />
        <h1 className="text-4xl font-bold mt-4 text-gray-900">Pump Journal</h1>
        <p className="text-gray-500 mt-2 mb-4 text-lg text-center max-w-xl">
          Track, analyze, and improve your fitness training. Log every set,
          monitor your progress, and optimize your workouts with Pump Journal.
        </p>
      </header>
      {/* Main actions */}
      <main className="flex flex-col items-center gap-6 flex-1 justify-center">
        <div className="flex flex-col sm:flex-row gap-4">
          {!token && (
            <>
              <Link href="/auth/register">
                <Button className="px-8 py-2 text-base font-bold text-white bg-yellow-400 hover:bg-yellow-500 hover:text-black shadow-md transition-all duration-200 hover:scale-105">
                  Register
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="px-8 py-2 text-base font-bold text-gray-800 bg-gray-200 hover:bg-yellow-400 hover:text-black shadow-md transition-all duration-200 hover:scale-105"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
          {token && (
            <>
              <Link href="/dashboard">
                <Button className="px-8 py-2 text-base font-bold text-white bg-yellow-400 hover:bg-yellow-500 hover:text-black shadow-md transition-all duration-200 hover:scale-105">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/session/new">
                <Button
                  variant="outline"
                  className="px-8 py-2 text-base font-bold text-gray-800 bg-gray-200 hover:bg-yellow-400 hover:text-black shadow-md transition-all duration-200 hover:scale-105"
                >
                  Add New Session
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-4 mb-6 text-sm text-gray-400 text-center">
        © {new Date().getFullYear()} Pump Journal. Built with Next.js.
      </footer>
    </div>
  );
}
