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
- College seed data lives in `src/lib/colleges.ts` as a typed static list until Lovable Cloud is enabled — single source for all public pages.
- Shared header/footer is `SiteShell` in `src/components/site.tsx`, wrapped per route.
