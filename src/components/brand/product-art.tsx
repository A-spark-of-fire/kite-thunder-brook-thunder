import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductArt({ artKey, className }: { artKey: string; className?: string }) {
  return (
    <div className={cn("relative grid place-items-center overflow-hidden rounded-2xl bg-linear-to-b from-foam to-cyan-soft", className)}>
      <svg viewBox="0 0 80 96" className="h-[78%] w-auto text-brand" aria-hidden>
        {artKey === "pack1" ? <Pack /> : artKey === "bottle5" ? <Bottle /> : <Jar tall={artKey === "jar20"} />}
      </svg>
      <Droplets className="absolute right-2 top-2 size-4 text-cyan" />
    </div>
  );
}

function Jar({ tall }: { tall: boolean }) {
  const y = tall ? 8 : 16;
  const h = tall ? 72 : 60;
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <rect x="28" y={y - 6} width="24" height="8" rx="2" />
      <path d={`M22 ${y} h36 l4 8 v${h - 16} a12 12 0 0 1 -12 12 h-20 a12 12 0 0 1 -12 -12 v-${h - 16} z`} />
      <path d={`M26 ${y + 18} h28`} opacity="0.45" />
    </g>
  );
}
function Bottle() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <rect x="34" y="6" width="12" height="10" rx="2" />
      <path d="M30 16 h20 l4 10 v52 a10 10 0 0 1 -10 10 h-8 a10 10 0 0 1 -10 -10 v-52 z" />
    </g>
  );
}
function Pack() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="10" y="28" width="18" height="48" rx="5" />
      <rect x="31" y="22" width="18" height="54" rx="5" />
      <rect x="52" y="28" width="18" height="48" rx="5" />
    </g>
  );
}
