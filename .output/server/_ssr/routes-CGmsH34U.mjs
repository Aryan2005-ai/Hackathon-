import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as isNullish } from "./companyData-BuZUeMTN.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useCompany, n as companiesQueryOptions } from "./companyQueries-BKpORKP4.mjs";
import { F as ArrowRight, i as TrendingDown, m as MapPin, n as Users, r as TrendingUp, t as X, u as Search } from "../_libs/lucide-react.mjs";
import { t as CompanyLogo } from "./CompanyLogo-CsR3lT3d.mjs";
import { t as COLLEGE_NAME } from "./companies-B3INa5YB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CGmsH34U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIER_STYLE = {
	"Super Dream": "text-super-dream bg-super-dream/10 border-super-dream/30",
	Dream: "text-dream bg-dream/10 border-dream/30",
	Standard: "text-standard bg-standard/10 border-standard/30",
	Regular: "text-regular bg-regular/10 border-regular/30"
};
var FILTERS = [
	"All",
	"Super Dream",
	"Dream",
	"Standard",
	"Regular"
];
var Val = ({ v }) => isNullish(v) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: "italic text-muted-foreground",
	children: "not publicly available"
}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: v });
var CompanyCard = (0, import_react.memo)(function CompanyCard({ c, onOpen }) {
	const down = c.yoyGrowthRate.trim().startsWith("-");
	const Trend = down ? TrendingDown : TrendingUp;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => onOpen(c),
		className: "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-link/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
					name: c.name,
					logoUrl: c.logoUrl,
					websiteUrl: c.websiteUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_STYLE[c.companyType]}`,
					children: c.companyType
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-semibold leading-tight",
				children: c.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: c.shortName
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-1.5 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Val, { v: c.headquarters })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Val, { v: c.employeeSize })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `flex items-center gap-2 ${down ? "text-expert" : "text-standard"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trend, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Val, { v: c.yoyGrowthRate }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "YoY"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "absolute bottom-4 right-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link" })
		]
	});
});
function Index() {
	const navigate = useNavigate();
	const { selectCompany } = useCompany();
	const [query, setQuery] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("All");
	const { data: companies } = useSuspenseQuery(companiesQueryOptions);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebounced(query), 200);
		return () => clearTimeout(t);
	}, [query]);
	const searched = (0, import_react.useMemo)(() => {
		const q = debounced.toLowerCase().trim();
		return q ? companies.filter((c) => `${c.name} ${c.shortName} ${c.headquarters}`.toLowerCase().includes(q)) : companies;
	}, [companies, debounced]);
	const visible = filter === "All" ? searched : searched.filter((c) => c.companyType === filter);
	const onOpen = (0, import_react.useCallback)((c) => {
		selectCompany({
			companyId: c.id,
			companyName: c.shortName,
			logoUrl: c.logoUrl
		});
		navigate({ to: "/company/intelligence" });
	}, [selectCompany, navigate]);
	const reset = () => {
		setQuery("");
		setFilter("All");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-8 sm:py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest text-link",
						children: ["JSS", " · INTELLIGENCE PLATFORM"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 text-3xl font-semibold tracking-tight sm:text-4xl",
						children: [COLLEGE_NAME, " Companies Research & Placement Analytics Portal"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Your strategic edge for campus placements"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-6 max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search companies…",
								"aria-label": "Search companies",
								className: "h-11 w-full rounded-lg border bg-card pl-10 pr-10 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
							}),
							query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Clear search",
								onClick: () => setQuery(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scrollbar-none mb-5 flex gap-2 overflow-x-auto",
				children: FILTERS.map((f) => {
					const count = f === "All" ? searched.length : searched.filter((c) => c.companyType === f).length;
					const on = filter === f;
					const tone = f === "All" ? on ? "bg-primary text-primary-foreground border-primary" : "" : on ? TIER_STYLE[f] : "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilter(f),
						className: `shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${tone || "bg-card text-muted-foreground hover:bg-secondary"}`,
						children: [
							f,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 opacity-70",
								children: count
							})
						]
					}, f);
				})
			}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No companies match your search"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-4",
					onClick: reset,
					children: "Reset filters"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: visible.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyCard, {
					c,
					onOpen
				}, c.id))
			})]
		})]
	});
}
//#endregion
export { Index as component };
