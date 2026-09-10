import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as AGENCY } from "./agency-dJTRPtCM.mjs";
import { u as submitContact } from "./profile-Qkt-X-zb.mjs";
import { d as Phone, h as Mail, m as MapPin } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { n as useMe } from "./queries-Y89j3blD.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-DRl6J15Q.mjs";
import { t as CustomerShell } from "./customer-shell-UoFAhJ0p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-C0Lqv3ks.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactInner, {}) });
}
function ContactInner() {
	const me = useMe();
	const s = me.data?.settings;
	const profile = me.data?.profile;
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [callerPhone, setCallerPhone] = (0, import_react.useState)("");
	const agencyPhone = s?.phonePrimary ?? AGENCY.phones[0];
	const phone2 = s?.phoneSecondary ?? AGENCY.phones[1];
	const email = s?.email ?? AGENCY.email;
	const address = s?.addressLine ?? AGENCY.address;
	async function send() {
		setBusy(true);
		try {
			await submitContact({ data: {
				name: profile?.fullName || "Customer",
				phone: profile?.mobile || callerPhone,
				email: profile?.email ?? "",
				message
			} });
			setMessage("");
			toast.success("Message sent to the agency");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not send");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Contact the agency"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: s?.companyName ?? AGENCY.company
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${agencyPhone}`,
					className: "rounded-3xl border border-line bg-paper p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5 text-cyan" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-semibold",
							children: agencyPhone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Primary"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${phone2}`,
					className: "rounded-3xl border border-line bg-paper p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5 text-cyan" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-semibold",
							children: phone2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Alternate"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 size-4 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${email}`,
							className: "text-brand",
							children: email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: address })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["Proprietor ", s?.proprietor ?? AGENCY.proprietor]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold",
						children: "Send a message"
					}),
					!profile?.mobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Your mobile",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							maxLength: 10,
							value: callerPhone,
							onChange: (e) => setCallerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Your message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							minLength: 8,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							placeholder: "Ask about a delivery, jar refill, or bulk order…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: busy || message.trim().length < 8,
						onClick: send,
						children: busy ? "Sending…" : "Send message"
					})
				]
			})
		]
	});
}
//#endregion
export { ContactPage as component };
