"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuthStore } from "@/stores/authStore";
import clsx from "clsx";
import type { AlgorithmChallenge } from "@/types";

const challenges: AlgorithmChallenge[] = [];

type Difficulty = "all" | "easy" | "medium" | "hard";
type Status = "all" | "waiting" | "in_progress" | "completed";

export default function AlgorithmPage() {
  const { user } = useAuthStore();
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("all");
  const [statusFilter, setStatusFilter] = useState<Status>("all");

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;
    return matchesDifficulty && matchesStatus;
  });

  const totalSolved = challenges.filter(c => c.status === "completed").length;
  const inProgress = challenges.filter(c => c.status === "in_progress").length;
  const waiting = challenges.filter(c => c.status === "waiting").length;

  return (
    <PageLayout activePage="algorithm">
      <div className="h-full flex flex-col gap-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-primary)]/20 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tighter uppercase mb-1 flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              Algorithm_Challenge
            </h1>
            <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] font-mono">
              // WEEKLY_CODING_CHALLENGES
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Difficulty Filter */}
            <div className="flex border border-[var(--color-primary)]/30 rounded overflow-hidden">
              {(["all", "easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={clsx(
                    "px-3 py-2 text-[10px] font-mono uppercase tracking-widest transition-all",
                    difficultyFilter === diff
                      ? diff === "easy" ? "bg-emerald-500 text-black font-bold" :
                        diff === "medium" ? "bg-amber-500 text-black font-bold" :
                        diff === "hard" ? "bg-red-500 text-black font-bold" :
                        "bg-[var(--color-primary)] text-black font-bold"
                      : "bg-[var(--color-bg-black)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex border border-[var(--color-primary)]/30 rounded overflow-hidden">
              {(["all", "waiting", "in_progress", "completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={clsx(
                    "px-3 py-2 text-[10px] font-mono uppercase tracking-widest transition-all",
                    statusFilter === status
                      ? "bg-[var(--color-primary)] text-black font-bold"
                      : "bg-[var(--color-bg-black)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
                  )}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Challenges" value={challenges.length.toString()} />
          <StatCard label="Completed" value={totalSolved.toString()} color="text-emerald-400" />
          <StatCard label="In Progress" value={inProgress.toString()} color="text-amber-400" />
          <StatCard label="Waiting" value={waiting.toString()} color="text-[var(--color-text-secondary)]" />
        </div>

        {/* Challenge List */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
              <AnimatePresence mode="popLayout">
                {filteredChallenges.map((challenge, index) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                ))}
              </AnimatePresence>

              {filteredChallenges.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-[var(--color-text-muted)] font-mono text-sm">NO_CHALLENGES_MATCHING_FILTER</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function ChallengeCard({ challenge, index }: { challenge: AlgorithmChallenge; index: number }) {
  const solvedCount = challenge.participants.filter(p => p.solved).length;
  const totalParticipants = challenge.participants.length;

  const difficultyColors = {
    easy: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    medium: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    hard: "text-red-400 border-red-400/30 bg-red-400/10",
  };

  const statusColors = {
    waiting: "text-[var(--color-text-muted)]",
    in_progress: "text-cyan-400",
    completed: "text-emerald-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="border border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)] rounded-sm p-4 hover:border-[var(--color-primary)]/40 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] mb-1">
            {challenge.problemTitle}
          </h3>
          <div className="flex items-center gap-2">
            <span className={clsx(
              "text-[10px] font-mono uppercase px-2 py-0.5 border rounded",
              difficultyColors[challenge.difficulty]
            )}>
              {challenge.difficulty}
            </span>
            <span className={clsx("text-[10px] font-mono uppercase", statusColors[challenge.status])}>
              {challenge.status === "in_progress" && (
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              {challenge.status.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[var(--color-text-secondary)]">Solved</p>
          <p className="text-[14px] font-mono font-bold text-[var(--color-primary)]">
            {solvedCount}/{totalParticipants}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-[var(--color-bg-black)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(solvedCount / totalParticipants) * 100}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            className="h-full bg-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {challenge.participants.slice(0, 5).map((participant) => (
            <div
              key={participant.userId}
              className={clsx(
                "w-7 h-7 rounded-full border-2 border-[var(--color-bg-dark)] flex items-center justify-center text-[10px] font-bold",
                participant.solved
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-[var(--color-bg-black)] text-[var(--color-text-secondary)]"
              )}
              title={`${participant.username}${participant.solved && 'solveTime' in participant ? ` (${(participant as any).solveTime}min)` : ""}`}
            >
              {participant.username[0]}
            </div>
          ))}
          {challenge.participants.length > 5 && (
            <div className="w-7 h-7 rounded-full border-2 border-[var(--color-bg-dark)] bg-[var(--color-bg-black)] flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">
              +{challenge.participants.length - 5}
            </div>
          )}
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
          {new Date(challenge.startTime).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color = "text-[var(--color-primary)]" }: { label: string; value: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)] rounded-sm p-4"
    >
      <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">{label}</p>
      <p className={clsx("text-xl font-mono font-bold", color)}>{value}</p>
    </motion.div>
  );
}
