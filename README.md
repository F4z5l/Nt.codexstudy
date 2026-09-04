# CODEXSTUDYS

An original, mobile-first EdTech interface rebuilt from the uploaded learning flows.

## Routes

- `index.html` — CODEXSTUDYS homepage and dashboard preview
- `courses.html` — searchable and filterable course catalogue
- `batch.html?id=183` — course detail, tabs, breadcrumb content explorer
- `player.html?...` — responsive lesson player with local resume progress

## API configuration

The frontend keeps the existing API request shapes:

- `POST /nt/course-details`
- `POST /nt/all-content`
- `GET /nt/details`
- `GET /nt/live`

The proxy target defaults to the existing upstream so the current API flow remains usable. For deployment, set `CODEX_API_ORIGIN` to the desired upstream origin. The optional short-link route uses `VPLINK_TOKEN`; no token is committed to the project.

Both deployment variants are included:

- `api/` for Vercel-style functions
- `functions/api/` for Cloudflare Pages Functions

The content explorer includes an offline-friendly preview, skeleton loading, retry states, empty states, and cached folder responses so a transient API outage does not leave a blank screen. Playback is intentionally open in this build; add server-side authentication before production if course access needs to be restricted.