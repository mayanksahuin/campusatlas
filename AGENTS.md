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

## Architecture
- College data lives in Lovable Cloud; pages read it via public server functions + query options in `src/lib/colleges.functions.ts` (types in `colleges.ts`). Writes are server-only until Admin/auth exists — no public write endpoints.
- Shared header/footer is `SiteShell` in `src/components/site.tsx`, wrapped per route.
