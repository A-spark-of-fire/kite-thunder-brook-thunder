import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as AGENCY } from "./agency-dJTRPtCM.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { n as Input, t as Field } from "./input-DRl6J15Q.mjs";
import { t as BrandLockup } from "./logo-B5LF_Sqk.mjs";
import { t as authClient } from "./client-DUtYoQbQ.mjs";
import { t as useCurrentUserState } from "./use-current-user-DO223Pw-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CSffRCgq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isPending && user) navigate({ to: "/" });
	}, [
		isPending,
		user,
		navigate
	]);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const { error: err } = await authClient.signIn.email({
				email,
				password
			});
			if (err) throw new Error(err.message || "Could not sign in");
			window.location.assign("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not sign in");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "navy-wash grid min-h-dvh place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-2xl font-semibold text-ink",
					children: "Welcome back"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Sign in to order SUPEYO water and track deliveries."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								autoComplete: "email",
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
							children: busy ? "Signing in…" : "Sign in"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						className: "text-brand",
						children: "Forgot password?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "text-brand",
						children: "Create account"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-xs text-muted",
					children: [
						AGENCY.company,
						" · ",
						AGENCY.phones[0]
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
