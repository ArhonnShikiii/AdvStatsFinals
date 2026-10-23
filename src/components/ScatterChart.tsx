"use client";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import type { DataPoint, RegressionResult } from "@/lib/stats";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

type Props = {
  points: DataPoint[];
  result: RegressionResult | null;
};

export default function ScatterChart({ points, result }: Props) {
  if (points.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white/40">
        Add data points to see the scatter diagram
      </div>
    );
  }

  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const pad = (maxX - minX) * 0.1 || 1;
  const lineStart = minX - pad;
  const lineEnd = maxX + pad;

  const datasets: any[] = [
    {
      label: "Data points",
      data: points,
      backgroundColor: "rgba(99, 102, 241, 0.9)",
      borderColor: "rgba(165, 180, 252, 1)",
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false,
    },
  ];

  if (result) {
    datasets.push({
      label: "Regression line",
      data: [
        { x: lineStart, y: result.intercept + result.slope * lineStart },
        { x: lineEnd, y: result.intercept + result.slope * lineEnd },
      ],
      type: "line" as const,
      borderColor: "rgba(34, 211, 238, 1)",
      borderWidth: 2.5,
      pointRadius: 0,
      fill: false,
      tension: 0,
    });
  }

  return (
    <Scatter
      data={{ datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "rgba(255,255,255,0.8)" },
          },
          title: {
            display: true,
            text: "Scatter Diagram with Regression Line",
            color: "rgba(255,255,255,0.9)",
            font: { size: 14 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const p = ctx.raw as DataPoint;
                return `X: ${p.x}, Y: ${p.y}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "X", color: "rgba(255,255,255,0.7)" },
            ticks: { color: "rgba(255,255,255,0.6)" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y: {
            title: { display: true, text: "Y", color: "rgba(255,255,255,0.7)" },
            ticks: { color: "rgba(255,255,255,0.6)" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      }}
    />
  );
}
