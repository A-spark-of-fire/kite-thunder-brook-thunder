import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex overflow-hidden rounded-2xl bg-foam", className)}>
      <img src="/brand/logo.jpg" alt="SUPEYO" className="size-full object-cover" />
    </span>
  );
}

export function BrandLockup({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandMark className={compact ? "size-10 rounded-xl" : "size-12"} />
      <span className="leading-tight">
        <span className={cn("block font-display font-semibold tracking-tight", compact ? "text-base" : "text-lg", inverted ? "text-paper" : "text-navy")}>
          SUPEYO
        </span>
        <span className={cn("block text-[10px] font-medium uppercase tracking-[0.16em]", inverted ? "text-cyan-soft" : "text-muted")}>
          Packaged Drinking Water
        </span>
      </span>
    </span>
  );
}
