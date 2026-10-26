import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as titleCaseFromCode, s as splitItems, t as isNullish } from "./companyData-BuZUeMTN.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as CompanyDataMissing } from "./CompanyDataError-MhoR4-1O.mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useCompany, r as companyDetailsQueryOptions } from "./companyQueries-BKpORKP4.mjs";
import { C as Gift, D as Cpu, E as DollarSign, M as Briefcase, O as CirclePlay, P as Award, S as Globe, T as ExternalLink, _ as Leaf, a as Target, b as Handshake, c as Shield, d as Phone, g as Linkedin, j as Building2, l as ShieldCheck, m as MapPin, n as Users, o as Swords, p as Newspaper, r as TrendingUp, s as Star, w as Eye, x as GraduationCap, y as Heart } from "../_libs/lucide-react.mjs";
import { t as CompanyLogo } from "./CompanyLogo-CsR3lT3d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.intelligence-BeH_UuOP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var S = (title, icon, keys) => ({
	title,
	icon,
	keys
});
var SCHEMA = [
	S("Company Identity", Building2, [
		"name",
		"short_name",
		"category",
		"nature_of_company",
		"incorporation_year",
		"employee_size",
		"headquarters_address"
	]),
	S("Overview & Vision", Eye, [
		"overview_text",
		"vision_statement",
		"mission_statement",
		"core_values",
		"history_timeline"
	]),
	S("Leadership", Users, [
		"ceo_name",
		"ceo_linkedin_url",
		"key_leaders",
		"board_members",
		"warm_intro_pathways",
		"decision_maker_access"
	]),
	S("Funding & Financials", DollarSign, [
		"annual_revenue",
		"annual_profit",
		"revenue_mix",
		"valuation",
		"yoy_growth_rate",
		"profitability_status",
		"key_investors",
		"recent_funding_rounds",
		"total_capital_raised",
		"customer_acquisition_cost",
		"customer_lifetime_value",
		"cac_ltv_ratio",
		"burn_rate",
		"runway_months",
		"burn_multiplier"
	]),
	S("Global Presence", Globe, [
		"operating_countries",
		"office_count",
		"office_locations"
	]),
	S("Products & Services", Briefcase, [
		"offerings_description",
		"focus_sectors",
		"pain_points_addressed",
		"top_customers",
		"case_studies",
		"product_pipeline",
		"innovation_roadmap"
	]),
	S("Technology Stack", Cpu, [
		"tech_stack",
		"ai_ml_adoption_level",
		"tech_adoption_rating",
		"intellectual_property",
		"r_and_d_investment",
		"cybersecurity_posture"
	]),
	S("Partnerships & Ecosystem", Handshake, [
		"technology_partners",
		"partnership_ecosystem",
		"industry_associations"
	]),
	S("Competitive Landscape", Swords, [
		"key_competitors",
		"competitive_advantages",
		"unique_differentiators",
		"weaknesses_gaps",
		"benchmark_vs_peers",
		"market_share_percentage"
	]),
	S("Market Opportunity", Target, [
		"tam",
		"sam",
		"som",
		"future_projections",
		"strategic_priorities",
		"go_to_market_strategy",
		"key_challenges_needs"
	]),
	S("Core Value Proposition & ESG", Leaf, [
		"core_value_proposition",
		"esg_ratings",
		"carbon_footprint",
		"ethical_sourcing",
		"sustainability_csr"
	]),
	S("Culture & Work Life", Heart, [
		"work_culture_summary",
		"manager_quality",
		"psychological_safety",
		"feedback_culture",
		"diversity_metrics",
		"diversity_inclusion_score",
		"ethical_standards",
		"burnout_risk",
		"mission_clarity",
		"crisis_behavior",
		"employee_turnover",
		"avg_retention_tenure",
		"layoff_history",
		"hiring_velocity"
	]),
	S("Recent News & Milestones", Newspaper, ["recent_news", "exit_strategy_history"]),
	S("Sales & Customer Metrics", TrendingUp, [
		"sales_motion",
		"customer_concentration_risk",
		"churn_rate",
		"net_promoter_score",
		"customer_testimonials"
	]),
	S("Risk & Compliance", Shield, [
		"regulatory_status",
		"legal_issues",
		"supply_chain_dependencies",
		"geopolitical_risks",
		"macro_risks"
	]),
	S("Work Location & Commute", MapPin, [
		"remote_policy_details",
		"flexibility_level",
		"typical_hours",
		"overtime_expectations",
		"weekend_work",
		"location_centrality",
		"office_zone_type",
		"public_transport_access",
		"cab_policy",
		"airport_commute_time"
	]),
	S("Safety & Wellbeing", ShieldCheck, [
		"area_safety",
		"safety_policies",
		"infrastructure_safety",
		"emergency_preparedness",
		"health_support"
	]),
	S("Career Growth & Learning", GraduationCap, [
		"training_spend",
		"onboarding_quality",
		"learning_culture",
		"mentorship_availability",
		"internal_mobility",
		"promotion_clarity",
		"exposure_quality",
		"role_clarity",
		"early_ownership",
		"work_impact",
		"execution_thinking_balance",
		"automation_level",
		"cross_functional_exposure",
		"tools_access",
		"company_maturity",
		"skill_relevance",
		"exit_opportunities",
		"network_strength",
		"global_exposure",
		"client_quality"
	]),
	S("Brand & Reputation", Award, [
		"brand_value",
		"brand_sentiment_score",
		"awards_recognitions",
		"external_recognition",
		"event_participation",
		"marketing_video_url"
	]),
	S("Compensation & Benefits", Gift, [
		"fixed_vs_variable_pay",
		"bonus_predictability",
		"esops_incentives",
		"leave_policy",
		"family_health_insurance",
		"relocation_support",
		"lifestyle_benefits"
	]),
	S("Digital Presence & Ratings", Star, [
		"website_url",
		"website_quality",
		"website_rating",
		"website_traffic_rank",
		"social_media_followers",
		"glassdoor_rating",
		"indeed_rating",
		"google_rating",
		"linkedin_url",
		"twitter_handle",
		"facebook_url",
		"instagram_url"
	]),
	S("Contact Information", Phone, [
		"primary_contact_email",
		"primary_phone_number",
		"contact_person_name",
		"contact_person_title",
		"contact_person_email",
		"contact_person_phone"
	])
];
var LABELS = {
	overview_text: "Overview",
	offerings_description: "Offerings",
	headquarters_address: "Headquarters",
	ceo_linkedin_url: "CEO LinkedIn",
	linkedin_url: "LinkedIn",
	website_url: "Website",
	marketing_video_url: "Marketing Video",
	tam: "TAM",
	sam: "SAM",
	som: "SOM",
	r_and_d_investment: "R&D Investment",
	cac_ltv_ratio: "CAC : LTV Ratio",
	yoy_growth_rate: "YoY Growth Rate",
	esops_incentives: "ESOPs & Incentives",
	ai_ml_adoption_level: "AI/ML Adoption Level"
};
var BANNED = /ctc|stipend|selection_ratio/i;
function buildIntelligenceSections(profile) {
	return SCHEMA.map((s, i) => ({
		id: `section-${i}`,
		title: s.title,
		icon: s.icon,
		fields: s.keys.filter((k) => !BANNED.test(k)).map((key) => ({
			key,
			label: LABELS[key] ?? titleCaseFromCode(key),
			value: profile ? profile[key] : void 0
		}))
	}));
}
var NA = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: "inline-flex rounded-full border bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground",
	children: "Not Available"
});
function renderValue(field) {
	const v = field.value ?? "";
	if (isNullish(v)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NA, {});
	if (/^https?:\/\//.test(v)) {
		const video = /youtube|vimeo|video/i.test(field.key + v);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: v,
			target: "_blank",
			rel: "noreferrer",
			className: "inline-flex items-center gap-1 break-all text-link hover:underline",
			children: [video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 shrink-0" }), v.replace(/^https?:\/\/(www\.)?/, "")]
		});
	}
	if (/^\d(\.\d)?\/5$/.test(v)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 font-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-regular text-regular" }),
			parseFloat(v),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "/ 5"
			})
		]
	});
	if (v.length > 140 && !v.includes(";")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "leading-relaxed text-foreground",
		children: v
	});
	const items = v.includes(";") ? splitItems(v) : v.length < 140 && v.split(",").length > 2 ? v.split(",").map((s) => s.trim()) : [];
	if (items.length > 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-md border bg-secondary px-2 py-0.5 text-xs text-foreground",
			children: it
		}, it))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-foreground",
		children: v
	});
}
var FieldRow = (0, import_react.memo)(function FieldRow({ field }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1 py-3 sm:flex-row sm:gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-medium text-muted-foreground sm:w-1/3",
			children: field.label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm sm:w-2/3",
			children: renderValue(field)
		})]
	});
});
var SectionCard = (0, import_react.memo)(function SectionCard({ section }) {
	const Icon = section.icon;
	const filled = section.fields.filter((f) => !isNullish(f.value)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: section.id,
		"data-section": true,
		className: "scroll-mt-28 rounded-xl border bg-card p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-lg bg-link-soft text-link",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "flex-1 text-base font-semibold sm:text-lg",
					children: section.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground",
					children: [
						filled,
						"/",
						section.fields.length
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y",
			children: section.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, { field: f }, f.key))
		})]
	});
});
function CompanyIntelligence() {
	const { selected } = useCompany();
	if (!selected) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyIntelligenceContent, { companyId: selected.companyId });
}
function CompanyIntelligenceContent({ companyId }) {
	const { selected } = useCompany();
	const { data } = useSuspenseQuery(companyDetailsQueryOptions(companyId));
	const profile = data?.profile ?? null;
	const sections = (0, import_react.useMemo)(() => buildIntelligenceSections(profile), [profile]);
	const [active, setActive] = (0, import_react.useState)(0);
	const isScrollingRef = (0, import_react.useRef)(false);
	const tabRefs = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		const els = Array.from(document.querySelectorAll("[data-section]"));
		const obs = new IntersectionObserver((entries) => {
			if (isScrollingRef.current) return;
			const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
			if (vis[0]) setActive(els.indexOf(vis[0].target));
		}, { rootMargin: "-120px 0px -60% 0px" });
		els.forEach((e) => obs.observe(e));
		return () => obs.disconnect();
	}, [sections]);
	(0, import_react.useEffect)(() => {
		tabRefs.current[active]?.scrollIntoView({
			inline: "center",
			block: "nearest",
			behavior: "smooth"
		});
	}, [active]);
	const scrollToSection = (0, import_react.useCallback)((idx) => {
		isScrollingRef.current = true;
		setActive(idx);
		document.getElementById(`section-${idx}`)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
		window.setTimeout(() => {
			isScrollingRef.current = false;
		}, 800);
	}, []);
	if (!profile || !selected) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyDataMissing, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky top-12 z-20 border-b bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, {
					name: profile.name,
					logoUrl: selected.logoUrl,
					websiteUrl: profile.website_url,
					className: "h-10 w-10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-lg font-semibold sm:text-xl",
						children: profile.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex rounded-full bg-link-soft px-2 py-0.5 text-xs font-medium text-link",
						children: profile.category
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [!isNullish(profile.website_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: profile.website_url,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Website"
							})]
						})
					}), !isNullish(profile.linkedin_url) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: profile.linkedin_url,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "LinkedIn"
							})]
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "scrollbar-none flex gap-1 overflow-x-auto px-3 pb-2",
			children: sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				ref: (el) => {
					tabRefs.current[i] = el;
				},
				onClick: () => scrollToSection(i),
				className: `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${i === active ? "bg-link-soft text-link" : "text-muted-foreground hover:bg-secondary"}`,
				children: s.title
			}, s.id))
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-4xl space-y-4 p-4",
		children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, { section: s }, s.id))
	})] });
}
//#endregion
export { CompanyIntelligence as component };
