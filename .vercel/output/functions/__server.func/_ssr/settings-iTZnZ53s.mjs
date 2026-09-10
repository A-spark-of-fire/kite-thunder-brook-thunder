import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { a as adminListInbox, d as adminSaveSettings, f as adminTogglePayment, l as adminSaveAgent, n as adminGetSettings, r as adminListAgents, s as adminListPayments } from "./admin-C7gXAG3o.mjs";
import { n as Input, t as Field } from "./input-DRl6J15Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-iTZnZ53s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettingsPage() {
	const qc = useQueryClient();
	const settings = useQuery({
		queryKey: ["admin-settings"],
		queryFn: () => adminGetSettings()
	});
	const payments = useQuery({
		queryKey: ["admin-payments"],
		queryFn: () => adminListPayments()
	});
	const agents = useQuery({
		queryKey: ["admin-agents"],
		queryFn: () => adminListAgents()
	});
	const inbox = useQuery({
		queryKey: ["admin-inbox"],
		queryFn: () => adminListInbox()
	});
	const [form, setForm] = (0, import_react.useState)({
		brandName: "",
		companyName: "",
		proprietor: "",
		phonePrimary: "",
		phoneSecondary: "",
		email: "",
		addressLine: "",
		fssai: "",
		upiId: ""
	});
	const [agent, setAgent] = (0, import_react.useState)({
		name: "",
		phone: ""
	});
	(0, import_react.useEffect)(() => {
		if (settings.data) setForm(settings.data);
	}, [settings.data]);
	const save = useMutation({
		mutationFn: () => adminSaveSettings({ data: form }),
		onSuccess: async () => {
			toast.success("Agency details saved");
			await qc.invalidateQueries({ queryKey: ["admin-settings"] });
			await qc.invalidateQueries({ queryKey: ["settings-public"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const togglePay = useMutation({
		mutationFn: (p) => adminTogglePayment({ data: p }),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["admin-payments"] });
			await qc.invalidateQueries({ queryKey: ["payments"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const addAgent = useMutation({
		mutationFn: () => adminSaveAgent({ data: {
			name: agent.name,
			phone: agent.phone,
			isActive: true
		} }),
		onSuccess: async () => {
			setAgent({
				name: "",
				phone: ""
			});
			toast.success("Delivery person added");
			await qc.invalidateQueries({ queryKey: ["admin-agents"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold",
						children: "Agency details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.brandName,
							onChange: (e) => setForm((f) => ({
								...f,
								brandName: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Company",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.companyName,
							onChange: (e) => setForm((f) => ({
								...f,
								companyName: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Proprietor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.proprietor,
							onChange: (e) => setForm((f) => ({
								...f,
								proprietor: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phonePrimary,
								onChange: (e) => setForm((f) => ({
									...f,
									phonePrimary: e.target.value
								}))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Alternate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phoneSecondary,
								onChange: (e) => setForm((f) => ({
									...f,
									phoneSecondary: e.target.value
								}))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.email,
							onChange: (e) => setForm((f) => ({
								...f,
								email: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.addressLine,
							onChange: (e) => setForm((f) => ({
								...f,
								addressLine: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "FSSAI",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.fssai,
							onChange: (e) => setForm((f) => ({
								...f,
								fssai: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "UPI ID (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.upiId,
							onChange: (e) => setForm((f) => ({
								...f,
								upiId: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(),
						disabled: save.isPending,
						children: save.isPending ? "Saving…" : "Save details"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold",
						children: "Payment methods"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Choose what customers can pick at checkout. Cash on Delivery stays on."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: (payments.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 rounded-2xl border border-line px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold",
								children: p.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: p.description
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: p.enabled,
									onChange: (e) => togglePay.mutate({
										id: p.id,
										enabled: e.target.checked
									})
								}), " On"]
							})]
						}, p.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold",
						children: "Delivery team"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: (agents.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between rounded-2xl border border-line px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted",
								children: a.phone
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: a.isActive ? "Active" : "Off"
							})]
						}, a.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Name",
							value: agent.name,
							onChange: (e) => setAgent((s) => ({
								...s,
								name: e.target.value
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Phone",
							value: agent.phone,
							onChange: (e) => setAgent((s) => ({
								...s,
								phone: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => addAgent.mutate(),
						disabled: addAgent.isPending,
						children: "Add delivery person"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-semibold",
					children: "Customer messages"
				}), (inbox.data?.messages ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No messages."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: inbox.data.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-line p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold",
							children: [
								m.name,
								" · ",
								m.phone
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: m.message
						})]
					}, m.id))
				})]
			})
		]
	});
}
//#endregion
export { AdminSettingsPage as component };
