import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as slotHint, t as AGENCY } from "./agency-dJTRPtCM.mjs";
import { i as formatDate, s as inr } from "./map-CpHYkenY.mjs";
import { T as ArrowRight, _ as Leaf, b as HeartPulse, c as ShieldCheck, d as Phone, i as Truck, x as Droplets } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-WqCaHdvQ.mjs";
import { n as Skeleton } from "./skeleton-BU4DGjVB.mjs";
import { n as useMe, o as useProducts, s as usePublicSettings, t as useCurrentDelivery } from "./queries-Y89j3blD.mjs";
import { t as AddressBlock } from "./address-block-37kaDHCN.mjs";
import { t as Card } from "./card-BNpU_TZN.mjs";
import { t as StatusBadge } from "./status-badge-BUKINHfK.mjs";
import { t as DeliveryTimeline } from "./timeline-bdgHRpua.mjs";
import { t as BrandLockup } from "./logo-B5LF_Sqk.mjs";
import { t as useCurrentUserState } from "./use-current-user-DO223Pw-.mjs";
import { t as CustomerShell } from "./customer-shell-UoFAhJ0p.mjs";
import { t as ProductArt } from "./product-art-0i75OcUS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cu7k1CHg.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, {
		requireAuth: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full rounded-3xl" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketingHome, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerHome, { name: user.displayName }) });
}
function CustomerHome({ name }) {
	const me = useMe();
	const current = useCurrentDelivery();
	const products = useProducts();
	const profile = me.data?.profile;
	const settings = me.data?.settings;
	const incomplete = profile && (!profile.mobile || !profile.address);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-[28px] border border-line bg-paper shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "navy-wash relative px-5 py-6 text-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cyan-soft/90",
							children: "Namaskar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-2xl font-semibold",
							children: profile?.fullName || name || "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-md text-sm text-cyan-soft/80",
							children: AGENCY.promise
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 p-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "h-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/order",
							children: ["Order Water ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "secondary",
						className: "h-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orders",
							children: "My Orders"
						})
					})]
				})]
			}),
			incomplete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-warn/30 bg-warn-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-ink",
						children: "Complete your profile to order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "We need your mobile number and a delivery address before the first order."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-3",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							children: "Update profile"
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 font-display text-lg font-semibold",
				children: "Current delivery"
			}), current.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-3xl" }) : current.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-semibold text-brand",
							children: current.data.orderNumber
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								formatDate(current.data.preferredDate),
								" · ",
								slotHint(current.data.timeSlot)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: current.data.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryTimeline, { status: current.data.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink",
						children: current.data.items.map((i) => `${i.quantity} × ${i.productName}`).join(", ")
					}),
					current.data.assignedAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4 text-cyan" }),
							current.data.assignedAgent.name,
							" · ",
							current.data.assignedAgent.phone
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orders/$orderId",
							params: { orderId: String(current.data.id) },
							children: "View details"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No active delivery"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Place an order and we will bring fresh water to you."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-8 text-cyan" })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted",
				children: "Saved address"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, {
					address: profile?.address,
					name: profile?.fullName
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-lg font-semibold",
				children: "Popular sizes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: (products.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/order",
					className: "rounded-3xl border border-line bg-paper p-3 shadow-card transition-transform duration-150 hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductArt, {
							artKey: p.artKey,
							className: "h-24"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-semibold leading-tight",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-brand",
							children: inr(p.unitPrice)
						})
					]
				}, p.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${settings?.phonePrimary ?? AGENCY.phones[0]}`,
					className: "flex items-center gap-3 rounded-3xl border border-line bg-paper p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-2xl bg-foam text-brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold",
						children: "Call the agency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: settings?.phonePrimary ?? AGENCY.phones[0]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/contact",
					className: "flex items-center gap-3 rounded-3xl border border-line bg-paper p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-2xl bg-foam text-brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold",
						children: "Help & support"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Message Kalpataru"
					})] })]
				})]
			})
		]
	});
}
function MarketingHome() {
	const products = useProducts();
	const s = usePublicSettings().data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerShell, {
		requireAuth: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "overflow-hidden rounded-[28px] border border-line bg-paper shadow-float",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "navy-wash px-5 py-8 text-paper sm:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, { inverted: true }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 max-w-lg font-display text-3xl font-semibold leading-tight sm:text-4xl",
								children: "Pure water, delivered to your door."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 max-w-md text-sm text-cyan-soft/90 sm:text-base",
								children: [s?.companyName ?? AGENCY.company, ". Sealed SUPEYO jars and bottles for homes, shops, and offices across Nadia."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "cyan",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/register",
										children: "Order water"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: "I already have an account"
									})
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/brand/poster.jpg",
						alt: "SUPEYO packaged drinking water",
						className: "h-56 w-full object-cover object-center sm:h-72"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						{
							icon: Droplets,
							label: "100% Pure"
						},
						{
							icon: ShieldCheck,
							label: "Safe & hygienic"
						},
						{
							icon: Leaf,
							label: "Natural goodness"
						},
						{
							icon: HeartPulse,
							label: "Better health"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-3 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 text-cyan" }), item.label]
					}, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-3 sm:grid-cols-3",
					children: [
						{
							n: "1",
							t: "Create your account",
							d: "Save your name, mobile, and delivery address."
						},
						{
							n: "2",
							t: "Place an order",
							d: "Pick jar size, quantity, and a delivery slot."
						},
						{
							n: "3",
							t: "Track & receive",
							d: "Follow the status until SUPEYO arrives at your door."
						}
					].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-3xl border border-line bg-paper p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 place-items-center rounded-full bg-foam font-display text-sm font-semibold text-brand",
								children: step.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-semibold",
								children: step.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: step.d
							})
						]
					}, step.n))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Our water"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: (products.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-line bg-paper p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductArt, {
								artKey: p.artKey,
								className: "h-24"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-brand",
								children: inr(p.unitPrice)
							})
						]
					}, p.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display font-semibold",
							children: s?.companyName ?? AGENCY.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Proprietor ", s?.proprietor ?? AGENCY.proprietor]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: s?.addressLine ?? AGENCY.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-brand",
								href: `tel:${s?.phonePrimary ?? AGENCY.phones[0]}`,
								children: s?.phonePrimary ?? AGENCY.phones[0]
							}), s?.phoneSecondary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-brand",
								href: `tel:${s.phoneSecondary}`,
								children: s.phoneSecondary
							})] }) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: ["FSSAI ", s?.fssai ?? AGENCY.fssai]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { HomePage as component };
