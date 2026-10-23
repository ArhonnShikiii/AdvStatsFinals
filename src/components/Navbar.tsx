"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  user?: { name: string; email: string } | null;
};

export default function Navbar({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-indigo-500/30">
            A
          </span>
          <span className="hidden sm:inline text-white">ADVSTAT</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost text-sm px-3 py-2">
                Dashboard
              </Link>
              <Link href="/regression" className="btn btn-ghost text-sm px-3 py-2">
                Regression
              </Link>
              <Link href="/hypothesis" className="btn btn-ghost text-sm px-3 py-2">
                Hypothesis
              </Link>
              <span className="hidden md:inline mx-2 text-sm text-white/50">
                {user.name}
              </span>
              <button
                onClick={logout}
                disabled={loading}
                className="btn btn-secondary text-sm px-3 py-2"
              >
                {loading ? "..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-sm px-3 py-2">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary text-sm px-3 py-2">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
