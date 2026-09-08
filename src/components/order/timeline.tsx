import { Check, Circle, Truck, X } from "lucide-react";
import { STATUS_META, TIMELINE_STEPS, type OrderStatus } from "@/lib/agency";
import { cn } from "@/lib/utils";

export function DeliveryTimeline({ status }: { status: OrderStatus | string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
        <X className="size-4 shrink-0" /> This order was cancelled.
      </div>
    );
  }
  const current = TIMELINE_STEPS.indexOf(status as OrderStatus);
  return (
    <ol className="grid grid-cols-5 gap-1">
      {TIMELINE_STEPS.map((step, i) => {
        const done = current >= i;
        const Icon = step === "out_for_delivery" ? Truck : done ? Check : Circle;
        return (
          <li key={step} className="flex flex-col items-center gap-1.5 text-center">
            <span className={cn("grid size-8 place-items-center rounded-full border", done ? "border-brand bg-brand text-paper" : "border-line bg-paper text-muted", current === i && "ring-2 ring-cyan/50")}>
              <Icon className="size-3.5" />
            </span>
            <span className={cn("text-[10px] font-medium leading-tight", done ? "text-navy" : "text-muted")}>
              {STATUS_META[step].short}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
