"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Announcement } from "@/types";

interface BroadcastsProps {
  announcements: Announcement[];
  delay?: number;
  className?: string;
}

export function Broadcasts({ announcements, delay = 0, className }: BroadcastsProps) {
  // Sort by date (newest first) and limit to 5
  const sortedAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <motion.div
      className={clsx(
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)] rounded-sm overflow-hidden",
        "panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 border-b border-[var(--color-primary)]/10 bg-[var(--color-primary)]/5 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--color-primary)]">
          Broadcasts
        </h3>
        <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">
          SECURE_CHANNEL_01
        </span>
      </div>

      {/* Announcements List */}
      <div className="divide-y divide-[var(--color-primary)]/5">
        {sortedAnnouncements.length > 0 ? (
          sortedAnnouncements.map((announcement, index) => (
            <BroadcastItem
              key={announcement.id}
              announcement={announcement}
              delay={delay + 0.05 * index}
            />
          ))
        ) : (
          <div className="px-8 py-8 text-center text-[var(--color-text-secondary)]/50 text-sm">
            No broadcasts available
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface BroadcastItemProps {
  announcement: Announcement;
  delay: number;
}

function BroadcastItem({ announcement, delay }: BroadcastItemProps) {
  const date = new Date(announcement.createdAt);
  const isRead = false; // Mock - would come from user state
  const isNew = Date.now() - date.getTime() < 24 * 60 * 60 * 1000; // Less than 24 hours

  const priorityStyles = {
    urgent: "bg-[var(--color-error)]",
    important: "bg-[var(--color-warning)]",
    normal: isNew ? "bg-[var(--color-primary)]" : "border border-[var(--color-primary)]/30",
  };

  return (
    <motion.div
      className={clsx(
        "px-4 md:px-6 lg:px-8 py-4 md:py-5",
        "flex items-center justify-between gap-4",
        "hover:bg-[var(--color-primary)]/5 transition-colors cursor-pointer"
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      {/* Left side */}
      <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
        {/* Status Indicator */}
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full shrink-0",
            priorityStyles[announcement.priority],
            announcement.priority === "urgent" && "animate-pulse shadow-[0_0_8px_var(--color-error)]",
            isNew && announcement.priority === "normal" && "shadow-[0_0_8px_var(--color-accent-glow)]"
          )}
        />

        {/* Title */}
        <span
          className={clsx(
            "text-sm font-medium tracking-tight truncate",
            !isRead && "text-[var(--color-primary)]",
            isRead && "text-[var(--color-text-secondary)]"
          )}
        >
          {announcement.title}
        </span>
      </div>

      {/* Date */}
      <span className="text-xs font-mono text-[var(--color-text-secondary)] shrink-0">
        {formatDate(date)}
      </span>
    </motion.div>
  );
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
