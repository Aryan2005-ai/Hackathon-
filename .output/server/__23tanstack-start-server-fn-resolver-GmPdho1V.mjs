//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-GmPdho1V.js
var manifest = {
	"0ae091475f15fcc2f57e892c592789abab40b2537ed5c51acb97a540bacf1938": {
		functionName: "fetchCompanyDetails_createServerFn_handler",
		importer: () => import("./_ssr/companies.functions-7kn-rWym.mjs")
	},
	"dfe919ae2efd2dde128ef6a04d275d272c4acbaebb8ca23fc5d733b5c6fd26b4": {
		functionName: "fetchCompanies_createServerFn_handler",
		importer: () => import("./_ssr/companies.functions-7kn-rWym.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
