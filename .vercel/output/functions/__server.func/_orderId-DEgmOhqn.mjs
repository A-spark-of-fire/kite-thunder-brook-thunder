import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { i as STATUS_META, r as ORDER_STATUSES, s as TIME_SLOTS } from "./_ssr/agency-dJTRPtCM.mjs";
import { i as formatDateTime, o as inr } from "./_ssr/utils-sqhcPpa2.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as Route$1 } from "./_ssr/router-hnHv4KGW.mjs";
import { t as Button } from "./_ssr/button-DyWRsNxk.mjs";
import { t as PageSkeleton } from "./_ssr/skeleton-Cz8ZXMNQ.mjs";
import { t as AddressBlock } from "./_ssr/address-block-37kaDHCN.mjs";
import { t as Card } from "./_ssr/card-CsmvjG3B.mjs";
import { t as StatusBadge } from "./_ssr/status-badge-g_qyIrGI.mjs";
import { t as DeliveryTimeline } from "./_ssr/timeline-eNA_min_.mjs";
import { p as adminUpdateOrder, r as adminListAgents, t as adminGetOrder } from "./_ssr/admin-ncbwCwg6.mjs";
import { t as Field } from "./_ssr/input-Cbf0m3GD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_orderId-DEgmOhqn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrderDetail() {
	const { orderId } = Route$1.useParams();
	const id = Number(orderId);
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin-order", id],
		queryFn: () => adminGetOrder({ data: { id } }),
		enabled: Number.isFinite(id)
	});
	const agents = useQuery({
		queryKey: ["admin-agents"],
		queryFn: () => adminListAgents()
	});
	const o = q.data;
	const [status, setStatus] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [slot, setSlot] = (0, import_react.useState)("");
	const [agentId, setAgentId] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: () => adminUpdateOrder({ data: {
			id,
			status: status || o?.status,
			preferredDate: date || o?.preferredDate,
			timeSlot: slot || o?.timeSlot,
			assignedAgentId: agentId === "" ? o?.assignedAgent?.id ?? null : agentId === "none" ? null : Number(agentId)
		} }),
		onSuccess: async () => {
			toast.success("Order updated");
			await qc.invalidateQueries({ queryKey: ["admin-order", id] });
			await qc.invalidateQueries({ queryKey: ["admin-orders"] });
			await qc.invalidateQueries({ queryKey: ["admin-stats"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {});
	if (!o) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: ["Order not found. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/admin/orders",
		className: "text-brand",
		children: "Back"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/orders",
				className: "text-sm text-brand",
				children: "← Orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-semibold text-brand",
						children: o.orderNumber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: o.customerName || "Customer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							o.customerMobile,
							" · placed ",
							formatDateTime(o.createdAt)
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryTimeline, { status: o.status }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm",
							value: status || o.status,
							onChange: (e) => setStatus(e.target.value),
							children: ORDER_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: STATUS_META[s].label
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Delivery date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm",
								value: date || o.preferredDate,
								onChange: (e) => setDate(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Time slot",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm",
								value: slot || o.timeSlot,
								onChange: (e) => setSlot(e.target.value),
								children: TIME_SLOTS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: t.id,
									children: [
										t.label,
										" · ",
										t.hint
									]
								}, t.id))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Assign delivery person",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm",
							value: agentId || (o.assignedAgent ? String(o.assignedAgent.id) : "none"),
							onChange: (e) => setAgentId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "Unassigned"
							}), (agents.data ?? []).filter((a) => a.isActive || a.id === o.assignedAgent?.id).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: a.id,
								children: [
									a.name,
									" · ",
									a.phone
								]
							}, a.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(),
						disabled: save.isPending,
						children: save.isPending ? "Saving…" : "Update order"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted",
					children: "Items"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line text-sm",
					children: o.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							i.quantity,
							" × ",
							i.productName
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: inr(i.lineTotal)
						})]
					}, i.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-right font-semibold tabular-nums",
					children: inr(o.total)
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted",
				children: "Address"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, {
				address: o.address,
				name: o.customerName
			})] })
		]
	});
}
//#endregion
export { AdminOrderDetail as component };
