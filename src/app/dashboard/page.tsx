import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  return (
    <>
      <Navbar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Hello, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-white/60">Choose a statistical analysis tool</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/regression"
            className="glass-strong group rounded-2xl p-6 transition hover:scale-[1.02] hover:border-cyan-400/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-xl font-bold text-white shadow-lg shadow-cyan-500/30">
              📈
            </div>
            <h2 className="text-xl font-semibold text-white group-hover:text-cyan-300">
              Simple Linear Regression
            </h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Enter X–Y data points, compute the regression equation Y = a + bX, correlation
              coefficient r, relationship strength, and interactive scatter diagram.
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-cyan-300">
              Open tool →
            </span>
          </Link>

          <Link
            href="/hypothesis"
            className="glass-strong group rounded-2xl p-6 transition hover:scale-[1.02] hover:border-indigo-400/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
              📊
            </div>
            <h2 className="text-xl font-semibold text-white group-hover:text-indigo-300">
              Hypothesis Testing (Z-Test)
            </h2>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              State H₀ & H₁, select alpha, compute Z-statistic, view critical values, automatic
              decision, and normal curve with shaded rejection regions.
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-indigo-300">
              Open tool →
            </span>
          </Link>
        </div>
      </main>
    </>
  );
}
