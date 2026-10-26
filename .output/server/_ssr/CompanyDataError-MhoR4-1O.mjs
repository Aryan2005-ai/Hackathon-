import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as useRouter, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CompanyDataError-MhoR4-1O.js
var import_jsx_runtime = require_jsx_runtime();
function CompanyDataError() {
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "alert",
		className: "space-y-3 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Company data could not be loaded"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Please retry in a moment."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => router.invalidate(),
					children: "Retry"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "All Companies"
					})
				})]
			})
		]
	});
}
function CompanyDataMissing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This company is no longer available." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "All Companies"
			})
		})]
	});
}
//#endregion
export { CompanyDataMissing as n, CompanyDataError as t };
