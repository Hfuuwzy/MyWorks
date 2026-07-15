# Final Integration Report

Date: 2026-07-15

## Verdict

**Implementation and executable QA PASS for the development-preview portal.** Functional Oracle review **PASS (98%)**, mobile visual Oracle review **PASS (high confidence)**, and final desktop visual Oracle review **PASS (high confidence, no blockers)**.

This is not a production-asset-readiness claim.

## Post-Oracle fixes

- Added `app/plugins/theme.client.ts` as the sole app-wide theme initializer. It reads `localStorage.theme`, falls back to `prefers-color-scheme: dark` only when no value is saved, and toggles the root `dark` class before any drawer interaction. `ThemeToggle.vue` mirrors that initialized class when its single drawer control mounts.
- Changed search result cleanup from `mousedown.prevent` to normal link `click`, preserving real mouse and Enter navigation to localized article routes.
- Applied `useLocalePath()` to the homepage latest update, project/about summaries, and rail brand; drawer active matching now compares localized paths.
- Made document `html[lang]` reactive to the current locale in `app.vue`.
- Replaced the hidden-behind-rail rounded/shadow ScrollToTop control with an accessible square paper stamp outside the 80/64/56px rail. Its motion uses only opacity/transform and respects reduced motion.
- Rendered article frontmatter tags as visible vermilion stamps in the detail header.
- Added seven focused regressions in `tests/e2e/oracle-regressions.spec.ts` for persisted/system theme, mouse/keyboard search, Japanese links/active/lang, ScrollToTop, and tags.
- Changed only the desktop homepage artwork focal point from `50% 34%` to `50% 18%`, revealing the upper-right male eyes, forehead, and hat while preserving the girl's face and readable left copy. Tablet `58% 38%` and mobile `72% 42%` remain unchanged.
- Protected the semantic `开发者` phrase with non-breaking inline markup instead of shrinking About typography.
- Added shared `--paper-surface-depth` and `--ink-impression` tokens to the global surface layer. At desktop widths only, Blog and About consume the existing local paper texture as one continuous low-contrast page field with subtle ink depth; no cards, panels, or shadows were introduced.
- Folded focal, semantic-wrap, and material assertions into existing `final-qa.spec.ts` scenarios so the complete E2E suite remains 44 tests.

## Theme RED to GREEN evidence

After removing the superseded inline head initializer and before adding the explicit plugin:

```text
npm run test:e2e -- tests/e2e/oracle-regressions.spec.ts --workers=1 --grep "persisted dark|system dark"
2 failed — both received <html class=""> instead of /dark/
```

With `app/plugins/theme.client.ts` present:

```text
npm run test:e2e -- tests/e2e/oracle-regressions.spec.ts --workers=1 --grep "persisted dark|system dark"
2 passed (8.8s)
```

## Desktop visual RED to GREEN evidence

Before changing the desktop hero focal point:

```text
npx playwright test tests/e2e/oracle-regressions.spec.ts -g "hero artwork preserves its focal contract" --workers=1
1 failed — expected object-position "50% 18%", received "50% 34%"
```

After applying the desktop-only focal point:

```text
1 passed (5.5s)
```

Before adding semantic non-breaking markup to About:

```text
npx playwright test tests/e2e/oracle-regressions.spec.ts -g "About keeps the developer role" --workers=1
1 failed — about-developer-role element not found
```

After wrapping `开发者` and applying `white-space: nowrap`:

```text
1 passed (10.3s)
```

The proven assertions were then consolidated into existing final-QA scenarios to preserve the 44-test suite count.

## Post-Oracle changed files

- `DESIGN.md`
- `nuxt.config.ts`
- `app/app.vue`
- `app/plugins/theme.client.ts`
- `app/assets/css/main.css`
- `app/components/ui/ThemeToggle.vue`
- `app/components/ui/SearchBar.vue`
- `app/components/ui/ScrollToTop.vue`
- `app/components/sections/HomeVisual.vue`
- `app/components/sections/home-visual.css`
- `app/pages/index.vue`
- `app/pages/about.vue`
- `app/components/layout/RightNavRail.vue`
- `app/components/layout/RightNavDrawer.vue`
- `app/pages/blog/[...slug].vue`
- `app/pages/blog/blog-detail.css`
- `tests/e2e/oracle-regressions.spec.ts`
- `tests/e2e/final-qa.spec.ts`
- `test-results/final/home-desktop.png`
- `test-results/final/home-mobile.png`
- `test-results/final/blog-index-desktop.png`
- `test-results/final/ja-blog-detail-mobile.png`
- `test-results/final/about-desktop.png`
- `.superpowers/sdd/final-report.md`

## Final verification

- Focused Oracle regressions: **PASS — 7 tests (25.5s)**.
- Focused desktop geometry/material scenarios: **PASS — 3 tests (15.6s)**.
- `npm run test:e2e -- --workers=1`: **PASS — 44 tests (2.1m)**; the five final PNGs were regenerated during this run after the last rendered-source edit.
- `npm run test:unit`: **PASS — 3 files, 18 tests (141ms)**.
- `npm run build`: **PASS — exit 0; client 2.52s, server 1.37s; 33.1MB output, 12.4MB gzip**.
- Source grep: theme initialization is explicitly present in `app/plugins/theme.client.ts`; no inline duplicate remains in `nuxt.config.ts`.
- Strict test-source scan found no `as any`, `as unknown`, TypeScript suppression, enum, or non-null-assertion escape hatches in the changed E2E file.
- TypeScript/Vue/Biome LSP diagnostics remain unavailable because those servers were previously declined; no dependency was added.
- Functional Oracle review: **PASS — 98%**.
- Mobile visual Oracle review: **PASS — high confidence**.
- Final desktop visual Oracle review: **PASS — high confidence, no blockers**; the home face composition, Blog paper depth, and About `开发者` wrap were approved.

## Fresh evidence

- `test-results/final/home-desktop.png`
- `test-results/final/home-mobile.png`
- `test-results/final/blog-index-desktop.png`
- `test-results/final/ja-blog-detail-mobile.png`
- `test-results/final/about-desktop.png`

Direct inspection of these fresh captures confirms:

- Desktop home retains the full upper-right male face, the girl's face, readable left copy, and stable right rail.
- Desktop Blog and About show continuous subtle paper grain and warm ink depth without cards, panels, shadows, or contrast loss.
- About keeps `开发者` on one semantic line.
- Mobile home and Japanese article detail retain face safety, the 56px rail, natural CJK, fitting code/images/navigation/tags, and no horizontal overflow.

## Accepted debt

- `public/images/reference/deaimon/` remains documented temporary local development-preview material and must be replaced before production release; no external hotlinks were added.
- Dark mode remains lower-fidelity than the light visual reference, but its initialization, layout, and interaction behavior pass.
- Existing non-fatal Nuxt module-preload sourcemap, Nitro cache-driver resolution, and Node DEP0155 warnings remain out of scope.
