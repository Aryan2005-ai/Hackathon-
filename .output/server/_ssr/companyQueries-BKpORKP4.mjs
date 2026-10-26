import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-GmPdho1V.mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/companyQueries-BKpORKP4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "selected-company";
var CompanyContext = (0, import_react.createContext)(null);
function readStoredCompany() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return Number.isInteger(parsed.companyId) && parsed.companyId > 0 && typeof parsed.companyName === "string" && typeof parsed.logoUrl === "string" ? parsed : null;
	} catch {
		return null;
	}
}
function CompanyProvider({ children }) {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSelected(readStoredCompany());
		setReady(true);
	}, []);
	const selectCompany = (0, import_react.useCallback)((c) => {
		localStorage.setItem(KEY, JSON.stringify(c));
		setSelected(c);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyContext.Provider, {
		value: {
			selected,
			ready,
			selectCompany
		},
		children
	});
}
function useCompany() {
	const ctx = (0, import_react.useContext)(CompanyContext);
	if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
	return ctx;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchCompanies = createServerFn({ method: "GET" }).handler(createSsrRpc("dfe919ae2efd2dde128ef6a04d275d272c4acbaebb8ca23fc5d733b5c6fd26b4"));
var fetchCompanyDetails = createServerFn({ method: "GET" }).inputValidator((id) => {
	if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid company selection.");
	return id;
}).handler(createSsrRpc("0ae091475f15fcc2f57e892c592789abab40b2537ed5c51acb97a540bacf1938"));
var companiesQueryOptions = queryOptions({
	queryKey: ["companies"],
	queryFn: () => fetchCompanies()
});
var companyDetailsQueryOptions = (id) => queryOptions({
	queryKey: ["company", id],
	queryFn: () => fetchCompanyDetails({ data: id })
});
//#endregion
export { useCompany as i, companiesQueryOptions as n, companyDetailsQueryOptions as r, CompanyProvider as t };
