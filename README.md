<<<<<<< HEAD
# JSS UNIVERSITY Companies Research & Placement Analytics Portal

a.k.a. **JSS UNIVERSITY Placement Intelligence Hub**. College used: `COLLEGE_NAME = "JSS UNIVERSITY"`, `COLLEGE_SHORT = "JSS"` (see `src/lib/companies.ts`).

## Phase 1 — UI only

- All data comes from the hardcoded seed `src/data/seedCompanies.ts` (Accenture) plus `src/data/skillTopics.ts`.
- No database, no backend, no auth client.
- The portal is fully public: no login, every page is reachable directly.
- No college logo asset is used anywhere; recruiter logos may load via Logo.dev when `VITE_LOGO_DEV_PUBLISHABLE_KEY` is set, otherwise the seed `logo_url`, otherwise an initial letter.
- Compensation figures (CTC, stipend) and selection ratios are never displayed.

## Routes

- `/` company grid · `/company` → redirects to `/company/intelligence` · `/company/intelligence` (22 sections) · `/company/skills` (Bloom-mapped skills + 10-level roadmaps).
- Selected company is saved under localStorage key `selected-company` and restored on reload; with none saved, company pages send you to `/`.

Note: this platform uses TanStack Router (file routes) instead of React Router 6; the route tree is equivalent.

## Phase 2

Swap `src/lib/companies.ts` to read database rows. The normalizers in `src/lib/companyData.ts` already accept the raw `short_json`, `full_json` and `skill_levels` shapes, so rows pipe in untouched.

## Tests

`bunx vitest run`
=======
# Hackathon-
>>>>>>> 3713a652132397e00827098145ef199c0bd0522d
