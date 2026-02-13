# Specification

## Summary
**Goal:** Fix missing/incorrect favicon assets and references so the browser tab icon reliably displays.

**Planned changes:**
- Add the missing favicon PNG files under `frontend/public/assets/generated/` using the exact filenames expected by `frontend/index.html`.
- Ensure each favicon image is a crisp, centered, very simple pink heart on a transparent background (no white circular background) at the required sizes.
- Verify the favicon `<link>` tags in `frontend/index.html` match the actual asset filenames/paths, updating `frontend/index.html` only if needed for alignment.

**User-visible outcome:** The site favicon appears in the browser tab (and related app icons resolve correctly) after a normal refresh (or hard refresh if cached).
