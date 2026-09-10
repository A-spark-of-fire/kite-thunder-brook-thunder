import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { s as inr } from "./map-CpHYkenY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { c as adminListProducts, u as adminSaveProduct } from "./admin-C7gXAG3o.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-DRl6J15Q.mjs";
import { t as ProductArt } from "./product-art-0i75OcUS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-_iQ7Ernq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	name: "",
	sizeLabel: "",
	sizeMl: 0,
	unitPrice: 0,
	description: "",
	artKey: "jar20",
	isActive: true,
	sortOrder: 0
};
function AdminProductsPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => adminListProducts()
	});
	const [editing, setEditing] = (0, import_react.useState)(EMPTY);
	const save = useMutation({
		mutationFn: () => adminSaveProduct({ data: {
			id: editing.id,
			name: editing.name,
			sizeLabel: editing.sizeLabel,
			sizeMl: Number(editing.sizeMl) || 0,
			unitPrice: Number(editing.unitPrice) || 0,
			description: editing.description,
			artKey: editing.artKey,
			isActive: Boolean(editing.isActive),
			sortOrder: Number(editing.sortOrder) || 0
		} }),
		onSuccess: async () => {
			toast.success("Product saved");
			setEditing(EMPTY);
			await qc.invalidateQueries({ queryKey: ["admin-products"] });
			await qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Products"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: (q.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setEditing({
						...EMPTY,
						...p
					}),
					className: "flex w-full items-center gap-3 rounded-3xl border border-line bg-paper p-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductArt, {
						artKey: p.artKey,
						className: "size-16 rounded-2xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: [
								p.sizeLabel,
								" · ",
								inr(p.unitPrice),
								" · ",
								p.isActive ? "Active" : "Hidden"
							]
						})]
					})]
				}) }, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-semibold",
						children: editing.id ? "Edit product" : "Add product"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: editing.name,
							onChange: (e) => setEditing((s) => ({
								...s,
								name: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Size label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editing.sizeLabel,
								onChange: (e) => setEditing((s) => ({
									...s,
									sizeLabel: e.target.value
								}))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Price (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: editing.unitPrice,
								onChange: (e) => setEditing((s) => ({
									...s,
									unitPrice: Number(e.target.value)
								}))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: editing.description,
							onChange: (e) => setEditing((s) => ({
								...s,
								description: e.target.value
							}))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Artwork",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm",
							value: editing.artKey,
							onChange: (e) => setEditing((s) => ({
								...s,
								artKey: e.target.value
							})),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "jar20",
									children: "20L jar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "jar10",
									children: "10L jar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "bottle5",
									children: "5L bottle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pack1",
									children: "Bottle pack"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: editing.isActive,
							onChange: (e) => setEditing((s) => ({
								...s,
								isActive: e.target.checked
							}))
						}), " Visible to customers"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => save.mutate(),
							disabled: save.isPending,
							children: save.isPending ? "Saving…" : "Save product"
						}), editing.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setEditing(EMPTY),
							children: "Cancel"
						}) : null]
					})
				]
			})
		]
	});
}
//#endregion
export { AdminProductsPage as component };
