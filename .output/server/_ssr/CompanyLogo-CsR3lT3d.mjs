import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CompanyLogo-CsR3lT3d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function domainOf(url) {
	if (!url) return "";
	try {
		const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
		return new URL(normalized).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
}
function CompanyLogo({ name, logoUrl, websiteUrl, className }) {
	const key = "pk_M1PjNcpmQLWmgKojF1LxEA";
	const domain = domainOf(websiteUrl);
	const sources = [...domain ? [`https://img.logo.dev/${domain}?token=${key}&size=128`] : [], ...logoUrl ? [logoUrl] : []];
	const [idx, setIdx] = (0, import_react.useState)(0);
	const src = sources[idx];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card", className),
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: `${name} logo`,
			className: "h-full w-full object-contain p-1.5",
			onError: () => setIdx((i) => i + 1)
		}, src) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-heading text-lg font-semibold text-link",
			children: name?.charAt(0)?.toUpperCase() || "?"
		})
	});
}
//#endregion
export { CompanyLogo as t };
