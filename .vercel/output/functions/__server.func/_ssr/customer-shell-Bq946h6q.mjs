import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatDateTime, n as cn } from "./utils-sqhcPpa2.mjs";
import { f as Package, o as ShoppingCart, r as UserRound, w as Bell, y as House } from "../_libs/lucide-react.mjs";
import { t as PageSkeleton } from "./skeleton-Cz8ZXMNQ.mjs";
import { i as listMyNotifications, o as markNotificationsRead } from "./profile-BI9MlK96.mjs";
import { t as BrandLockup } from "./logo-DC8nU-2k.mjs";
import { n as SignOutButton, t as RedirectToSignIn } from "./gates-GCdB6q6g.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customer-shell-Bq946h6q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsBell() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["notifications"],
		queryFn: () => listMyNotifications(),
		refetchInterval: 2e4
	});
	const unread = q.data?.filter((n) => !n.isRead).length ?? 0;
	const mark = useMutation({
		mutationFn: () => markNotificationsRead(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications"] });
			qc.invalidateQueries({ queryKey: ["me"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "relative grid size-11 place-items-center rounded-xl text-navy hover:bg-foam",
			"aria-label": "Notifications",
			onClick: () => {
				setOpen((v) => !v);
				if (!open && unread > 0) mark.mutate();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-paper",
				children: unread
			}) : null]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "fixed inset-0 z-40 cursor-default",
			"aria-label": "Close notifications",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-paper shadow-float",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-line px-4 py-3 font-display text-sm font-semibold",
				children: "Notifications"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-80 overflow-auto",
				children: (q.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted",
					children: "No notifications yet."
				}) : (q.data ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: cn("border-b border-line last:border-0", !n.isRead && "bg-ice"),
					children: n.orderId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/orders/$orderId",
						params: { orderId: String(n.orderId) },
						className: "block px-4 py-3",
						onClick: () => setOpen(false),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-ink",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted",
								children: formatDateTime(n.createdAt)
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-ink",
							children: n.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: n.body
						})]
					})
				}, n.id))
			})]
		})] }) : null]
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/order",
		label: "Order Water",
		icon: ShoppingCart
	},
	{
		to: "/orders",
		label: "My Orders",
		icon: Package
	},
	{
		to: "/profile",
		label: "Profile",
		icon: UserRound
	}
];
function CustomerShell({ children, requireAuth = true }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "water-wash min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line bg-paper/80 px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, { compact: true })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {})]
	});
	if (requireAuth && !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "water-wash min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "SUPEYO home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, { compact: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: (user ? NAV : NAV.filter((item) => item.to === "/" || item.to === "/order")).map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("rounded-full px-3.5 py-2 text-sm font-medium transition-colors", active ? "bg-foam text-brand" : "text-muted hover:bg-ice hover:text-ink"),
									children: item.label
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBell, {}) : null, user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignOutButton, { compact: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "rounded-full bg-brand px-3.5 py-2 text-sm font-medium text-paper",
								children: "Sign in"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:pb-12",
				children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-md md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-brand" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label === "Order Water" ? "Order" : item.label]
						}) }, item.to);
					})
				})
			}) : null
		]
	});
}
//#endregion
export { CustomerShell as t };
