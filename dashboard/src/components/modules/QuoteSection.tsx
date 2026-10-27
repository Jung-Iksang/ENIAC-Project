"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Quote } from "@/types";

interface QuoteSectionProps {
  quote: Quote | null;
  delay?: number;
  className?: string;
}

export function QuoteSection({ quote, delay = 0, className }: QuoteSectionProps) {
  return (
    <motion.section
      className={clsx(
        "p-4 md:p-6 lg:p-8 border border-[var(--color-primary)]/10",
        "bg-[var(--color-bg-dark)]/50 rounded-sm relative overflow-hidden",
        "panel-corners",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
        {/* Terminal Icon */}
        <div className="shrink-0">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-primary)]/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Quote Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.4em] mb-2">
            Kernel Message
          </p>

          {quote ? (
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-light italic text-[var(--color-text)]/90 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              "{quote.quote}"
            </motion.p>
          ) : (
            <motion.p
              className="text-lg opacity-50"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading wisdom...
            </motion.p>
          )}

          {/* Author */}
          {quote?.author && (
            <motion.p
              className="mt-2 text-xs text-[var(--color-text-secondary)]/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.4 }}
            >
              — {quote.author}
            </motion.p>
          )}
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />
    </motion.section>
  );
}
