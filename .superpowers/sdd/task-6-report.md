# Task 6 Homepage Validation Report

Date: 2026-07-14

## Verdict

**PASS for the Task 6 development-preview slice.** H-01 through H-05 and F-01/F-02 pass in Chromium, the required responsive evidence is fresh, and the requested homepage/non-blog E2E, unit, and build commands pass.

This is not a production-readiness claim. `hero-main.png` remains the explicitly accepted local temporary image documented in `DESIGN.md` and must be replaced before production release.

## Concrete defects fixed

1. Idle homepage article links prefetched not-yet-implemented detail payloads and emitted 404 console errors. Homepage feed rows and the latest-update link now keep navigation but disable idle prefetch; non-home `ArticleRow` usage retains prefetch by default.
2. At 390x844, the eight vertical categories wrapped into a tall block over the foreground face. The mobile group is now one horizontally browsable, hidden-chrome row.
3. Mobile copy and mist entered the protected face area. A semantic `--mobile-hero-safe-area: 75svh` now drives both the first mist transition and copy placement. Final brand top is 633px at 390x844.

Each source change was preceded by a focused failing Playwright regression. The failures reproduced the console 404, `flex-wrap: wrap`, and the insufficient/missing face-safe boundary before the corresponding fix.

## Browser observations

The final measurements were collected in real Playwright Chromium after the last source edit and after the hero image decoded.

| Viewport | Console errors | `object-fit` / `object-position` | Rail | Document widths | Feed / mobile geometry |
|---|---:|---|---:|---|---|
| 1440x900 | 0 | `cover` / `50% 34%` | 80px | client 1425px; document/body scroll 1425px; no horizontal overflow | desktop grid; columns 644.95px / 467.05px (58/42) |
| 768x1024 | 0 | `cover` / `58% 38%` | 64px | client 753px; document/body scroll 753px; no horizontal overflow | desktop grid; columns 334.66px / 242.34px (58/42) |
| 390x844 | 0 | `cover` / `72% 42%` | 56px | client 375px; document/body scroll 375px; no horizontal overflow | desktop feed hidden; ordered mobile feed shown; category viewport/scroll 279px / 436px; `nowrap`; brand top 633px |

Image inspection passed all four final captures. At 390x844, both foreground-girl eyes and the upper-right male face are visible and unobstructed by copy. CJK text remains readable, the right rail is aligned, and the INFORMATION capture has a readable non-duplicated two-column timeline. The category strip intentionally scrolls within its own container; the page itself does not overflow horizontally.

## Evidence

- `test-results/task-6/homepage-1440x900.png`
- `test-results/task-6/homepage-768x1024.png`
- `test-results/task-6/homepage-390x844.png`
- `test-results/task-6/information-section.png`

## Command results

### Homepage E2E

```powershell
npm run test:e2e -- --grep homepage
```

Result: **PASS — 6 passed (11.6s)**.

### Established E2E suite excluding the planned blog-index slice

```powershell
npm run test:e2e -- --grep-invert "blog index uses chronological rows instead of the old card grid wall"
```

Result: **PASS — 12 passed (17.4s)**. Only the named planned blog-index test was excluded.

### Unit tests

```powershell
npm run test:unit
```

Result: **PASS — 3 test files, 18 tests; duration 144ms**.

### Build

```powershell
npm run build
```

Result: **PASS — exit 0; client built in 2.51s, server in 1.24s; Nuxt Nitro build completed; total output 33.1 MB (12.4 MB gzip)**.

Build emitted non-fatal existing toolchain warnings: a module-preload sourcemap warning, Nitro cache-driver external-resolution warning, and Node DEP0155 package-export deprecation warnings. They did not fail the build and were not broadened into this homepage task.

## Static diagnostics and scope notes

Workspace Vue, TypeScript, and Biome language servers are not installed and were previously declined, so `lsp_diagnostics` could not execute. No dependency was installed. Executable verification above passed, and changed files remain below the 250 nonblank/noncomment line threshold (58, 33, 57, 196, and 146 lines respectively).

No blog/category page, dependency, external asset URL, footer contract, or temporary local hero asset was changed.
