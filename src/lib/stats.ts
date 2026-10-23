export type DataPoint = { x: number; y: number };

export type RegressionResult = {
  n: number;
  meanX: number;
  meanY: number;
  slope: number; // b
  intercept: number; // a
  equation: string;
  r: number;
  rSquared: number;
  strength: string;
  strengthColor: string;
};

export function computeLinearRegression(points: DataPoint[]): RegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let ssXY = 0;
  let ssXX = 0;
  let ssYY = 0;

  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    ssXY += dx * dy;
    ssXX += dx * dx;
    ssYY += dy * dy;
  }

  if (ssXX === 0) return null;

  const slope = ssXY / ssXX;
  const intercept = meanY - slope * meanX;

  const r = ssYY === 0 ? 0 : ssXY / Math.sqrt(ssXX * ssYY);
  const rSquared = r * r;

  const absR = Math.abs(r);
  let strength = "No correlation";
  let strengthColor = "text-slate-400";

  if (absR >= 0.9) {
    strength = "Very strong";
    strengthColor = "text-emerald-400";
  } else if (absR >= 0.7) {
    strength = "Strong";
    strengthColor = "text-green-400";
  } else if (absR >= 0.5) {
    strength = "Moderate";
    strengthColor = "text-yellow-400";
  } else if (absR >= 0.3) {
    strength = "Weak";
    strengthColor = "text-orange-400";
  } else if (absR > 0) {
    strength = "Very weak";
    strengthColor = "text-red-400";
  }

  const sign = intercept >= 0 ? "+" : "−";
  const absIntercept = Math.abs(intercept);
  const equation = `Y = ${slope.toFixed(4)}X ${sign} ${absIntercept.toFixed(4)}`;

  return {
    n,
    meanX,
    meanY,
    slope,
    intercept,
    equation,
    r,
    rSquared,
    strength,
    strengthColor,
  };
}

// ---- Z-Test (one-sample mean) ----

export type TailType = "left" | "right" | "two";

export type ZTestInput = {
  sampleMean: number;
  populationMean: number;
  sigma: number;
  n: number;
  alpha: number;
  tail: TailType;
};

export type ZTestResult = {
  zStatistic: number;
  criticalValue: number;
  criticalValues: number[]; // for two-tailed both sides
  pValue: number;
  decision: "Reject H₀" | "Fail to reject H₀";
  decisionDetail: string;
  alpha: number;
  tail: TailType;
};

/** Approximate standard normal CDF (Abramowitz & Stegun) */
function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

/** Approximate inverse normal CDF (Beasley-Springer-Moro) for common alphas */
function invNorm(p: number): number {
  // Common exact-ish values
  const table: Record<string, number> = {
    "0.001": 3.090232,
    "0.005": 2.575829,
    "0.01": 2.326348,
    "0.025": 1.959964,
    "0.05": 1.644854,
    "0.1": 1.281552,
  };
  const key = p.toFixed(3);
  if (table[key] !== undefined) return table[key];

  // Rational approximation
  if (p <= 0 || p >= 1) return NaN;
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806084161e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];

  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number, r: number;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  q = p - 0.5;
  r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

export function computeZTest(input: ZTestInput): ZTestResult | null {
  const { sampleMean, populationMean, sigma, n, alpha, tail } = input;
  if (n < 1 || sigma <= 0 || alpha <= 0 || alpha >= 1) return null;

  const se = sigma / Math.sqrt(n);
  const zStatistic = (sampleMean - populationMean) / se;

  let criticalValue = 0;
  let criticalValues: number[] = [];
  let pValue = 0;
  let reject = false;

  if (tail === "left") {
    criticalValue = -invNorm(1 - alpha);
    criticalValues = [criticalValue];
    pValue = normalCdf(zStatistic);
    reject = zStatistic <= criticalValue;
  } else if (tail === "right") {
    criticalValue = invNorm(1 - alpha);
    criticalValues = [criticalValue];
    pValue = 1 - normalCdf(zStatistic);
    reject = zStatistic >= criticalValue;
  } else {
    // two-tailed
    const zAlpha = invNorm(1 - alpha / 2);
    criticalValue = zAlpha;
    criticalValues = [-zAlpha, zAlpha];
    pValue = 2 * (1 - normalCdf(Math.abs(zStatistic)));
    reject = Math.abs(zStatistic) >= zAlpha;
  }

  const decision = reject ? "Reject H₀" : "Fail to reject H₀";
  const decisionDetail = reject
    ? `Since |Z| = ${Math.abs(zStatistic).toFixed(4)} exceeds the critical value, we reject the null hypothesis at α = ${alpha}.`
    : `Since |Z| = ${Math.abs(zStatistic).toFixed(4)} does not exceed the critical value, we fail to reject the null hypothesis at α = ${alpha}.`;

  return {
    zStatistic,
    criticalValue,
    criticalValues,
    pValue,
    decision,
    decisionDetail,
    alpha,
    tail,
  };
}

/** Generate points for standard normal PDF curve */
export function normalPdfPoints(
  from = -4,
  to = 4,
  steps = 200
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const step = (to - from) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = from + i * step;
    const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2);
    points.push({ x, y });
  }
  return points;
}
