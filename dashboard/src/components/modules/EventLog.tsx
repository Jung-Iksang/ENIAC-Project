"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Schedule as ScheduleType } from "@/types";

interface EventLogProps {
  schedules: ScheduleType[];
  delay?: number;
  className?: string;
}

export function EventLog({ schedules, delay = 0, className }: EventLogProps) {
  // Sort by date and get upcoming events
  const upcomingSchedules = schedules
    .filter((s) => new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <motion.div
      id="schedule"
      className={clsx(
        "border border-[var(--color-primary)]/10 bg-[var(--color-bg-dark)] p-4 md:p-6 lg:p-8 rounded-sm",
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
          Event Log
        </h3>
        <svg className="w-5 h-5 text-[var(--color-primary)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </div>

      {/* Event Timeline */}
      <div className="space-y-4 md:space-y-6">
        {upcomingSchedules.length > 0 ? (
          upcomingSchedules.map((schedule, index) => (
            <EventItem
              key={schedule.id}
              schedule={schedule}
              isLast={index === upcomingSchedules.length - 1}
              delay={delay + 0.1 * index}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <span className="text-2xl mb-2">📅</span>
            <span className="text-xs">NO UPCOMING EVENTS</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface EventItemProps {
  schedule: ScheduleType;
  isLast: boolean;
  delay: number;
}

function EventItem({ schedule, isLast, delay }: EventItemProps) {
  const date = new Date(schedule.date);
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();

  const daysUntil = Math.ceil(
    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      className="flex gap-3 md:gap-4 relative"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[15px] md:left-[15px] top-8 bottom-[-24px] w-[1px] bg-[var(--color-primary)]/10" />
      )}

      {/* Date Block */}
      <div
        className={clsx(
          "w-8 h-8 rounded-sm border flex flex-col items-center justify-center shrink-0",
          daysUntil <= 1
            ? "border-[var(--color-primary)]/40 shadow-[0_0_10px_var(--color-accent-glow)]"
            : "border-[var(--color-primary)]/20 bg-[var(--color-bg-black)]"
        )}
      >
        <span className="text-[8px] text-[var(--color-text-secondary)]">{month}</span>
        <span className="text-xs font-bold font-mono">{day}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-tight truncate">
          {schedule.title}
        </p>
        <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">
          {date.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {schedule.location && ` | ${schedule.location}`}
        </p>
      </div>

      {/* D-Day Badge */}
      {daysUntil <= 3 && (
        <motion.span
          className={clsx(
            "text-[10px] font-mono px-2 py-0.5 rounded-sm shrink-0",
            daysUntil === 0
              ? "bg-[var(--color-error)]/20 text-[var(--color-error)]"
              : daysUntil === 1
              ? "bg-[var(--color-warning)]/20 text-[var(--color-warning)]"
              : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          )}
          animate={daysUntil <= 1 ? { opacity: [1, 0.5, 1] } : undefined}
          transition={daysUntil <= 1 ? { duration: 1, repeat: Infinity } : undefined}
        >
          {daysUntil === 0 ? "TODAY" : `D-${daysUntil}`}
        </motion.span>
      )}
    </motion.div>
  );
}
