import { STATUS_META, type OrderStatus } from "@/lib/agency";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const meta = STATUS_META[status as OrderStatus] ?? { label: status, short: status, tone: "mute" as const };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
