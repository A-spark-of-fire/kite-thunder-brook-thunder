import { f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./utils-sqhcPpa2.mjs";
import { f as Package, l as Settings, n as Users, s as ShoppingBag, v as LayoutDashboard, x as Droplets } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DyWRsNxk.mjs";
import { t as PageSkeleton } from "./skeleton-Cz8ZXMNQ.mjs";
import { t as claimAdminDesk } from "./profile-BI9MlK96.mjs";
import { n as useMe } from "./queries-CqZwC5NC.mjs";
import { t as BrandLockup } from "./logo-DC8nU-2k.mjs";
import { n as SignOutButton, t as RedirectToSignIn } from "./gates-GCdB6q6g.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Q2qSMdSc.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/orders",
		label: "Orders",
		icon: ShoppingBag,
		exact: false
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Package,
		exact: false
	},
	{
		to: "/admin/customers",
		label: "Customers",
		icon: Users,
		exact: false
	},
	{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings,
		exact: false
	}
];
function AdminLayout() {
	const { user, isPending } = useCurrentUserState();
	const me = useMe(Boolean(user) && !isPending);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const qc = useQueryClient();
	const claim = useMutation({
		mutationFn: () => claimAdminDesk(),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["me"] });
			toast.success("Agency desk is ready.");
		},
		onError: (e) => toast.error(e.message)
	});
	if (isPending || user && me.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "navy-wash min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const profile = me.data?.profile;
	if (profile && !profile.canAccessAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "water-wash grid min-h-dvh place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-3xl border border-line bg-paper p-8 text-center shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "mx-auto size-8 text-brand" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-xl font-semibold",
					children: "Staff only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "The agency desk is for SUPEYO staff."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "Go to my portal"
					})
				})
			]
		})
	});
	if (profile && !profile.adminExists) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "water-wash grid min-h-dvh place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-3xl border border-line bg-paper p-8 text-center shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 font-display text-xl font-semibold",
					children: "Set up the agency desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No administrator yet. Claim the desk to manage products, orders, and deliveries."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					onClick: () => claim.mutate(),
					disabled: claim.isPending,
					children: claim.isPending ? "Setting up…" : "Become administrator"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-3 inline-block text-sm text-brand",
					children: "Back to customer portal"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-ice md:grid md:grid-cols-[240px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "navy-wash hidden flex-col text-paper md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, { inverted: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] uppercase tracking-[0.18em] text-cyan-soft/80",
						children: "Agency desk"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-1 px-3",
					children: NAV.map((item) => {
						const active = item.exact ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium", active ? "bg-paper/15 text-paper" : "text-cyan-soft/80 hover:bg-paper/10 hover:text-paper"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-xs text-cyan-soft/80 hover:text-paper",
						children: "Open customer portal"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, { compact: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "hidden text-sm text-muted md:block",
							children: ["Signed in as ", profile?.fullName || user.displayName]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignOutButton, {})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-auto border-b border-line bg-paper px-2 py-2 md:hidden",
					children: NAV.map((item) => {
						const active = item.exact ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: cn("shrink-0 rounded-full px-3 py-1.5 text-sm font-medium", active ? "bg-navy text-paper" : "text-muted"),
							children: item.label
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-5xl flex-1 px-4 py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})
			]
		})]
	});
}
var SplitComponent = AdminLayout;
//#endregion
export { SplitComponent as component };
