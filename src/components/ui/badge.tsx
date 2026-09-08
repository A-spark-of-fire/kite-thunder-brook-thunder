import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  blue: "bg-foam text-brand border-line",
  cyan: "bg-cyan-soft text-navy border-cyan/30",
  amber: "bg-warn-soft text-warn border-warn/20",
  navy: "bg-navy text-paper border-navy",
  green: "bg-ok-soft text-ok border-ok/20",
  red: "bg-danger-soft text-danger border-danger/20",
  mute: "bg-ice text-muted border-line",
};

export function Badge({
  tone = "blue", className, ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide", tones[tone], className)} {...props} />
  );
}
