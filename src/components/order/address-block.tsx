import { MapPin } from "lucide-react";
import type { Address, AddressInput } from "@/lib/types";

export function AddressBlock({ address, name }: { address: Address | AddressInput | null | undefined; name?: string }) {
  if (!address?.line1) return <p className="text-sm text-muted">No delivery address saved yet.</p>;
  return (
    <div className="flex gap-3 text-sm">
      <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" />
      <div className="min-w-0">
        {name ? <p className="font-semibold text-ink">{name}</p> : null}
        <p className="text-ink">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
        <p className="text-muted">{address.city}, {address.state} {address.pincode}</p>
        {address.landmark ? <p className="text-xs text-muted">Landmark: {address.landmark}</p> : null}
      </div>
    </div>
  );
}
