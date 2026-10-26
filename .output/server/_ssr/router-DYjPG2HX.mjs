import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { K as redirect, S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as TooltipProvider } from "./tooltip-0uxD0LRD.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as companiesQueryOptions, t as CompanyProvider } from "./companyQueries-BKpORKP4.mjs";
import { t as COLLEGE_NAME } from "./companies-B3INa5YB.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DYjPG2HX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-KvruQQ_7.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "JSS UNIVERSITY Placement Intelligence Hub" },
			{
				name: "description",
				content: "JSS UNIVERSITY Companies Research & Placement Analytics Portal."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })] })
	});
}
var $$splitComponentImporter$5 = () => import("./routes-CGmsH34U.mjs");
var $$splitNotFoundComponentImporter$1 = () => import("./routes-Bd_g_b77.mjs");
var $$splitErrorComponentImporter$3 = () => import("./routes-BVCZ_hJ-.mjs");
var Route$6 = createFileRoute("/")({
	loader: ({ context }) => context.queryClient.ensureQueryData(companiesQueryOptions),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
	head: () => ({ meta: [
		{ title: `${COLLEGE_NAME} Companies Research & Placement Analytics Portal` },
		{
			name: "description",
			content: "Research recruiting companies and the skills they expect — JSS UNIVERSITY Placement Intelligence Hub."
		},
		{
			property: "og:title",
			content: `${COLLEGE_NAME} Placement Intelligence Hub`
		},
		{
			property: "og:description",
			content: "Your strategic edge for campus placements."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./JDAnalytics-ByJosjaU.mjs");
var Route$5 = createFileRoute("/JDAnalytics")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./ResumeParser-B5Wlb_Am.mjs");
var Route$4 = createFileRoute("/ResumeParser")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./company-CLIufh_j.mjs");
var $$splitNotFoundComponentImporter = () => import("./company-BwcY6jon.mjs");
var $$splitErrorComponentImporter$2 = () => import("./company-C8TaB-Yr.mjs");
var Route$3 = createFileRoute("/company")({
	loader: ({ context }) => context.queryClient.ensureQueryData(companiesQueryOptions),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$2 = createFileRoute("/company/")({ beforeLoad: () => {
	throw redirect({
		to: "/company/intelligence",
		replace: true
	});
} });
var $$splitComponentImporter$1 = () => import("./company.intelligence-BeH_UuOP.mjs");
var $$splitErrorComponentImporter$1 = () => import("./company.intelligence-tndVYxWp.mjs");
var Route$1 = createFileRoute("/company/intelligence")({
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
	head: () => ({ meta: [
		{ title: "Company Intelligence · JSS UNIVERSITY Placement Hub" },
		{
			name: "description",
			content: "22-section research profile of a recruiting company for JSS UNIVERSITY students."
		},
		{
			property: "og:title",
			content: "Company Intelligence · JSS UNIVERSITY Placement Hub"
		},
		{
			property: "og:description",
			content: "Deep research profile of recruiting companies."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./company.skills-j8LvhtlT.mjs");
var $$splitErrorComponentImporter = () => import("./company.skills-C9RF5jAd.mjs");
var Route = createFileRoute("/company/skills")({
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	head: () => ({ meta: [
		{ title: "Skill Intelligence · JSS UNIVERSITY Placement Hub" },
		{
			name: "description",
			content: "Skills a recruiter expects, mapped to Bloom levels with a 10-level learning roadmap."
		},
		{
			property: "og:title",
			content: "Skill Intelligence · JSS UNIVERSITY Placement Hub"
		},
		{
			property: "og:description",
			content: "Required skills and learning roadmaps per company."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var JDAnalyticsRoute = Route$5.update({
	id: "/JDAnalytics",
	path: "/JDAnalytics",
	getParentRoute: () => Route$7
});
var ResumeParserRoute = Route$4.update({
	id: "/ResumeParser",
	path: "/ResumeParser",
	getParentRoute: () => Route$7
});
var CompanyRoute = Route$3.update({
	id: "/company",
	path: "/company",
	getParentRoute: () => Route$7
});
var CompanyIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => CompanyRoute
});
var CompanyRouteChildren = {
	CompanyIntelligenceRoute: Route$1.update({
		id: "/intelligence",
		path: "/intelligence",
		getParentRoute: () => CompanyRoute
	}),
	CompanySkillsRoute: Route.update({
		id: "/skills",
		path: "/skills",
		getParentRoute: () => CompanyRoute
	}),
	CompanyIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	JDAnalyticsRoute,
	ResumeParserRoute,
	CompanyRoute: CompanyRoute._addFileChildren(CompanyRouteChildren)
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 3e5,
		gcTime: 6e5,
		retry: 1,
		refetchOnWindowFocus: false
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
