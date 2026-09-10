import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as hasGateSessionMarker } from "./verify.server-Fro_tWcV.mjs";
import { g as LogOut } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { r as signOut } from "./client-DUtYoQbQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gates-CX33zHYp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateOnServer = () => false;
function SignOutButton({ compact = false }) {
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if ((0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateOnServer)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: compact ? "ghost" : "secondary",
		size: compact ? "icon" : "md",
		disabled: signingOut,
		onClick: () => {
			setSigningOut(true);
			signOut("/").catch(() => setSigningOut(false));
		},
		"aria-label": "Log out",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), compact ? null : signingOut ? "Signing out…" : "Log out"]
	});
}
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
//#endregion
export { SignOutButton as n, RedirectToSignIn as t };
