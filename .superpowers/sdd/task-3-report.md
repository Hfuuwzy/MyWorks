# Task 3 Report: Right Fixed Rail And Accessible Drawer

## Status

Implemented the approved fixed right navigation rail and accessible drawer without adding Task 4 tools or changing navigation data, tokens, assets, content, or dependencies.

## Changed Files

- `tests/e2e/redesign.spec.ts` — appended the brief's exact drawer interaction browser test.
- `app/layouts/default.vue` — replaced the left sidebar/header shell with layout-owned right rail/drawer state and route-close behavior while retaining the footer and scroll-to-top control.
- `app/components/icons/PaperIcons.vue` — added the local inline SVG menu/close primitive.
- `app/components/layout/RightNavRail.vue` — added the responsive fixed rail, vertical text brand, and accessible menu trigger.
- `app/components/layout/RightNavDrawer.vue` — added the localized ordered navigation dialog, overlay, active state, focus management, close paths, and body lock.
- `.superpowers/sdd/task-3-report.md` — this report.

## RED Evidence

Command:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Result before production changes: `2 failed`. The existing smoke test failed because `right-nav-rail` was absent. The newly appended interaction test reached the running app and failed at its first assertion because `right-nav-menu-button` was absent:

```text
Locator: getByTestId('right-nav-menu-button')
Expected: "false"
Error: element(s) not found
```

There were no server, configuration, or import errors.

## GREEN Evidence

Focused command after implementation:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Result: `2 passed (9.3s)` on the initial GREEN run. The final post-build run also passed: `2 passed (9.4s)`.

An additional temporary Playwright runtime probe was run and removed after passing:

```powershell
npx playwright test tests/e2e/task-3-runtime.spec.ts
```

Result: `1 passed (9.3s)`. It verified one drawer and one overlay, focus on the first navigation link, Shift+Tab wrapping to the final close button, Tab wrapping back to the first link, route navigation closing the drawer, body overflow restoration, trigger focus restoration, and computed rail widths of 80px/64px/56px at desktop/tablet/mobile widths.

## Behavior Verification

- The shell root and main expose `site-shell` and `site-main` test IDs.
- The active layout contains no `LayoutSidebar`, `LayoutHeader`, or `.sidebar` DOM.
- The rail is fixed to the right and uses the existing `--rail-width`, `--rail-width-tablet`, and `--rail-width-mobile` variables.
- The 48px menu button exposes `right-nav-menu-button`, `aria-expanded`, `aria-controls="right-nav-drawer"`, and the dynamic `Open navigation`/`Close navigation` name.
- The rail renders only vertical text branding and the menu control; no search, locale, theme, or drawer tools are rendered.
- The local SVG primitive renders three vertical menu lines or a close mark without emoji or an icon dependency.
- The open drawer is the sole `right-nav-drawer` dialog with `aria-modal="true"`; the sole overlay is `right-nav-overlay`.
- All ten `portalNavItems` render in source order through `useLocalePath()`, with Chinese/Japanese labels and active ink/vermilion treatment.
- Escape, overlay, close button, menu trigger, navigation link, route change, and unmount paths restore body overflow correctly.
- Drawer motion uses only transform and opacity at 650ms; reduced-motion transitions use 1ms.
- A zero-height Task 4 tool insertion point exists without rendering controls.

## Unit And Build Evidence

```powershell
npm run test:unit
```

Result: `3 passed` test files and `18 passed` tests.

```powershell
npm run build
```

Result: exit code 0, client/server/Nitro build complete. The output retained only pre-existing Nuxt/Nitro warnings: module-preload sourcemap quality, unresolved Nitro cache-driver externalization, and dependency export-map deprecations.

## Diagnostics And Static Audits

- `lsp_diagnostics` was attempted for all five changed Vue/TypeScript implementation/test files. Vue and TypeScript LSP servers are not installed and were previously declined, so diagnostics were unavailable.
- The successful Nuxt production build supplied Vue template, TypeScript, SSR, and bundling verification.
- The bundled no-excuse checker ran successfully for the recognized TypeScript test file: `No violations in 1 file(s)`.
- A scoped manual audit across all changed Vue/TypeScript files found no `any`, `as any`, `as unknown`, non-null assertions, suppression directives, or empty catches.
- Scoped visual audits found no raw hex/RGB colors, no forbidden layout-property transitions, and no `h-screen`.

## Pure LOC

- `app/layouts/default.vue`: 58
- `app/components/icons/PaperIcons.vue`: 33
- `app/components/layout/RightNavRail.vue`: 115
- `app/components/layout/RightNavDrawer.vue`: 244
- `tests/e2e/redesign.spec.ts`: 24

All changed code files are below the 250-pure-LOC ceiling.

## Self-Review

- Single responsibility: layout owns shell state; icon owns SVG state; rail owns the fixed trigger surface; drawer owns dialog navigation and accessibility behavior.
- Boundary purity: no external untyped input crosses these components.
- Variants and escapes: no tagged union discrimination, unsafe assertions, suppression, broad catches, or non-null assertions were introduced.
- Helpers and parameters: helpers serve distinct repeated interaction responsibilities; no function has more than three parameters.
- Defensive code: body/focus restoration handles only real browser lifecycle cases and is SSR-safe because document/body access occurs in post-flush watchers and unmount lifecycle effects.
- Logging: no logging was added.
- Design system: colors, widths, texture, typography, and motion follow existing tokens and `DESIGN.md`; no Task 2 color-transition debt was changed.

## Concerns

- LSP diagnostics remain unavailable because the Vue and TypeScript language servers are not installed and installation was previously declined.
- The production build still emits the documented pre-existing Nuxt/Nitro dependency warnings; Task 3 introduced no new build failure or warning category.

## Review Fixes

### Findings Resolved

- `RightNavDrawer` now has exactly the approved props contract: `open` and readonly `items`; its only emit is `close`.
- The drawer no longer imports `portalNavItems` or accepts `currentPath`. It renders `props.items` in order and uses `useRoute()` internally for active-link state.
- `default.vue` imports `portalNavItems` and supplies it through `:items="portalNavItems"`.
- Added exact IDs `right-nav-brand`, `right-nav-menu-icon`, `right-nav-close-icon`, `right-nav-links`, and `right-nav-close`; removed `right-nav-drawer-close`.
- `PaperIcons` accepts an optional readonly test ID used by the rail only, so menu/close icon IDs remain mutually exclusive and the drawer icon is untagged.
- Removed the empty Task 4 tools insertion point.
- Removed rail color/border/background transitions and drawer-link color transition. Remaining Task 3 transitions animate only `transform` and/or `opacity`, with the reduced-motion override retained.
- Body overflow restoration is now guarded by `ownsBodyLock`, so unmount before this component acquires the lock cannot overwrite another owner's body state.
- Extracted the drawer CSS to `app/components/layout/right-nav-drawer.css` to preserve readable formatting while keeping every changed source file below 250 pure LOC.

### Durable Browser RED

Added two permanent tests to `tests/e2e/redesign.spec.ts` before changing production code. They cover exact IDs and icon exclusivity, 80/64/56px responsive widths, first-link focus, both focus-wrap directions, Escape and close-button focus restoration, route-close behavior, and body overflow restoration.

Command:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Result: `2 passed, 2 failed (32.1s)`. The new tests failed behaviorally on missing `right-nav-brand` and missing `right-nav-close`; the app server and both pre-existing tests remained healthy.

### Durable Browser GREEN

Focused command:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Result: `4 passed (12.2s)`.

Full e2e command:

```powershell
npm run test:e2e
```

Result: `4 passed (11.5s)`. All coverage remains in `tests/e2e/redesign.spec.ts`; no temporary test was used or removed.

### Unit And Build Reverification

```powershell
npm run test:unit
```

Result: `3 passed` files, `18 passed` tests, duration `149ms`.

```powershell
npm run build
```

Result: exit code 0; Nuxt client, server, prerender, and Nitro output completed. Only the previously documented module-preload sourcemap, Nitro cache-driver externalization, and dependency export-map deprecation warnings remain.

### Diagnostics And Static Audits

- Attempted `lsp_diagnostics` on `default.vue`, `PaperIcons.vue`, `RightNavRail.vue`, `RightNavDrawer.vue`, and `redesign.spec.ts`. Vue and TypeScript language servers remain unavailable because installation was previously declined.
- Scoped forbidden-transition audit found no transition of color, background, border, width, height, position, margin, or padding.
- Scoped strict escape audit found no `any`, `as any`, `as unknown`, non-null assertions, TypeScript suppressions, or empty catches.
- Scoped raw-color audit found no hex, RGB, or RGBA literals in changed Task 3 source.
- Scoped stale-contract audit found no `currentPath`, drawer-side `portalNavItems`, `right-nav-drawer-close`, or removed tools-slot identifiers.

### Pure LOC After Review Fixes

- `app/layouts/default.vue`: 59
- `app/components/icons/PaperIcons.vue`: 35
- `app/components/layout/RightNavRail.vue`: 114
- `app/components/layout/RightNavDrawer.vue`: 144
- `app/components/layout/right-nav-drawer.css`: 159
- `tests/e2e/redesign.spec.ts`: 67

Every changed source file remains below 250 pure LOC.
