import { queryOptions } from "@tanstack/react-query";
import { fetchCompanies, fetchCompanyDetails } from "./companies.functions";

export const companiesQueryOptions = queryOptions({
  queryKey: ["companies"],
  queryFn: () => fetchCompanies(),
});
export const companyDetailsQueryOptions = (id: number) =>
  queryOptions({ queryKey: ["company", id], queryFn: () => fetchCompanyDetails({ data: id }) });
