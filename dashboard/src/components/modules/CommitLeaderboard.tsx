"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { CommitRanking } from "@/types";

interface CommitLeaderboardProps {
  rankings: CommitRanking[];
  delay?: number;
  className?: string;
}

export function CommitLeaderboard({ rankings, delay = 0, className }: CommitLeaderboardProps) {
  return (
    <motion.div
      id="github"
      className={clsx(
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)] p-4 md:p-6 lg:p-8 rounded-sm",
        "shadow-[inset_0_0_20px_rgba(170,207,209,0.02)]",
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
          Commit Leaderboard
        </h3>
        <svg className="w-5 h-5 text-[var(--color-primary)]/60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </div>

      {/* Ranking List */}
      <div className="space-y-4 md:space-y-6">
        {rankings.length > 0 ? (
          rankings.slice(0, 5).map((user, index) => (
            <motion.div
              key={user.userId}
              className="flex items-center justify-between group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.05 * index }}
            >
              {/* Left: Rank + Avatar + Name */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                {/* Rank */}
                <span
                  className={clsx(
                    "font-mono text-xs w-5",
                    index === 0 && "text-[var(--color-warning)]",
                    index > 0 && "text-[var(--color-text-secondary)]/50"
                  )}
                >
                  {String(user.rank).padStart(2, "0")}
                </span>

                {/* Avatar */}
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full border p-0.5 shrink-0",
                    index === 0
                      ? "border-[var(--color-warning)] shadow-[0_0_10px_rgba(255,200,50,0.2)]"
                      : "border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]"
                  )}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-sm">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name */}
                <span className="text-sm font-bold tracking-tight truncate">
                  {user.username.toUpperCase()}
                </span>
              </div>

              {/* Right: Commits */}
              <div className="text-right shrink-0">
                <span className="font-mono text-sm block">{user.commits}</span>
                <span className="text-[8px] text-[var(--color-text-secondary)] uppercase">
                  Commits
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 opacity-50">
            <span className="text-2xl block mb-2">0</span>
            <span className="text-xs">NO COMMITS YET</span>
          </div>
        )}
      </div>

      {/* Total Stats */}
      {rankings.length > 0 && (
        <div className="mt-6 md:mt-8 pt-4 border-t border-[var(--color-primary)]/10">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--color-text-secondary)]/50">TOTAL COMMITS</span>
            <span className="font-mono text-[var(--color-primary)]">
              {rankings.reduce((acc, r) => acc + r.commits, 0)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
