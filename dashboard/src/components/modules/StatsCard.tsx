"use client";

import { motion } from "framer-motion";
import { ProgressBar } from "@/components/ui";
import clsx from "clsx";
import type { ServerStatus } from "@/types";

export type StatsCardType = "cpu" | "ram" | "uptime" | "temp";

interface StatsCardProps {
  type: StatsCardType;
  data: ServerStatus | null;
  delay?: number;
  className?: string;
}

const iconMap: Record<StatsCardType, React.ReactNode> = {
  cpu: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  ram: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  uptime: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  temp: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const labelMap: Record<StatsCardType, string> = {
  cpu: "CPU",
  ram: "RAM",
  uptime: "UPTIME",
  temp: "TEMP",
};

export function StatsCard({ type, data, delay = 0, className }: StatsCardProps) {
  const { value, displayValue, subValue, variant, showProgress } = getCardData(type, data);

  return (
    <motion.div
      className={clsx(
        "p-4 md:p-6 border border-[var(--color-primary)]/10",
        "bg-[var(--color-bg-dark)] rounded-sm",
        "hover:border-[var(--color-primary)]/40 transition-all duration-300",
        "shadow-[0_0_15px_rgba(0,0,0,0.5)]",
        "panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest">
          {labelMap[type]}
        </span>
        <span className="text-[var(--color-primary)]/40">{iconMap[type]}</span>
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-2xl md:text-3xl font-mono font-bold text-[var(--color-primary)]">
          {displayValue}
          {subValue && (
            <span className="text-sm text-[var(--color-text-secondary)]/50">
              {subValue}
            </span>
          )}
        </p>
      </div>

      {/* Progress Bar or Status */}
      {showProgress ? (
        <div className="w-full h-[2px] bg-[var(--color-bg-black)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-primary)]"
            style={{
              boxShadow: "0 0 10px var(--color-accent-glow)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, delay: delay * 0.1 + 0.2 }}
          />
        </div>
      ) : (
        <p className="text-[9px] text-[var(--color-text-secondary)]/50 uppercase tracking-wider">
          Status: {variant === "error" ? "Critical" : variant === "warning" ? "Warning" : "Optimal"}
        </p>
      )}
    </motion.div>
  );
}

function getCardData(type: StatsCardType, data: ServerStatus | null) {
  switch (type) {
    case "cpu":
      const cpuValue = data?.cpu ?? 0;
      return {
        value: cpuValue,
        displayValue: data ? `${cpuValue.toFixed(1)}%` : "--%",
        subValue: null,
        variant: cpuValue > 80 ? "error" : cpuValue > 60 ? "warning" : "default",
        showProgress: true,
      };

    case "ram":
      const ramUsed = data?.ram.used ? data.ram.used / 1024 : 0;
      const ramTotal = data?.ram.total ? data.ram.total / 1024 : 32;
      const ramPercent = data?.ram.percentage ?? 0;
      return {
        value: ramPercent,
        displayValue: data ? ramUsed.toFixed(1).padStart(4, "0") : "--",
        subValue: data ? `/${ramTotal.toFixed(0)}` : null,
        variant: ramPercent > 80 ? "error" : ramPercent > 60 ? "warning" : "default",
        showProgress: true,
      };

    case "uptime":
      const uptime = data?.uptime ?? 0;
      const days = Math.floor(uptime / 86400);
      return {
        value: 100,
        displayValue: data ? `${days}D` : "--D",
        subValue: null,
        variant: "default",
        showProgress: false,
      };

    case "temp":
      const temp = data?.temperature ?? 0;
      return {
        value: temp,
        displayValue: data ? `${temp.toFixed(1)}°` : "--°",
        subValue: null,
        variant: temp > 80 ? "error" : temp > 70 ? "warning" : "default",
        showProgress: true,
      };

    default:
      return {
        value: 0,
        displayValue: "--",
        subValue: null,
        variant: "default",
        showProgress: false,
      };
  }
}
