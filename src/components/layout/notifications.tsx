import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { listMyNotifications, markNotificationsRead } from "@/lib/server/profile";
import { cn, formatDateTime } from "@/lib/utils";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["notifications"], queryFn: () => listMyNotifications(), refetchInterval: 20_000 });
  const unread = q.data?.filter((n) => !n.isRead).length ?? 0;
  const mark = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
  return (
    <div className="relative">
      <button
        type="button"
        className="relative grid size-11 place-items-center rounded-xl text-navy hover:bg-foam"
        aria-label="Notifications"
        onClick={() => { setOpen((v) => !v); if (!open && unread > 0) mark.mutate(); }}
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-paper">{unread}</span>
        ) : null}
      </button>
      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close notifications" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-paper shadow-float">
            <p className="border-b border-line px-4 py-3 font-display text-sm font-semibold">Notifications</p>
            <ul className="max-h-80 overflow-auto">
              {(q.data ?? []).length === 0 ? (
                <li className="px-4 py-6 text-sm text-muted">No notifications yet.</li>
              ) : (q.data ?? []).map((n) => (
                <li key={n.id} className={cn("border-b border-line last:border-0", !n.isRead && "bg-ice")}>
                  {n.orderId ? (
                    <Link to="/orders/$orderId" params={{ orderId: String(n.orderId) }} className="block px-4 py-3" onClick={() => setOpen(false)}>
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      <p className="text-xs text-muted">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted">{formatDateTime(n.createdAt)}</p>
                    </Link>
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      <p className="text-xs text-muted">{n.body}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
