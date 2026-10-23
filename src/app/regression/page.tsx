"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ScatterChart from "@/components/ScatterChart";
import {
  computeLinearRegression,
  type DataPoint,
  type RegressionResult,
} from "@/lib/stats";

type User = { id: string; name: string; email: string };

export default function RegressionPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<DataPoint[]>([
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 5 },
  ]);
  const [result, setResult] = useState<RegressionResult | null>(null);
  const [newX, setNewX] = useState("");
  const [newY, setNewY] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/login");
          return;
        }
        setUser(d.user);
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    setResult(computeLinearRegression(points));
  }, [points]);

  function addPoint() {
    const x = parseFloat(newX);
    const y = parseFloat(newY);
    if (Number.isNaN(x) || Number.isNaN(y)) return;
    setPoints((p) => [...p, { x, y }]);
    setNewX("");
    setNewY("");
  }

  function removePoint(i: number) {
    setPoints((p) => p.filter((_, idx) => idx !== i));
  }

  function updatePoint(i: number, field: "x" | "y", value: string) {
    const num = parseFloat(value);
    setPoints((prev) =>
      prev.map((pt, idx) =>
        idx === i ? { ...pt, [field]: Number.isNaN(num) ? pt[field] : num } : pt
      )
    );
  }

  function clearAll() {
    setPoints([]);
    setResult(null);
  }

  function loadSample() {
    setPoints([
      { x: 2, y: 4 },
      { x: 3, y: 5 },
      { x: 5, y: 7 },
      { x: 7, y: 10 },
      { x: 9, y: 15 },
      { x: 11, y: 14 },
      { x: 12, y: 17 },
    ]);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/60">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Simple Linear Regression</h1>
            <p className="text-sm text-white/60">
              Enter paired data (X, Y) → get equation, r, strength & scatter plot
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadSample} className="btn btn-secondary text-sm">
              Load Sample
            </button>
            <button onClick={clearAll} className="btn btn-ghost text-sm">
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Data entry */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-3 font-semibold text-white">Data Points</h2>

              <div className="mb-3 flex gap-2">
                <input
                  type="number"
                  step="any"
                  className="input"
                  placeholder="X"
                  value={newX}
                  onChange={(e) => setNewX(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPoint()}
                />
                <input
                  type="number"
                  step="any"
                  className="input"
                  placeholder="Y"
                  value={newY}
                  onChange={(e) => setNewY(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPoint()}
                />
                <button onClick={addPoint} className="btn btn-primary shrink-0">
                  Add
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-black/40 text-white/70">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">#</th>
                      <th className="px-3 py-2 text-left font-medium">X</th>
                      <th className="px-3 py-2 text-left font-medium">Y</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((pt, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-3 py-1.5 text-white/40">{i + 1}</td>
                        <td className="px-1 py-1">
                          <input
                            type="number"
                            step="any"
                            className="w-full rounded bg-transparent px-2 py-1 text-white outline-none focus:bg-white/10"
                            value={pt.x}
                            onChange={(e) => updatePoint(i, "x", e.target.value)}
                          />
                        </td>
                        <td className="px-1 py-1">
                          <input
                            type="number"
                            step="any"
                            className="w-full rounded bg-transparent px-2 py-1 text-white outline-none focus:bg-white/10"
                            value={pt.y}
                            onChange={(e) => updatePoint(i, "y", e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button
                            onClick={() => removePoint(i)}
                            className="text-red-400/80 hover:text-red-300 text-xs"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {points.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-white/40">
                          No points yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-white/40">{points.length} point(s) · min 2 required</p>
            </div>

            {/* Results card */}
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-3 font-semibold text-white">Results</h2>
              {result ? (
                <div className="space-y-3 text-sm">
                  <div className="rounded-xl bg-black/30 p-3">
                    <p className="text-white/50 text-xs mb-1">Regression Equation</p>
                    <p className="text-lg font-mono font-semibold text-cyan-300">
                      {result.equation}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">Slope (b)</p>
                      <p className="font-mono text-white">{result.slope.toFixed(6)}</p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">Intercept (a)</p>
                      <p className="font-mono text-white">{result.intercept.toFixed(6)}</p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">Correlation r</p>
                      <p className="font-mono text-white">{result.r.toFixed(6)}</p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">r²</p>
                      <p className="font-mono text-white">{result.rSquared.toFixed(6)}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/30 p-3">
                    <p className="text-white/50 text-xs">Strength of Relationship</p>
                    <p className={`text-lg font-semibold ${result.strengthColor}`}>
                      {result.strength}
                      <span className="ml-2 text-sm font-normal text-white/50">
                        (|r| = {Math.abs(result.r).toFixed(3)})
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-sm">
                  Add at least 2 data points to compute the regression.
                </p>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 glass rounded-2xl p-5">
            <div className="chart-wrap">
              <ScatterChart points={points} result={result} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
