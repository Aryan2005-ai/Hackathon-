import { n as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as proficiencyToBloom, o as scoreToCriticality } from "./companyData-BuZUeMTN.mjs";
import { n as CompanyDataMissing } from "./CompanyDataError-MhoR4-1O.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useCompany, r as companyDetailsQueryOptions } from "./companyQueries-BKpORKP4.mjs";
import { A as ChevronDown, h as Lock } from "../_libs/lucide-react.mjs";
import { t as CompanyLogo } from "./CompanyLogo-CsR3lT3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.skills-j8LvhtlT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BLOOM = {
	CU: {
		label: "Comprehension & Understanding",
		text: "text-bloom-cu",
		bg: "bg-bloom-cu/10",
		bar: "bg-bloom-cu"
	},
	AP: {
		label: "Application",
		text: "text-bloom-ap",
		bg: "bg-bloom-ap/10",
		bar: "bg-bloom-ap"
	},
	AS: {
		label: "Analysis & Synthesis",
		text: "text-bloom-as",
		bg: "bg-bloom-as/10",
		bar: "bg-bloom-as"
	},
	EV: {
		label: "Evaluation",
		text: "text-bloom-ev",
		bg: "bg-bloom-ev/10",
		bar: "bg-bloom-ev"
	},
	CR: {
		label: "Creation",
		text: "text-bloom-cr",
		bg: "bg-bloom-cr/10",
		bar: "bg-bloom-cr"
	}
};
var CRIT = {
	Critical: {
		text: "text-expert",
		bg: "bg-expert/10",
		desc: "Score 7+ · must master before interviews"
	},
	Important: {
		text: "text-regular",
		bg: "bg-regular/10",
		desc: "Score 5–6 · strong working knowledge"
	},
	Baseline: {
		text: "text-standard",
		bg: "bg-standard/10",
		desc: "Below 5 · familiarity is enough"
	}
};
var SkillCard = (0, import_react.memo)(function SkillCard({ skill, topics }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const bloom = BLOOM[proficiencyToBloom(skill.score)];
	const code = proficiencyToBloom(skill.score);
	const crit = scoreToCriticality(skill.score);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: skill.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 font-semibold ${bloom.bg} ${bloom.text}`,
								children: code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 font-medium ${CRIT[crit].bg} ${CRIT[crit].text}`,
								children: crit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: skill.proficiency
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right font-heading text-lg font-semibold",
					children: [skill.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "/10"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-2 overflow-hidden rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full rounded-full ${bloom.bar}`,
					style: { width: `${skill.score * 10}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setOpen((o) => !o),
				className: "mt-3 flex w-full items-center justify-between text-sm font-medium text-link",
				children: ["10-level roadmap ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				initial: false,
				children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ol, {
					initial: {
						height: 0,
						opacity: 0
					},
					animate: {
						height: "auto",
						opacity: 1
					},
					exit: {
						height: 0,
						opacity: 0
					},
					className: "mt-2 space-y-1 overflow-hidden",
					children: topics.map((t) => {
						const locked = t.level_number > skill.score;
						const b = BLOOM[proficiencyToBloom(t.level_number)];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${locked ? "text-muted-foreground opacity-60" : b.bg}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `w-6 shrink-0 text-xs font-semibold ${locked ? "" : b.text}`,
									children: ["L", t.level_number]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: t.topic
								}),
								locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex shrink-0 items-center gap-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), "Beyond scope"]
								})
							]
						}, t.level_number);
					})
				})
			})
		]
	});
});
function SkillIntelligence() {
	const { selected } = useCompany();
	if (!selected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillIntelligenceContent, { companyId: selected.companyId });
}
function SkillIntelligenceContent({ companyId }) {
	const { selected } = useCompany();
	const { data } = useSuspenseQuery(companyDetailsQueryOptions(companyId));
	if (!selected || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyDataMissing, {});
	const { skills, topics } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-5 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
					name: selected.companyName,
					logoUrl: selected.logoUrl,
					className: "h-10 w-10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl font-semibold sm:text-2xl",
					children: [selected.companyName, " Skill Intelligence"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [skills.length, " skills · sorted by required level"]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-5",
				children: Object.keys(BLOOM).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-lg p-2.5 ${BLOOM[k].bg}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `font-heading font-bold ${BLOOM[k].text}`,
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: BLOOM[k].label
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-3",
				children: Object.keys(CRIT).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `text-sm font-semibold ${CRIT[k].text}`,
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: CRIT[k].desc
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillCard, {
					skill: s,
					topics: topics[s.id] ?? []
				}, s.id))
			})
		]
	});
}
//#endregion
export { SkillIntelligence as component };
