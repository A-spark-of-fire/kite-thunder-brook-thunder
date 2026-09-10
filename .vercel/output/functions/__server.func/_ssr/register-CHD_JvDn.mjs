import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { o as indianMobile } from "./map-CpHYkenY.mjs";
import { d as updateMyProfile, l as saveMyAddress } from "./profile-Qkt-X-zb.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { n as Input, t as Field } from "./input-DRl6J15Q.mjs";
import { t as BrandLockup } from "./logo-B5LF_Sqk.mjs";
import { t as authClient } from "./client-DUtYoQbQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-CHD_JvDn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		mobile: "",
		email: "",
		password: "",
		line1: "",
		city: "Kalinagar / Taherpur",
		pincode: "741254",
		landmark: ""
	});
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!indianMobile(form.mobile)) {
			setError("Enter a valid 10-digit mobile number.");
			return;
		}
		setBusy(true);
		try {
			const { error: err } = await authClient.signUp.email({
				email: form.email,
				password: form.password,
				name: form.fullName
			});
			if (err) throw new Error(err.message || "Could not create account");
			await updateMyProfile({ data: {
				fullName: form.fullName,
				mobile: form.mobile,
				altMobile: ""
			} });
			await saveMyAddress({ data: {
				label: "Home",
				line1: form.line1,
				line2: "",
				city: form.city,
				state: "West Bengal",
				pincode: form.pincode,
				landmark: form.landmark
			} });
			window.location.assign("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not create account");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "navy-wash min-h-dvh px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-md rounded-[28px] border border-paper/10 bg-paper p-6 shadow-float sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-2xl font-semibold",
					children: "Create your account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "A few details so we can deliver water to your door."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.fullName,
								onChange: (e) => set("fullName", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mobile number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								inputMode: "numeric",
								maxLength: 10,
								value: form.mobile,
								onChange: (e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								value: form.email,
								onChange: (e) => set("email", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Password",
							hint: "At least 8 characters",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								required: true,
								minLength: 8,
								value: form.password,
								onChange: (e) => set("password", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Delivery address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "House / road / area",
								value: form.line1,
								onChange: (e) => set("line1", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "City / town",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.city,
									onChange: (e) => set("city", e.target.value)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "PIN code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									inputMode: "numeric",
									maxLength: 6,
									value: form.pincode,
									onChange: (e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Landmark (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.landmark,
								onChange: (e) => set("landmark", e.target.value)
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
							children: busy ? "Creating account…" : "Create account"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-sm text-muted",
					children: ["Already registered? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-brand",
						children: "Sign in"
					})]
				})] })
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
