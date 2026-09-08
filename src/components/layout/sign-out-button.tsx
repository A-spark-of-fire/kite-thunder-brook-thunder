import { useState, useSyncExternalStore } from "react";
import { LogOut } from "lucide-react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { Button } from "@/components/ui/button";

const subscribeToNothing = () => () => {};
const noGateOnServer = () => false;

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const [signingOut, setSigningOut] = useState(false);
  const gateSession = useSyncExternalStore(subscribeToNothing, hasGateSessionMarker, noGateOnServer);
  if (!authEnabled || gateSession) return null;
  return (
    <Button
      type="button"
      variant={compact ? "ghost" : "secondary"}
      size={compact ? "icon" : "md"}
      disabled={signingOut}
      onClick={() => { setSigningOut(true); void signOut("/").catch(() => setSigningOut(false)); }}
      aria-label="Log out"
    >
      <LogOut className="size-4" />
      {compact ? null : signingOut ? "Signing out…" : "Log out"}
    </Button>
  );
}
