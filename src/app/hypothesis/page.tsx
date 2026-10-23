"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NormalCurveChart from "@/components/NormalCurveChart";
import {
  computeZTest,
  type TailType,
  type ZTestResult,
} from "@/lib/stats";

type User = { id: string; name: string; email: string };

export default function HypothesisPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inputs
  const [h0, setH0] = useState("μ = 50");
  const [h1, setH1] = useState("μ ≠ 50");
  const [sampleMean, setSampleMean] = useState("52");
  const [popMean, setPopMean] = useState("50");
  const [sigma, setSigma] = useState("10");
  const [n, setN] = useState("36");
  const [alpha, setAlpha] = useState("0.05");
  const [tail, setTail] = useState<TailType>("two");

  const [result, setResult] = useState<ZTestResult | null>(null);
  const [error, setError] = useState("");

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

  function runTest() {
    setError("");
    const sm = parseFloat(sampleMean);
    const pm = parseFloat(popMean);
    const s = parseFloat(sigma);
    const nn = parseInt(n, 10);
    const a = parseFloat(alpha);

    if ([sm, pm, s, nn, a].some((v) => Number.isNaN(v))) {
      setError("All numeric fields are required.");
      return;
    }
    if (s <= 0 || nn < 1 || a <= 0 || a >= 1) {
      setError("σ must be > 0, n ≥ 1, and 0 < α < 1.");
      return;
    }

    const res = computeZTest({
      sampleMean: sm,
      populationMean: pm,
      sigma: s,
      n: nn,
      alpha: a,
      tail,
    });
    setResult(res);
  }

  // Sync H1 suggestion when tail changes
  function onTailChange(t: TailType) {
    setTail(t);
    const mu = popMean || "μ₀";
    if (t === "left") setH1(`μ < ${mu}`);
    else if (t === "right") setH1(`μ > ${mu}`);
    else setH1(`μ ≠ ${mu}`);
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Hypothesis Testing (Z-Test)</h1>
          <p className="text-sm text-white/60">
            One-sample Z-test for a population mean · state hypotheses · decide with α
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-white">Hypotheses</h2>
              <div>
                <label>Null Hypothesis (H₀)</label>
                <input
                  className="input"
                  value={h0}
                  onChange={(e) => setH0(e.target.value)}
                  placeholder="e.g. μ = 50"
                />
              </div>
              <div>
                <label>Alternative Hypothesis (H₁)</label>
                <input
                  className="input"
                  value={h1}
                  onChange={(e) => setH1(e.target.value)}
                  placeholder="e.g. μ ≠ 50"
                />
              </div>

              <div>
                <label>Test type (tail)</label>
                <div className="flex gap-2">
                  {(
                    [
                      ["left", "Left-tailed"],
                      ["right", "Right-tailed"],
                      ["two", "Two-tailed"],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => onTailChange(val)}
                      className={`btn flex-1 text-xs py-2 ${
                        tail === val ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-white">Test Parameters</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Sample mean (x̄)</label>
                  <input
                    type="number"
                    step="any"
                    className="input"
                    value={sampleMean}
                    onChange={(e) => setSampleMean(e.target.value)}
                  />
                </div>
                <div>
                  <label>Population mean (μ₀)</label>
                  <input
                    type="number"
                    step="any"
                    className="input"
                    value={popMean}
                    onChange={(e) => setPopMean(e.target.value)}
                  />
                </div>
                <div>
                  <label>σ (population SD)</label>
                  <input
                    type="number"
                    step="any"
                    className="input"
                    value={sigma}
                    onChange={(e) => setSigma(e.target.value)}
                  />
                </div>
                <div>
                  <label>Sample size (n)</label>
                  <input
                    type="number"
                    className="input"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label>Significance level (α)</label>
                <select
                  className="input"
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                >
                  <option value="0.01">0.01</option>
                  <option value="0.05">0.05</option>
                  <option value="0.10">0.10</option>
                </select>
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button onClick={runTest} className="btn btn-primary w-full py-3">
                Compute Z-Test
              </button>
            </div>
          </div>

          {/* Results + chart */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-3 font-semibold text-white">Results</h2>
              {result ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">Z-statistic</p>
                      <p className="font-mono text-lg text-cyan-300">
                        {result.zStatistic.toFixed(4)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">Critical value(s)</p>
                      <p className="font-mono text-white">
                        {result.criticalValues.map((v) => v.toFixed(4)).join(" , ")}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-3">
                      <p className="text-white/50 text-xs">p-value (approx)</p>
                      <p className="font-mono text-white">{result.pValue.toFixed(6)}</p>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-4 border ${
                      result.decision === "Reject H₀"
                        ? "bg-red-500/15 border-red-500/40"
                        : "bg-emerald-500/15 border-emerald-500/40"
                    }`}
                  >
                    <p className="text-xs text-white/50 mb-1">Decision</p>
                    <p
                      className={`text-xl font-bold ${
                        result.decision === "Reject H₀"
                          ? "text-red-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {result.decision}
                    </p>
                    <p className="mt-1 text-sm text-white/70">{result.decisionDetail}</p>
                  </div>

                  <div className="rounded-xl bg-black/30 p-3 text-xs text-white/50 space-y-1">
                    <p>
                      <span className="text-white/70">H₀:</span> {h0}
                    </p>
                    <p>
                      <span className="text-white/70">H₁:</span> {h1}
                    </p>
                    <p>
                      α = {result.alpha} · {result.tail}-tailed test
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-sm">
                  Fill in the parameters and click &quot;Compute Z-Test&quot;.
                </p>
              )}
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="chart-wrap">
                <NormalCurveChart
                  result={result}
                  zStatistic={result?.zStatistic}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
