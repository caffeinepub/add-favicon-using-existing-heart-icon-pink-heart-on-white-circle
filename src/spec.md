# Specification

## Summary
**Goal:** Regenerate the app’s favicon set from the uploaded `Heart.png` and ensure `frontend/index.html` references resolve to the generated assets.

**Planned changes:**
- Generate/overwrite the favicon PNG assets from `Heart.png` at the exact filenames and sizes used by `frontend/index.html`, placing them under `frontend/public/assets/generated/`.
- Update `frontend/index.html` favicon `<link>` tags only if needed so paths, filenames, and sizes exactly match the generated assets under `/assets/generated/`.
- Replace `frontend/public/favicon.ico` with an `.ico` generated from `Heart.png` so requests to `/favicon.ico` show the heart icon.

**User-visible outcome:** Browsers display the heart-based favicon across tabs, bookmarks, and mobile home screen icons, with all favicon links loading correctly at runtime.
