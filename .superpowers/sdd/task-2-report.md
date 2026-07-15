# Task 2 Report: Navigation Data, Article Helpers, Paths, Tokens, And Local Assets

## Status

Task 2 is complete as a development-preview foundation. The localized reference assets remain temporary and are explicitly not production-ready ownership-cleared assets.

## Files changed

- `app/data/navigation.ts` — replaced the Task 1 RED placeholder with the exact ten ordered portal items and eight category entries.
- `app/utils/articles.ts` — added immutable descending date sorting, invalid/missing-date-last behavior, even/odd feed splitting, and locale date formatting.
- `app/utils/paths.ts` — added canonical `/ja` stripping, blog slug extraction, and localized path generation.
- `app/assets/css/main.css` — replaced dashboard styling with the approved light/dark paper tokens, local material URLs, serif base typography, page transition, and reduced-motion override.
- `tailwind.config.ts` — mapped semantic colors to CSS variables, set the approved serif stack, retained class dark mode, and removed legacy dashboard color/effect configuration.
- `nuxt.config.ts` — set the approved theme color and exact Noto Serif SC/JP stylesheet while preserving modules and i18n strategy.
- `public/images/reference/deaimon/hero-main.png` — copied from `reference/images/文章底片.png`.
- `public/images/reference/deaimon/cover-mysql.jpg` — downloaded temporary MySQL cover.
- `public/images/reference/deaimon/cover-ai.jpg` — downloaded temporary AI cover.
- `public/images/reference/deaimon/cover-linux.jpg` — downloaded temporary Linux cover.
- `public/images/reference/deaimon/paper-body.jpg` — downloaded temporary global paper texture.
- `public/images/reference/deaimon/paper-section.jpg` — downloaded temporary section paper texture.
- `public/images/reference/deaimon/paper-nav.jpg` — downloaded temporary navigation paper texture.
- `public/images/reference/deaimon/petal-01.png` — downloaded temporary decorative petal.
- `public/images/reference/deaimon/petal-03.png` — downloaded temporary decorative petal.
- `public/images/reference/deaimon/petal-07.png` — downloaded temporary decorative petal.
- `public/images/reference/deaimon/ASSET-SOURCES.md` — added the exact source, use, replacement status, and production-readiness rules.
- `content/blog/mysql-basics.md` — changed only the frontmatter `cover` value.
- `content/blog/ai-thinking.md` — changed only the frontmatter `cover` value.
- `content/blog/linux-commands.md` — changed only the frontmatter `cover` value.
- `.superpowers/sdd/task-2-report.md` — added this durable implementation and verification report.

## TDD evidence

The Task 1 report was read before implementation. It records behavioral RED failures with resolved imports/configuration:

- Navigation: empty ordered keys/categories, exit code 1.
- Articles: unsorted result and empty split, exit code 1.
- Paths: unstripped `/ja`, unnormalized Japanese homepage, and unextracted slug, exit code 1.

Each seam was implemented and verified independently before proceeding:

### Navigation GREEN

Command: `npm run test:unit -- tests/unit/navigation.test.ts`

- Exit code: 0.
- Result: 1 test file passed, 2 tests passed.

### Articles GREEN

Command: `npm run test:unit -- tests/unit/articles.test.ts`

- Exit code: 0.
- Result: 1 test file passed, 2 tests passed.

### Paths GREEN

Command: `npm run test:unit -- tests/unit/paths.test.ts`

- Exit code: 0.
- Result: 1 test file passed, 4 tests passed.

## Asset acquisition and verification

### Destination and source precheck

PowerShell `Test-Path` checked `public\images` and `reference\images\文章底片.png` before creating the destination.

- Exit code: 0.
- Result: `parent=True source=True`.

### Copy and downloads

PowerShell created `public\images\reference\deaimon`, copied the hero, and ran `Invoke-WebRequest` for exactly the nine brief URLs. The fallback user-agent retry was implemented but was not needed.

- Exit code: 0.
- Result: all nine files reported `downloaded`; no source was substituted.

### Required-file audit

PowerShell `Test-Path` checked the ten image files and `ASSET-SOURCES.md`.

- Exit code: 0.
- Result: all eleven required files exist.

### Cover dimensions

Method: PowerShell loaded `System.Drawing` and inspected each file using `[System.Drawing.Image]::FromFile`.

- `cover-mysql.jpg`: 1500x844.
- `cover-ai.jpg`: 1500x844.
- `cover-linux.jpg`: 1500x844.
- Exit code: 0.

## Content and source audits

### Markdown cover audit

PowerShell required exactly one `cover:` line in each named Markdown file and compared it with the approved local path.

- `mysql-basics.md`: `/images/reference/deaimon/cover-mysql.jpg`.
- `ai-thinking.md`: `/images/reference/deaimon/cover-ai.jpg`.
- `linux-commands.md`: `/images/reference/deaimon/cover-linux.jpg`.
- Exit code: 0.
- The text edit patch changed only these three frontmatter lines; titles, descriptions, dates, categories, tags, and bodies were not edited.

### Hotlink audit

PowerShell recursively scanned application `.css`, `.vue`, and `.ts` files for `https://deaimon.jp`.

- Exit code: 0.
- Result: `0 deaimon source URLs in app CSS/Vue/TypeScript files`.
- Source URLs exist only in the required provenance document.

### Strict TypeScript escape audit

PowerShell scanned all five changed TypeScript files for `as any`, `as unknown`, `@ts-ignore`, and `@ts-expect-error`.

- Exit code: 0.
- Result: zero forbidden assertions or suppression directives.
- Self-review also found no postfix non-null assertions.

## Full unit verification

Command: `npm run test:unit`

- Exit code: 0.
- Result: 3 test files passed, 8 tests passed.

## Diagnostics

`lsp_diagnostics` was requested for:

- `app/data/navigation.ts`
- `app/utils/articles.ts`
- `app/utils/paths.ts`
- `tailwind.config.ts`
- `nuxt.config.ts`

Each returned the existing environment condition:

```text
LSP server 'typescript' (.ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts) is NOT INSTALLED; user previously declined installation — proceed without LSP.
```

The production build supplied fresh TypeScript/config compilation coverage.

## Build verification

### Initial build after token migration

Command: `npm run build`

- Exit code: 1.
- Root cause: Tailwind cannot compile `@apply bg-primary/20` when `primary.DEFAULT` is the required plain `var(--vermilion)` value.
- Fix: retained the exact Tailwind token contract and changed selection styling to direct semantic `--sakura` and `--vermilion` variables.

### Final build

Command: `npm run build`

- Exit code: 0.
- Result: client, server, prerender, and Nitro server completed; output ended with `Build complete!`.
- Preserved pre-existing warnings: module-preload sourcemap warning, unresolved Nitro cache-driver treated as external, and Node `DEP0155` trailing-slash export mapping deprecations for existing dependencies.

## Pure LOC checks

PowerShell counted nonblank, non-`//` lines in every changed TypeScript file:

- `app/data/navigation.ts`: 24 pure LOC.
- `app/utils/articles.ts`: 52 pure LOC.
- `app/utils/paths.ts`: 16 pure LOC.
- `tailwind.config.ts`: 33 pure LOC.
- `nuxt.config.ts`: 59 pure LOC.
- Exit code: 0; all are below 200 and 250 LOC thresholds.

## Self-review

- Single responsibility: each TypeScript file owns one noun phrase—navigation data, article helpers, path helpers, Tailwind theme, or Nuxt configuration.
- Boundary purity: no untyped external data is passed into the helper interiors.
- Variant discrimination: no discriminated union or enum switch was introduced.
- Escape hatches: no `any`, unsafe assertion, suppression directive, or non-null assertion was introduced.
- Defensive layers: date guards correspond only to the required invalid/missing-date contract.
- One-off helpers: the private timestamp helper is shared by both sides of the comparator and prevents duplicated parsing policy.
- Tests: all Task 1 behavioral RED seams are now covered by focused and full GREEN runs.
- Parameter bloat: no changed function has more than two parameters.
- Redundant verification: no destructive action is re-queried in production code.
- Positive naming: exported and local names describe present behavior.
- Logging: no logging was added.
- Design compliance: all new CSS colors, dimensions, textures, typography, and motion values come directly from the Task 2 brief and existing `DESIGN.md`; no Task 3 component or route was added.

## Concerns

- TypeScript LSP diagnostics remain unavailable because the server is not installed and was previously declined.
- The final build succeeds but retains the documented pre-existing Nuxt/Nitro sourcemap, external-resolution, and dependency deprecation warnings.
- Every file in `public/images/reference/deaimon/` is a development-preview placeholder. `ASSET-SOURCES.md` explicitly requires replacement or recreation before production素材 readiness; no production asset readiness is claimed.
- The intentionally RED Task 1 browser smoke test was not run because its right-navigation surface belongs to Task 3 and Task 2 must not implement or validate that surface as complete.

## Review Fixes

### Binding source and fix scope

Read `docs/superpowers/plans/2026-07-14-deaimon-inspired-portal-redesign.md` lines 173-271 and applied all three Critical contract corrections plus all three Important review corrections in one wave. A consumer-graph check found no current consumers requiring compatibility aliases for `formatArticleDate`, `ArticleSummary`, `SplitArticleFeed`, `PortalLocale`, or `localizedPath`.

Changed in this review wave:

- `app/data/navigation.ts`
- `app/utils/articles.ts`
- `app/utils/paths.ts`
- `tests/unit/navigation.test.ts`
- `tests/unit/articles.test.ts`
- `tests/unit/paths.test.ts`
- `nuxt.config.ts`
- `app/assets/css/main.css`
- `.superpowers/sdd/task-2-report.md`

Assets, provenance, Markdown content, dependency files, and Task 3+ surfaces were not modified.

### Critical fixes

- Navigation now exports the exact `PortalRouteKey`, `PortalNavItem`, `PortalCategory`, `portalNavItems`, `portalCategories`, and `getPortalNavItem` contracts. Runtime properties are exactly `englishLabel` and `appearsOnHome`; the former `labelEn` and `isCategory` names are removed. A total `Readonly<Record<PortalRouteKey, PortalNavItem>>` supplies lookup without `find`, assertions, or non-null operators.
- Articles now exports the exact `ArticleListItem`, `SplitFeed<T>`, `getArticleTimestamp`, `sortArticlesByDateDesc`, `splitEvenOddFeed`, and `formatDisplayDate` contracts. Optional metadata, `string | Date | undefined`, immutable sorting, stable invalid/missing-date-last behavior, Date objects, and empty invalid/missing display values are covered.
- Paths now exports only `DEFAULT_LOCALE`, `JA_PREFIX`, `canonicalContentPathFromRoute`, `slugFromBlogPath`, and `localizedPathFromCanonical`. The wrong locale type/helper are removed, and canonical paths are delegated to the supplied locale callback.

### Important fixes

- Regression tests now lock runtime export keys, navigation property keys/order/getter, article input classes and edge ordering, path constants, and callback behavior without weakening existing assertions.
- `formatDisplayDate` covers string, Date, undefined, and invalid inputs for the planned locale union.
- Removed `app.pageTransition` from `nuxt.config.ts` and matching `.page-enter*`/`.page-leave*` selectors from `main.css`. The required reduced-motion block remains.

### TDD cycle 1: runtime export and property contracts

Tests were added first using dynamic module export-key assertions and runtime property-key assertions, avoiding missing-symbol import failures.

Command:

```powershell
npm run test:unit -- tests/unit/navigation.test.ts tests/unit/articles.test.ts tests/unit/paths.test.ts
```

RED result:

- Exit code: 1.
- 3 test files failed; 4 tests failed and 8 existing tests passed.
- Behavioral failures: missing `getPortalNavItem`; wrong `labelEn`/`isCategory`; missing `getArticleTimestamp`/`formatDisplayDate` with extra `formatArticleDate`; missing constants/callback helper with extra `localizedPath`.
- All modules resolved successfully.

After exposing the planned runtime/type surfaces, the same command produced:

- Exit code: 0.
- 3 test files passed; 12 tests passed.

### TDD cycle 2: helper behavior and input classes

Behavior assertions were then added for total route lookup, Date/undefined/invalid timestamps and display values, mixed-date immutable sort-last behavior, locale constants, and locale callback delegation.

Command:

```powershell
npm run test:unit -- tests/unit/navigation.test.ts tests/unit/articles.test.ts tests/unit/paths.test.ts
```

RED result:

- Exit code: 1.
- 2 test files failed and 1 passed; 4 tests failed and 14 passed.
- Behavioral failures: Date timestamp returned negative infinity, Date ordering was wrong, Date display returned empty, and the locale callback was not invoked.

After implementing Date handling and callback delegation, the same command produced:

- Exit code: 0.
- 3 test files passed; 18 tests passed.

### Final focused and full unit verification

Focused command:

```powershell
npm run test:unit -- tests/unit/navigation.test.ts tests/unit/articles.test.ts tests/unit/paths.test.ts
```

- Exit code: 0.
- 3 test files passed; 18 tests passed.

Full command:

```powershell
npm run test:unit
```

- Exit code: 0.
- 3 test files passed; 18 tests passed.

The Task 1 browser smoke test remains intentionally RED until Task 3 and was not run as a completion gate.

### Build verification

Command:

```powershell
npm run build
```

- Exit code: 0.
- Client, server, prerender, and Nitro server completed; output ended with `Build complete!`.
- Existing warnings remain unchanged: module-preload sourcemap warning, Nitro cache-driver external-resolution warning, and dependency `DEP0155` trailing-slash export mapping deprecations.

### Strict API and transition audits

PowerShell scanned all seven changed TypeScript files for `as any`, `as unknown`, `@ts-ignore`, and `@ts-expect-error`, and scanned production modules for the superseded API names.

- Exit code: 0.
- Result: `strict/API audit: 0 forbidden escapes and 0 superseded API names`.
- Manual self-review found no postfix non-null assertion.

PowerShell scanned `nuxt.config.ts` and `main.css` for the removed transition behavior and required the reduced-motion media block.

- Exit code: 0.
- Result: `transition audit: pageTransition/selectors absent; reduced-motion block present`.

### Diagnostics

`lsp_diagnostics` was requested for all seven changed TypeScript files. Each returned the existing environment condition:

```text
LSP server 'typescript' (.ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts) is NOT INSTALLED; user previously declined installation — proceed without LSP.
```

### Pure LOC checks

PowerShell counted nonblank, non-`//` lines:

- `app/data/navigation.ts`: 62 pure LOC.
- `app/utils/articles.ts`: 55 pure LOC.
- `app/utils/paths.ts`: 13 pure LOC.
- `tests/unit/navigation.test.ts`: 64 pure LOC.
- `tests/unit/articles.test.ts`: 86 pure LOC.
- `tests/unit/paths.test.ts`: 46 pure LOC.
- `nuxt.config.ts`: 58 pure LOC.
- Exit code: 0; every changed TypeScript file remains below 200 and 250 LOC thresholds.

### Review-fix self-review

- Each production module retains one responsibility and exposes only the binding-plan surface.
- Navigation lookup is total and typed; no assertion or fallback can hide a missing route key.
- Article date parsing is centralized in the exported timestamp contract, with invalid values represented consistently as negative infinity.
- Sorting copies input, preserves stable order among invalid/missing dates, and keeps split `combined` order unchanged.
- Path localization has one behavior: delegate canonical input to the supplied callback.
- No function exceeds two parameters; no logging, dependency, asset, content, route, or component changes were introduced.

### Review-fix concerns

- TypeScript LSP diagnostics remain unavailable because the server is not installed and was previously declined.
- The successful build retains only the previously documented Nuxt/Nitro/dependency warnings.
- Temporary localized reference assets remain development-only and are still not production-ready.
