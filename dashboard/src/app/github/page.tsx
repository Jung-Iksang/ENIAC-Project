"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuthStore } from "@/stores/authStore";
import clsx from "clsx";
import type { CommitRanking } from "@/types";

const commitRankings: CommitRanking[] = [];
const recentCommits: { id: string; user: string; repo: string; message: string; time: string }[] = [];

export default function GithubPage() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");

  const totalCommits = useMemo(() =>
    commitRankings.reduce((sum, r) => sum + r.commits, 0),
    []
  );

  return (
    <PageLayout activePage="github">
      <div className="h-full flex flex-col gap-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-primary)]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tighter uppercase mb-1 flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Github_Activity
            </h1>
            <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] font-mono">
              // COMMIT_LEADERBOARD_AND_ACTIVITY_LOG
            </p>
          </div>

          <div className="flex border border-[var(--color-primary)]/30 rounded overflow-hidden">
            {(["week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={clsx(
                  "px-4 py-2 text-[11px] font-mono uppercase tracking-widest transition-all",
                  timeRange === range
                    ? "bg-[var(--color-primary)] text-black font-bold"
                    : "bg-[var(--color-bg-black)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
                )}
              >
                {range === "week" ? "This Week" : range === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Commits" value={totalCommits.toString()} />
          <StatCard label="Active Contributors" value={commitRankings.length.toString()} />
          <StatCard label="Top Contributor" value={commitRankings[0]?.username || "N/A"} highlight />
          <StatCard label="Your Rank" value={user ? "#3" : "N/A"} />
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-hidden">
          {/* Leaderboard */}
          <div className="lg:col-span-3 border border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)] rounded-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--color-primary)]/10">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Commit Leaderboard
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-[var(--color-primary)]/10">
                {commitRankings.length === 0 && (
                  <div className="flex items-center justify-center h-full p-8">
                    <p className="text-[12px] text-[var(--color-text-muted)] font-mono uppercase tracking-widest">NO_DATA_AVAILABLE</p>
                  </div>
                )}
                {commitRankings.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={clsx(
                      "flex items-center gap-4 p-4 hover:bg-[var(--color-primary)]/5 transition-colors",
                      index < 3 && "bg-[var(--color-primary)]/5"
                    )}
                  >
                    {/* Rank */}
                    <div className={clsx(
                      "w-8 h-8 flex items-center justify-center font-mono font-bold text-[14px]",
                      index === 0 ? "text-[var(--color-warning)]" :
                      index === 1 ? "text-gray-300" :
                      index === 2 ? "text-amber-600" : "text-[var(--color-text-secondary)]"
                    )}>
                      {String(user.rank).padStart(2, "0")}
                    </div>

                    {/* Avatar */}
                    <div className={clsx(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center text-[14px] font-bold",
                      index === 0 ? "border-[var(--color-warning)] bg-[var(--color-warning)]/20" :
                      "border-[var(--color-primary)]/30 bg-[var(--color-bg-black)]"
                    )}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                      ) : (
                        user.username[0]
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <p className="text-[14px] font-bold">{user.username}</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">
                        {user.commits} commits
                      </p>
                    </div>

                    {/* Trend */}
                    <div className={clsx(
                      "text-[12px] font-mono",
                      user.trend === "up" ? "text-emerald-400" :
                      user.trend === "down" ? "text-red-400" : "text-[var(--color-text-muted)]"
                    )}>
                      {user.trend === "up" ? "▲" : user.trend === "down" ? "▼" : "—"}
                    </div>

                    {/* Commit Bar */}
                    <div className="w-24 h-2 bg-[var(--color-bg-black)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.commits / commitRankings[0].commits) * 100}%` }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                        className={clsx(
                          "h-full",
                          index === 0 ? "bg-[var(--color-warning)]" : "bg-[var(--color-primary)]"
                        )}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Commits */}
          <div className="lg:col-span-2 border border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)] rounded-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--color-primary)]/10">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Recent Activity
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-[var(--color-primary)]/10">
                {recentCommits.length === 0 && (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-[12px] text-[var(--color-text-muted)] font-mono uppercase tracking-widest">NO_DATA_AVAILABLE</p>
                  </div>
                )}
                {recentCommits.map((commit, index) => (
                  <motion.div
                    key={commit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-[var(--color-primary)]/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-bold text-[var(--color-primary)]">{commit.user}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">→</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">{commit.repo}</span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-primary)] truncate mb-1">
                      {commit.message}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
                      {commit.time}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "border border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)] rounded-sm p-4",
        highlight && "border-[var(--color-warning)]/30"
      )}
    >
      <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">{label}</p>
      <p className={clsx(
        "text-xl font-mono font-bold",
        highlight ? "text-[var(--color-warning)]" : "text-[var(--color-primary)]"
      )}>
        {value}
      </p>
    </motion.div>
  );
}
