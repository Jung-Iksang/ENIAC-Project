"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { User } from "@/types";

// Extended user type with activity status
interface ActiveUser extends User {
  activity?: string;
}

interface ActiveNodesProps {
  users: User[];
  delay?: number;
  className?: string;
}

export function ActiveNodes({ users, delay = 0, className }: ActiveNodesProps) {
  const onlineUsers = users.filter((u) => u.status === "online");
  const offlineUsers = users.filter((u) => u.status === "offline");

  const usersWithActivity: ActiveUser[] = users.map((user) => ({
    ...user,
    activity: user.status === "online" ? "Active" : "Idle / Listening",
  }));

  return (
    <motion.div
      id="members"
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
          Active Nodes
        </h3>
        <span className="text-[10px] font-mono bg-[var(--color-primary)] text-[var(--color-bg-black)] px-2 py-0.5">
          {onlineUsers.length} ONLINE
        </span>
      </div>

      {/* User List */}
      <div className="space-y-4 md:space-y-6 max-h-[300px] overflow-y-auto">
        {usersWithActivity.slice(0, 5).map((user, index) => (
          <motion.div
            key={user.id}
            className={clsx(
              "flex items-center gap-3 md:gap-4 group",
              user.status === "offline" && "opacity-50"
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.05 * index }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg-black)] flex items-center justify-center text-sm">
                  {user.name[0]}
                </div>
              )}
              {/* Status Indicator */}
              <div
                className={clsx(
                  "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--color-bg-dark)]",
                  user.status === "online"
                    ? "bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-accent-glow)]"
                    : "bg-[var(--color-text-secondary)]/30"
                )}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)]/50" />
                <p className="text-[10px] text-[var(--color-text-secondary)] uppercase truncate">
                  {user.activity}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expand Button */}
      <button
        className={clsx(
          "w-full mt-6 md:mt-8 py-3",
          "border border-[var(--color-primary)]/20",
          "text-[10px] uppercase tracking-[0.3em]",
          "hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-black)]",
          "transition-all duration-300"
        )}
      >
        Expand Registry
      </button>

      {/* Offline Count */}
      {offlineUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/10">
          <p className="text-[10px] text-[var(--color-text-secondary)]/50 text-center">
            {offlineUsers.length} nodes offline
          </p>
        </div>
      )}
    </motion.div>
  );
}
