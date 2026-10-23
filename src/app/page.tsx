import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="glass-strong rounded-3xl px-8 py-12 sm:px-14 sm:py-16 max-w-2xl w-full">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl font-black text-white shadow-xl shadow-indigo-500/40">
            A
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            ADVSTAT System
          </h1>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Interactive platform for{" "}
            <span className="text-cyan-300 font-medium">Simple Linear Regression</span> and{" "}
            <span className="text-indigo-300 font-medium">Hypothesis Testing</span>.
            Built for Advance Statistics (ADVSTAT).
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn btn-primary text-base px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn btn-secondary text-base px-8 py-3">
              Login
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="glass rounded-xl p-4">
              <h3 className="font-semibold text-white mb-1">Linear Regression</h3>
              <p className="text-sm text-white/60">
                Equation, correlation coefficient r, strength rating & scatter plot with
                regression line.
              </p>
            </div>
            <div className="glass rounded-xl p-4">
              <h3 className="font-semibold text-white mb-1">Hypothesis Testing</h3>
              <p className="text-sm text-white/60">
                Z-test, critical values, automatic decision, and shaded normal curve.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
