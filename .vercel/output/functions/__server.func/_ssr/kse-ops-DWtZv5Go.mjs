import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { n as Input, t as Field } from "./input-DRl6J15Q.mjs";
import { n as useMe } from "./queries-358qrJwg.mjs";
import { t as BrandLockup } from "./logo-B5LF_Sqk.mjs";
import { t as authClient } from "./client-DUtYoQbQ.mjs";
import { t as useCurrentUserState } from "./use-current-user-DO223Pw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kse-ops-DWtZv5Go.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgencyOpsPage() {
	const { user, isPending } = useCurrentUserState();
	const me = useMe(Boolean(user) && !isPending);
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const role = me.data?.profile.role;
	const isStaff = role === "admin" || role === "staff";
	(0, import_react.useEffect)(() => {
		if (!isPending && user && isStaff) navigate({ to: "/admin" });
	}, [
		isPending,
		user,
		isStaff,
		navigate
	]);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const res = await fetch("/api/desk", {
				method: "POST",
				headers: { "content-type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					email,
					password
				})
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok || !payload.ok) throw new Error(payload.error || "Could not open the agency desk");
			await authClient.getSession();
			window.location.assign("/admin");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open the agency desk");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "navy-wash grid min-h-dvh place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted",
					children: "Internal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-semibold text-ink",
					children: "Agency operations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Staff sign-in for the Kalpataru delivery desk."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Desk email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								autoComplete: "username",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								autoComplete: "current-password",
								required: true,
								minLength: 8,
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Opening desk…" : "Open agency desk"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { AgencyOpsPage as component };
