import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { t as AGENCY } from "./agency-dJTRPtCM.mjs";
import { d as updateMyProfile, l as saveMyAddress } from "./profile-Qkt-X-zb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { t as PageSkeleton } from "./skeleton-BU4DGjVB.mjs";
import { n as useMe } from "./queries-Y89j3blD.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { n as Input, t as Field } from "./input-DRl6J15Q.mjs";
import { n as SignOutButton } from "./gates-CX33zHYp.mjs";
import { t as CustomerShell } from "./customer-shell-UoFAhJ0p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DE6QXDyt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, {}) });
}
function ProfileForm() {
	const me = useMe();
	const qc = useQueryClient();
	const profile = me.data?.profile;
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		mobile: "",
		altMobile: "",
		label: "Home",
		line1: "",
		line2: "",
		city: "",
		state: "West Bengal",
		pincode: "",
		landmark: ""
	});
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		setForm({
			fullName: profile.fullName,
			mobile: profile.mobile,
			altMobile: profile.altMobile,
			label: profile.address?.label ?? "Home",
			line1: profile.address?.line1 ?? "",
			line2: profile.address?.line2 ?? "",
			city: profile.address?.city ?? "",
			state: profile.address?.state ?? "West Bengal",
			pincode: profile.address?.pincode ?? "",
			landmark: profile.address?.landmark ?? ""
		});
	}, [profile]);
	if (me.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {});
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function save() {
		setBusy(true);
		try {
			await updateMyProfile({ data: {
				fullName: form.fullName,
				mobile: form.mobile,
				altMobile: form.altMobile
			} });
			await saveMyAddress({ data: {
				label: form.label || "Home",
				line1: form.line1,
				line2: form.line2,
				city: form.city,
				state: form.state,
				pincode: form.pincode,
				landmark: form.landmark
			} });
			await qc.invalidateQueries({ queryKey: ["me"] });
			toast.success("Profile saved");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Profile"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: profile?.email
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.fullName,
							onChange: (e) => set("fullName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mobile number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							maxLength: 10,
							value: form.mobile,
							onChange: (e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Alternate number (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							maxLength: 10,
							value: form.altMobile,
							onChange: (e) => set("altMobile", e.target.value.replace(/\D/g, "").slice(0, 10))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold",
						children: "Delivery address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.label,
							onChange: (e) => set("label", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.line1,
							onChange: (e) => set("line1", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Area / locality (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.line2,
							onChange: (e) => set("line2", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.city,
								onChange: (e) => set("city", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "PIN",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								maxLength: 6,
								value: form.pincode,
								onChange: (e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "State",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.state,
							onChange: (e) => set("state", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Landmark",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.landmark,
							onChange: (e) => set("landmark", e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy,
				onClick: save,
				children: busy ? "Saving…" : "Save profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Need help?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: AGENCY.phones[0]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						children: "Contact"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignOutButton, {})
		]
	});
}
//#endregion
export { ProfilePage as component };
