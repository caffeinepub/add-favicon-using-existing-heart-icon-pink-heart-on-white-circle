# Specification

## Summary
**Goal:** Fix the missing favicon by regenerating a complete “pink heart on solid white circle” favicon set and ensuring `frontend/index.html` links match the generated filenames and paths.

**Planned changes:**
- Regenerate the full favicon PNG set (16x16, 32x32, 180x180, 192x192, 512x512) in `frontend/public/assets/generated/` using the exact filenames referenced by `frontend/index.html`.
- Update `frontend/index.html` to replace existing favicon `<link>` tags so they correctly reference the regenerated assets under `/assets/generated/` (no stale/duplicate references).
- Update `frontend/src/lib/generate-favicons.ts` so `generateHeartFavicon` renders a solid white circular background with a centered pink heart (not transparent) and keeps sizes/filenames aligned with the HTML.

**User-visible outcome:** After a hard refresh, the browser loads and displays the correct favicon consistently across supported sizes/devices.
