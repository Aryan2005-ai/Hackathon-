<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Public company pages read Supabase through publishable-key server functions and TanStack Query; seed data is test-only, so database changes appear without code changes.
- Company selection persists only its identifier and display fields; validate availability through database queries rather than seed membership to support refreshes for every company.
- Restrict visitor access to read-only placement research and skill tables; never use service-role access for public page reads.
