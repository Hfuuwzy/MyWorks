# Task 4 Report: Drawer Search, Locale, And Theme Controls

## Scope

Implemented only Task 4: one drawer-only tools group containing progressive search, equivalent-route locale switching, and the existing theme behavior. No Task 5+ content primitives, pages, routes, dependencies, header controls, or global transition changes were added.

## Files Changed

- `tests/e2e/redesign.spec.ts`
- `app/components/layout/RightNavDrawer.vue`
- `app/components/layout/right-nav-drawer-tools.css`
- `app/components/ui/SearchBar.vue`
- `app/components/ui/ThemeToggle.vue`
- `app/components/ui/LocaleSwitch.vue`
- `i18n/locales/zh.json`
- `i18n/locales/ja.json`
- `.superpowers/sdd/task-4-report.md`

## TDD Evidence

### RED

Before any production edit, appended the exact three tests from `.superpowers/sdd/task-4-brief.md` and ran:

```text
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Result: `4 passed, 3 failed`. All four Task 3 tests passed. The three Task 4 tests failed behaviorally while waiting for absent `drawer-search-toggle` or `theme-toggle` elements. There were no startup, certificate, server, import, or Playwright setup failures.

### GREEN

After implementation, the Japanese search test initially exposed an unlocalized `/blog/linux-commands` href. Because article detail routes are intentionally deferred until Task 7, `useLocalePath()` could not resolve an unregistered future route directly. The final implementation derives the active locale root through `useLocalePath({ path: '/' }, locale.value)` and appends the unchanged Content path.

Focused scenario:

```text
npm run test:e2e -- tests/e2e/redesign.spec.ts --grep "search finds existing posts"
1 passed
```

Focused file:

```text
npm run test:e2e -- tests/e2e/redesign.spec.ts
7 passed
```

## Contract Verification

- Closed drawer: zero `drawer-search-input`, `locale-switch`, and `theme-toggle` instances.
- Open drawer with search expanded: exactly one each of `drawer-tools`, `drawer-search-toggle`, `drawer-search-input`, `locale-switch`, and `theme-toggle`.
- Search preserves `queryCollection('blog').all()`, title/description/category/tags matching, empty-query clearing, result-click clearing/hiding, and `@mousedown.prevent="handleResultClick"`.
- `SearchBar` exposes exact optional readonly props `compact?: boolean` and `inputId?: string`.
- Japanese result href is `/ja/blog/linux-commands`; default-locale paths remain unprefixed.
- `LocaleSwitch` uses `useI18n()`, `useSwitchLocalePath()`, and `useRoute()`, renders `中文` and `日本語`, and uses visible `当前`/`現在` text plus `aria-current` so current locale is not indicated by color alone. Dynamic routes will preserve equivalent paths when Task 7 registers them.
- `ThemeToggle` retains `document.documentElement.classList.toggle('dark', ...)`, `localStorage.theme`, and `prefers-color-scheme` fallback. Its accessible name changes exactly between `Switch to dark mode` and `Switch to light mode`.
- Existing Task 3 props, close emit, IDs, body lock, Escape behavior, focus restoration, and Tab/Shift+Tab trap remain green. The focusable set now includes enabled inputs.
- Search panel open focuses `drawer-search-input`; close returns focus to `drawer-search-toggle`; reopen remounts and refocuses the input.

## Runtime Inspection

Production build inspected at 1280x800, 768x800, and 375x667.

- Active element after expansion: `drawer-search-input`.
- Singleton counts while expanded: all five required tool IDs equal `1`.
- Closing panel: input count `0`, focus on `drawer-search-toggle`.
- Reopening panel: input count `1`, focus on `drawer-search-input`.
- `/ja` locale links: `中文` -> `/`; `日本語 現在` -> `/ja` with `aria-current="page"`.
- Theme accessible name before activation: `Switch to dark mode`.
- Browser console showed only the known Task 7-deferred article-route prefetch 404s for `/blog/ai-thinking`, `/blog/mysql-basics`, and `/blog/linux-commands`.

## Verification Gates

```text
npm run test:e2e
7 passed

npm run test:unit
3 files passed; 18 tests passed

npm run build
exit 0; Nuxt production build complete
```

Build emitted existing Nuxt module-preload sourcemap, Nitro external-resolution, and dependency deprecation warnings; no Task 4 build error occurred.

LSP diagnostics were requested for all changed Vue/TypeScript files. The environment reported that Vue and TypeScript LSP servers are not installed because installation was previously declined. Full browser, unit, and production build gates were used as executable validation instead.

## Static Audits

- Strict escape scan: zero `any`, `as unknown`, TypeScript suppression, enum, or empty-catch matches in changed Vue/test files.
- Motion/color scan: zero raw hex/rgb colors and zero `transition-all`, color, background, or border transitions in changed UI files.
- Added motion is limited to search-panel `opacity` and `transform`, with `prefers-reduced-motion` reducing duration to 1ms.
- Required control-ID scan: five total declarations, exactly one declaration per required ID; `RightNavDrawer.vue` owns the two distinct group/toggle IDs.
- Locale JSON: both files parse successfully and retain all existing keys.
- No dependency, Git, content-data, asset, or global body-transition changes.

Pure LOC:

```text
RightNavDrawer.vue: 182
right-nav-drawer.css: 159
right-nav-drawer-tools.css: 65
SearchBar.vue: 169
ThemeToggle.vue: 61
LocaleSwitch.vue: 77
redesign.spec.ts: 94
zh.json: 35
ja.json: 35
```

Every changed source file is below the 250 pure-LOC ceiling.

## Architectural Self-Review

1. Single responsibility: drawer orchestration, drawer-tool styling, search, theme, and locale switching remain separated by file.
2. Boundary purity: no untyped external data or unsafe assertions were introduced; Content collection types remain the existing boundary contract.
3. Variant handling: no tagged union or non-exhaustive variant discrimination was added.
4. Escape hatches: none found by audit.
5. Defensive layers: none added beyond existing null-safe DOM refs required by Vue lifecycle timing.
6. One-off helpers: no unnecessary helper abstraction was introduced.
7. Tests: all new user-visible outcomes were proven RED before production changes and are covered by the three exact browser tests.
8. Parameter bloat: no function exceeds three parameters.
9. Redundant verification: none in production code.
10. Negative naming: state uses positive `searchOpen` and `isDark` names.
11. Logging: no logging behavior was added or changed.

## Independent Visual Review

Fresh production captures were reviewed at `D:\Code\Blog\task-4-desktop.png`, `task-4-tablet.png`, and `task-4-mobile.png`.

Initial independent review found a real horizontal overflow defect: vertical-writing nav links used `min-block-size: 164px`, which makes each link 164px wide. It also requested a clearer non-color locale indicator. The fixes changed the logical axes to `min-inline-size: 164px`/`min-block-size: 44px` (136px vertical length on mobile) and added a check SVG beside the visible `当前`/`現在` text.

Post-fix runtime geometry at 375px:

```text
drawer clientWidth: 359
drawer scrollWidth: 359
document clientWidth: 375
document scrollWidth: 375
current locale text: 日本語 現在
```

The design-system/function reviewer returned `PASS` with no blockers, confirming real DOM, one tool group, focus/body-lock behavior, token styling, corrected responsive geometry, and transform/opacity motion. The visual/CJK reviewer confirmed paper/ink/vermilion fidelity, clean CJK rendering, readable search/touch sizing, and the explicit locale marker; it retained a `REVISE` note because short viewports show only part of the drawer's vertically scrollable content after focus scrolls to the tools. This is recorded as non-blocking polish: `RightNavDrawer` intentionally uses `overflow-y: auto`, objective horizontal geometry is clean, controls are reachable/focused, and forcing all navigation plus tools into 667px would alter the established Task 3 drawer contract.

After the review fixes, the final authoritative gates were rerun:

```text
npm run test:e2e
7 passed

npm run test:unit
3 files passed; 18 tests passed

npm run build
exit 0; Nuxt production build complete
```

## Concerns

- Non-blocking pre-existing build warnings are listed above.
- Article detail routes and their prefetch 404s remain intentionally deferred to Task 7.
- On short viewports, focus scrolling can place the drawer heading above the visible scrollport while the below-fold tools are active; all controls remain reachable within the intentional vertical scroll container.
