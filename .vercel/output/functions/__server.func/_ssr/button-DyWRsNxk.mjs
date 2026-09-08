import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./utils-sqhcPpa2.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DyWRsNxk.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			primary: "bg-brand text-paper shadow-card hover:bg-navy",
			secondary: "bg-paper text-ink border border-line hover:border-line-strong hover:bg-foam",
			cyan: "bg-cyan text-navy-deep hover:bg-cyan/90",
			ghost: "bg-transparent text-ink hover:bg-foam",
			danger: "bg-danger text-paper hover:bg-danger/90",
			navy: "bg-navy text-paper hover:bg-navy-deep",
			outline: "border border-brand/25 bg-transparent text-brand hover:bg-foam"
		},
		size: {
			sm: "h-9 rounded-lg px-3 text-sm",
			md: "h-11 rounded-xl px-4 text-sm",
			lg: "h-12 rounded-2xl px-5 text-base",
			icon: "size-11 rounded-xl"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
