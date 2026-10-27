"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { AlgorithmChallenge } from "@/types";

interface AlgorithmMatrixProps {
  challenges: AlgorithmChallenge[];
  delay?: number;
  className?: string;
}

export function AlgorithmMatrix({ challenges, delay = 0, className }: AlgorithmMatrixProps) {
  // Calculate stats
  const completedCount = challenges.filter((c) => c.status === "completed").length;
  const totalSolved = challenges.reduce((acc, challenge) => {
    return acc + challenge.participants.filter((p) => p.solved).length;
  }, 0);

  // Mock stats
  const weeklyStreak = 12;
  const successRate = 78.4;

  return (
    <motion.div
      id="algorithm"
      className={clsx(
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)] p-4 md:p-6 lg:p-8 rounded-sm relative",
        "panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
          Algorithm Matrix
        </h3>
        <svg className="w-5 h-5 text-[var(--color-primary)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>

      {/* Circular Progress */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 border border-[var(--color-primary)]/10 rounded-full" />

          {/* Animated inner ring */}
          <motion.div
            className="absolute inset-2 border border-[var(--color-primary)]/20 rounded-full"
            style={{
              borderTopColor: "var(--color-primary)",
              boxShadow: "0 0 20px rgba(170, 207, 209, 0.1)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Center content */}
          <div className="text-center z-10">
            <motion.p
              className="text-3xl md:text-4xl font-mono font-bold text-[var(--color-primary)]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
            >
              {totalSolved || 852}
            </motion.p>
            <p className="text-[9px] text-[var(--color-text-secondary)] uppercase tracking-widest">
              Solved
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4 w-full">
          <StatBox label="Weekly Streak" value={`${weeklyStreak} DAYS`} delay={delay + 0.3} />
          <StatBox label="Success Rate" value={`${successRate}%`} delay={delay + 0.4} />
        </div>

        {/* Active Challenge Indicator */}
        {challenges.some((c) => c.status === "in_progress") && (
          <motion.div
            className="mt-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[var(--color-error)]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-error)]">
              Challenge Active
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  delay: number;
}

function StatBox({ label, value, delay }: StatBoxProps) {
  return (
    <motion.div
      className="p-3 border border-[var(--color-primary)]/10 bg-[var(--color-bg-black)] text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <p className="text-[8px] text-[var(--color-text-secondary)] uppercase mb-1">
        {label}
      </p>
      <p className="font-mono text-sm text-[var(--color-primary)]">{value}</p>
    </motion.div>
  );
}
