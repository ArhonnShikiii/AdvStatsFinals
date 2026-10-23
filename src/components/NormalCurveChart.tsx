"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { normalPdfPoints, type ZTestResult, type TailType } from "@/lib/stats";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

type Props = {
  result: ZTestResult | null;
  zStatistic?: number;
};

export default function NormalCurveChart({ result, zStatistic }: Props) {
  const pdf = normalPdfPoints(-4, 4, 250);
  const labels = pdf.map((p) => p.x.toFixed(2));
  const density = pdf.map((p) => p.y);

  // Build rejection shading datasets
  const rejectionData = pdf.map((p) => {
    if (!result) return null;
    const { criticalValues, tail } = result;
    if (tail === "left") {
      return p.x <= criticalValues[0] ? p.y : null;
    }
    if (tail === "right") {
      return p.x >= criticalValues[0] ? p.y : null;
    }
    // two
    return p.x <= criticalValues[0] || p.x >= criticalValues[1] ? p.y : null;
  });

  const datasets: any[] = [
    {
      label: "Standard Normal PDF",
      data: density,
      borderColor: "rgba(99, 102, 241, 1)",
      backgroundColor: "rgba(99, 102, 241, 0.15)",
      fill: true,
      pointRadius: 0,
      borderWidth: 2,
      tension: 0.3,
    },
    {
      label: "Rejection region",
      data: rejectionData,
      borderColor: "rgba(239, 68, 68, 0.9)",
      backgroundColor: "rgba(239, 68, 68, 0.35)",
      fill: true,
      pointRadius: 0,
      borderWidth: 0,
      tension: 0.3,
      spanGaps: false,
    },
  ];

  // Mark Z statistic as a vertical annotation via a tiny dataset
  if (typeof zStatistic === "number" && !Number.isNaN(zStatistic)) {
    const zClamped = Math.max(-4, Math.min(4, zStatistic));
    const yAtZ =
      (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-zClamped * zClamped) / 2);
    datasets.push({
      label: `Z = ${zStatistic.toFixed(3)}`,
      data: labels.map((l) => {
        const x = parseFloat(l);
        return Math.abs(x - zClamped) < 0.03 ? yAtZ : null;
      }),
      borderColor: "rgba(34, 211, 238, 1)",
      backgroundColor: "rgba(34, 211, 238, 1)",
      pointRadius: 5,
      pointHoverRadius: 7,
      showLine: false,
    });
  }

  return (
    <Line
      data={{ labels, datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "rgba(255,255,255,0.8)" },
          },
          title: {
            display: true,
            text: "Normal Distribution Curve (Rejection regions shaded)",
            color: "rgba(255,255,255,0.9)",
            font: { size: 14 },
          },
          tooltip: {
            filter: (item) => item.datasetIndex === 0 || item.raw !== null,
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Z", color: "rgba(255,255,255,0.7)" },
            ticks: {
              color: "rgba(255,255,255,0.6)",
              maxTicksLimit: 9,
              callback: function (val, i) {
                const label = this.getLabelForValue(val as number);
                const n = parseFloat(label);
                if ([-4, -3, -2, -1, 0, 1, 2, 3, 4].includes(Math.round(n * 10) / 10)) {
                  return Math.round(n).toString();
                }
                return "";
              },
            },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
          y: {
            title: {
              display: true,
              text: "Density",
              color: "rgba(255,255,255,0.7)",
            },
            ticks: { color: "rgba(255,255,255,0.6)" },
            grid: { color: "rgba(255,255,255,0.06)" },
            beginAtZero: true,
          },
        },
      }}
    />
  );
}
