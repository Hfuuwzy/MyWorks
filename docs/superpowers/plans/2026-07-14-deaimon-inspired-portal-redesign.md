# Deaimon-Inspired Portal Redesign Implementation Plan

> [!WARNING]
> **历史归档（2026-07-15）**：本文记录最初的实施计划，其中的 Superpowers 工作流、任务状态、测试数量、文件名和视觉数值不再是现役要求。当前事实以根目录 `README.md`、`DESIGN.md`、`docs/ARCHITECTURE.md`、当前代码和测试为准。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Nuxt portfolio from the current left-sidebar/admin-card layout into the approved right-rail Japanese paper portal while preserving existing content, search, i18n, theme, and route behavior.

**Architecture:** Use `DESIGN.md` and the approved spec as the visual contract. Create a single category/navigation data source, reusable paper/page primitives, a fixed right navigation rail plus accessible drawer, Content 3 blog detail pages with locale-aware canonical lookup, and repeatable unit/browser/visual QA gates.

**Tech Stack:** Nuxt 4.4.8, Vue 3.5, Tailwind CSS 3 via `@nuxtjs/tailwindcss`, Nuxt Content 3.15, `@nuxtjs/i18n` with `prefix_except_default`, `@nuxt/image`, `@vueuse/nuxt`, Vitest for pure TypeScript unit tests, Playwright Test plus Playwright MCP for browser and visual QA.

## Global Constraints

- Source-of-truth design contract: `D:\Code\Blog\portfolio\DESIGN.md`.
- Source-of-truth spec: `D:\Code\Blog\portfolio\docs\superpowers\specs\2026-07-14-deaimon-inspired-portal-redesign-design.md`.
- Do not redesign beyond approved docs.
- Do not hotlink any reference-site asset.
- Do not copy the deaimon logo, reference-site brand copy, character names, or proprietary copy.
- Do not use emoji as structural icons; use inline SVG for menu/search/theme/social/category affordances.
- Do not change runtime dependencies.
- Add dev-only test dependencies only because the current project has no test runner and the approved work requires TDD plus browser tests.
- Preserve current search behavior: search blog title, description, category, and tags; no new search service.
- Preserve current theme behavior: `localStorage.theme`, `.dark` on `document.documentElement`, and `prefers-color-scheme` fallback.
- Preserve i18n strategy: `@nuxtjs/i18n` `prefix_except_default`; default locale routes stay unprefixed, Japanese routes use `/ja`.
- Content documents store canonical unprefixed paths; Japanese article detail pages strip `/ja` before Content 3 lookup.
- Homepage hero uses one temporary local image: `public/images/reference/deaimon/hero-main.png`, copied from `reference/images/文章底片.png`.
- Temporary assets require `public/images/reference/deaimon/ASSET-SOURCES.md`.
- Development preview may request `/images/reference/deaimon/hero-main.png`.
- Production素材 readiness requires zero runtime requests to `/images/reference/deaimon/`, including `hero-main.png`.
- Desktop rail width: `80px`; tablet rail width: `64px`; mobile rail width: `56px`.
- Desktop drawer width: `48vw`, clamped to `min-width: 560px` and `max-width: 760px`.
- Tablet drawer width: about `72vw`.
- Mobile drawer width: full viewport.
- Hero image object-position breakpoints: desktop `50% 34%`, tablet `58% 38%`, mobile `72% 42%`.
- Homepage desktop first view height: `100svh`, minimum `760px`.
- Use `min-h-[100svh]` or CSS `svh`, not `h-screen`, for viewport hero behavior.
- Feed allocation: date-desc sorted posts with even indexes in F-01 left column and odd indexes in F-02 right column; mobile renders one original sorted list.
- All motion must use `transform` and `opacity`, with reduced-motion support.
- Drawer must support focus trap, Escape close, overlay click close, body scroll lock, and focus restoration.
- Search, locale, and theme controls render exactly once and only inside the expanded drawer bottom tool group.
- Do not remove any existing route: `/`, `/blog`, `/projects`, `/movies`, `/anime`, `/music`, `/tools`, `/life`, `/notes`, `/about`.
- Add article detail route: `/blog/[slug]` and localized `/ja/blog/[slug]`.
- Do not include git commit commands in execution steps.
- Atomic commit strategy is documented as optional grouping only; do not commit unless the user explicitly requests it.

---

## Current State Summary

Current app files inspected:

- `app/app.vue` wraps `NuxtLayout` and `NuxtPage`.
- `app/layouts/default.vue` renders the current left sidebar, mobile left menu button, sticky header, centered main content, footer, and scroll-to-top.
- `app/components/layout/Sidebar.vue` owns hardcoded nav items with emoji structural icons.
- `app/components/layout/Header.vue` renders `UiSearchBar` and `UiThemeToggle`.
- `app/components/ui/SearchBar.vue` searches `queryCollection('blog').all()` by title, description, category, and tags.
- `app/components/ui/ThemeToggle.vue` toggles `.dark` and stores `localStorage.theme`.
- `app/pages/index.vue` uses static category data and card/grid sections.
- `app/pages/blog/index.vue` derives categories from Content and renders old 3-column card grid.
- `app/pages/about.vue`, `app/pages/projects/index.vue`, `app/pages/movies/index.vue`, `app/pages/anime/index.vue`, `app/pages/music/index.vue`, `app/pages/tools/index.vue`, `app/pages/life/index.vue`, and `app/pages/notes/index.vue` use old card/grid or admin-card visual language.
- No `app/pages/blog/[slug].vue` exists, so direct article routes currently have no explicit page.
- `content/blog/mysql-basics.md`, `content/blog/ai-thinking.md`, and `content/blog/linux-commands.md` are the current posts.
- `public/images/posts/` contains only `.gitkeep`; current Markdown cover paths point to missing images.
- No test files or test scripts exist.
- `app/assets/css/main.css` contains current pink/teal dashboard tokens and left-sidebar/card utilities.
- `nuxt.config.ts` configures Nuxt Content, Tailwind, i18n, Nuxt Image, and VueUse.
- `tailwind.config.ts` uses Tailwind 3 and `darkMode: 'class'`.

## Dependency Decision

Add dev-only dependencies because they are essential for the requested TDD and repeatable browser tests:

- `vitest`: unit tests for category single source of truth, feed splitting, canonical route helpers.
- `@playwright/test`: repeatable route, drawer, responsive, dark-mode, search, locale, and screenshot tests.

Do not add runtime dependencies. Do not add icon libraries. Use local inline SVG components or SVG markup.

Install command:

```powershell
npm install -D vitest @playwright/test
```

Expected:

```text
added ... packages
audited ... packages
found 0 vulnerabilities
```

If the vulnerability line reports nonzero vulnerabilities, stop and report the package audit output before implementation continues.

## Exact File Inventory

Create:

- `app/data/navigation.ts`
- `app/utils/articles.ts`
- `app/utils/paths.ts`
- `app/components/icons/PaperIcons.vue`
- `app/components/layout/RightNavRail.vue`
- `app/components/layout/RightNavDrawer.vue`
- `app/components/ui/LocaleSwitch.vue`
- `app/components/sections/HomeVisual.vue`
- `app/components/sections/VerticalCategoryNav.vue`
- `app/components/sections/ChronologicalFeed.vue`
- `app/components/content/PaperSectionHeading.vue`
- `app/components/content/ArticleRow.vue`
- `app/components/content/ArticleProse.vue`
- `app/components/content/CategoryLanding.vue`
- `app/components/decor/PatternDecoration.vue`
- `app/pages/blog/[slug].vue`
- `tests/unit/navigation.test.ts`
- `tests/unit/articles.test.ts`
- `tests/unit/paths.test.ts`
- `tests/e2e/redesign.spec.ts`
- `tests/e2e/visual-redesign.spec.ts`
- `playwright.config.ts`
- `vitest.config.ts`
- `public/images/reference/deaimon/ASSET-SOURCES.md`
- `public/images/reference/deaimon/hero-main.png`
- `public/images/reference/deaimon/cover-mysql.jpg`
- `public/images/reference/deaimon/cover-ai.jpg`
- `public/images/reference/deaimon/cover-linux.jpg`
- `public/images/reference/deaimon/paper-body.jpg`
- `public/images/reference/deaimon/paper-section.jpg`
- `public/images/reference/deaimon/paper-nav.jpg`
- `public/images/reference/deaimon/petal-01.png`
- `public/images/reference/deaimon/petal-03.png`
- `public/images/reference/deaimon/petal-07.png`

Modify:

- `package.json`
- `package-lock.json`
- `nuxt.config.ts`
- `tailwind.config.ts`
- `app/assets/css/main.css`
- `app/layouts/default.vue`
- `app/components/layout/Footer.vue`
- `app/components/ui/SearchBar.vue`
- `app/components/ui/ThemeToggle.vue`
- `app/components/ui/ScrollToTop.vue`
- `app/pages/index.vue`
- `app/pages/blog/index.vue`
- `app/pages/projects/index.vue`
- `app/pages/movies/index.vue`
- `app/pages/anime/index.vue`
- `app/pages/music/index.vue`
- `app/pages/tools/index.vue`
- `app/pages/life/index.vue`
- `app/pages/notes/index.vue`
- `app/pages/about.vue`
- `i18n/locales/zh.json`
- `i18n/locales/ja.json`
- `content/blog/mysql-basics.md`
- `content/blog/ai-thinking.md`
- `content/blog/linux-commands.md`

Leave in place unless no longer referenced:

- `app/components/layout/Header.vue`
- `app/components/layout/Sidebar.vue`
- `app/components/sections/HeroSection.vue`
- `app/components/sections/CategoryGrid.vue`
- `app/components/sections/LatestPosts.vue`
- `app/components/sections/AboutSection.vue`
- `app/components/ui/ContentCard.vue`
- `app/components/ui/TagBadge.vue`

After all pages no longer import old layout/card sections, remove unused old components only if the worker confirms no references with `grep` and the build remains green. This removal is cleanup, not required for first green implementation.

## Interfaces

### `app/data/navigation.ts`

```ts
export type PortalRouteKey =
  | 'home'
  | 'blog'
  | 'projects'
  | 'movies'
  | 'anime'
  | 'music'
  | 'tools'
  | 'life'
  | 'notes'
  | 'about'

export interface PortalNavItem {
  readonly key: PortalRouteKey
  readonly path: string
  readonly labelZh: string
  readonly labelJa: string
  readonly englishLabel: string
  readonly descriptionZh: string
  readonly descriptionJa: string
  readonly testId: string
  readonly appearsOnHome: boolean
}

export interface PortalCategory extends PortalNavItem {
  readonly appearsOnHome: true
}

export const portalNavItems: readonly PortalNavItem[]
export const portalCategories: readonly PortalCategory[]
export const getPortalNavItem: (key: PortalRouteKey) => PortalNavItem
```

Rules:

- `portalNavItems` length is exactly 10.
- `portalCategories` length is exactly 8.
- `home` and `about` have `appearsOnHome: false`.
- No icon or emoji field.
- Route order matches spec §4 exactly.

### `app/utils/articles.ts`

```ts
export interface ArticleListItem {
  readonly path: string
  readonly title?: string
  readonly description?: string
  readonly date?: string | Date
  readonly category?: string
  readonly tags?: readonly string[]
  readonly cover?: string
}

export interface SplitFeed<T> {
  readonly primary: readonly T[]
  readonly secondary: readonly T[]
  readonly combined: readonly T[]
}

export const getArticleTimestamp: (date: string | Date | undefined) => number
export const sortArticlesByDateDesc: <T extends ArticleListItem>(items: readonly T[]) => readonly T[]
export const splitEvenOddFeed: <T extends ArticleListItem>(items: readonly T[]) => SplitFeed<T>
export const formatDisplayDate: (date: string | Date | undefined, locale: 'zh' | 'ja') => string
```

Rules:

- `sortArticlesByDateDesc` returns a new array and does not mutate input.
- Missing or invalid dates sort last.
- `splitEvenOddFeed` assumes input already sorted, keeps `combined` as original order, puts indexes `0,2,4...` in `primary`, indexes `1,3,5...` in `secondary`.
- `formatDisplayDate` returns empty string for missing date.

### `app/utils/paths.ts`

```ts
export const DEFAULT_LOCALE = 'zh'
export const JA_PREFIX = '/ja'

export const canonicalContentPathFromRoute: (routePath: string) => string
export const slugFromBlogPath: (path: string) => string
export const localizedPathFromCanonical: (
  canonicalPath: string,
  localePath: (path: string) => string,
) => string
```

Rules:

- `canonicalContentPathFromRoute('/blog/mysql-basics')` returns `/blog/mysql-basics`.
- `canonicalContentPathFromRoute('/ja/blog/mysql-basics')` returns `/blog/mysql-basics`.
- `canonicalContentPathFromRoute('/ja')` returns `/`.
- `canonicalContentPathFromRoute('/ja/')` returns `/`.
- `slugFromBlogPath('/blog/mysql-basics')` returns `mysql-basics`.

### `RightNavRail.vue`

Props:

```ts
interface Props {
  readonly open: boolean
}
```

Emits:

```ts
interface Emits {
  toggle: []
  close: []
}
```

Required test IDs:

- `right-nav-rail`
- `right-nav-brand`
- `right-nav-menu-button`
- `right-nav-menu-icon`
- `right-nav-close-icon`

Required ARIA:

- Menu button has `aria-expanded`.
- Menu button has `aria-controls="right-nav-drawer"`.
- Menu button accessible name is `Open navigation` when closed and `Close navigation` when open.

### `RightNavDrawer.vue`

Props:

```ts
interface Props {
  readonly open: boolean
  readonly items: readonly PortalNavItem[]
}
```

Emits:

```ts
interface Emits {
  close: []
}
```

Required test IDs:

- `right-nav-drawer`
- `right-nav-overlay`
- `right-nav-close`
- `right-nav-links`
- `drawer-tools`
- `drawer-search-toggle`
- `drawer-search-panel`
- `drawer-search-input`
- `locale-switch`
- `theme-toggle`

Rules:

- Uses `role="dialog"` and `aria-modal="true"` only while open.
- Moves focus into first drawer link on open.
- Traps Tab and Shift+Tab inside drawer while open.
- Escape closes drawer.
- Overlay click closes drawer.
- Close button closes drawer.
- Body scroll locks while open and always restores on close, route change, and unmount.
- Focus returns to `right-nav-menu-button` after close.
- Search, locale, and theme controls render exactly once and only in `drawer-tools`.

### `SearchBar.vue`

Preserve current behavior and add localized routing.

Existing logic to keep:

- Query collection: `queryCollection('blog').all()`.
- Search fields: `title`, `description`, `category`, `tags`.
- Empty query clears results.
- Result click clears query and hides dropdown.

New requirements:

- Accept optional `compact?: boolean`.
- Accept optional `inputId?: string`.
- Use `useLocalePath()` to link result `post.path` into current locale.
- Add test IDs:
  - `drawer-search-input`
  - `search-results`
  - `search-result-mysql-basics`
  - `search-result-ai-thinking`
  - `search-result-linux-commands`

### `ThemeToggle.vue`

Preserve current behavior.

Add requirements:

- Render text label and SVG icon.
- Test ID `theme-toggle`.
- Accessible name switches between `Switch to dark mode` and `Switch to light mode`.
- No duplicate instance outside drawer.

### `LocaleSwitch.vue`

Requirements:

- Uses `useI18n()`, `useSwitchLocalePath()`, and current route.
- Test ID `locale-switch`.
- Renders links or buttons for `中文` and `日本語`.
- Switching from `/blog/mysql-basics` to Japanese navigates to `/ja/blog/mysql-basics`.
- Switching from `/ja/blog/mysql-basics` to default navigates to `/blog/mysql-basics`.

### `HomeVisual.vue`

Props:

```ts
interface Props {
  readonly latestPost?: ArticleListItem
  readonly categories: readonly PortalCategory[]
}
```

Required test IDs:

- `home-visual`
- `hero-main-image`
- `home-brand`
- `home-brand-subtitle`
- `home-latest-update`
- `home-category-nav`
- `home-media-slot`
- `home-scroll-cue`

H-coverage:

- H-01: `home-brand` and `home-brand-subtitle`.
- H-02: `home-latest-update`, bound to latest article.
- H-03: `home-category-nav`, eight categories from `portalCategories`.
- H-04: `home-media-slot`, paper placeholder when no media exists, no fake play button.
- H-05: `right-nav-rail`, fixed rail visible on right.

### `ChronologicalFeed.vue`

Props:

```ts
interface Props {
  readonly posts: readonly ArticleListItem[]
  readonly variant: 'home' | 'single'
  readonly title?: string
}
```

Required test IDs:

- `information-feed`
- `feed-column-primary`
- `feed-column-secondary`
- `feed-single-column`
- `article-row-linux-commands`
- `article-row-ai-thinking`
- `article-row-mysql-basics`

Rules:

- `variant: 'home'` uses `splitEvenOddFeed`.
- Desktop displays primary and secondary columns.
- Mobile displays single combined list in date-desc order.
- No duplicate article appears in both desktop columns.
- Links use localized canonical paths.

### `CategoryLanding.vue`

Props:

```ts
interface CategoryLandingItem {
  readonly title: string
  readonly description: string
  readonly category: string
  readonly tags: readonly string[]
  readonly href: string
  readonly date?: string
  readonly cover?: string
}

interface Props {
  readonly navKey: PortalRouteKey
  readonly items: readonly CategoryLandingItem[]
  readonly emptyMessage: string
  readonly layout?: 'timeline' | 'feature-list'
}
```

Required test IDs:

- `category-landing-${navKey}`
- `category-empty-${navKey}`
- `category-list-${navKey}`

Rules:

- Blog, life, notes use timeline style.
- Projects may use open feature-list style.
- Movies, anime, music, tools use open list style.
- No old 3-column card wall.

### `app/pages/blog/[slug].vue`

Requirements:

- Uses `useRoute()`.
- Computes `contentPath = canonicalContentPathFromRoute(route.path)`.
- Queries with `queryCollection('blog').path(contentPath).first()`.
- Uses `queryCollectionItemSurroundings('blog', contentPath, { fields: ['title', 'path', 'description'] })`.
- Throws Nuxt 404 when page missing.
- Renders title, date, category, tags, cover or pattern fallback, Content 3 body with `ContentRenderer`.
- Localizes all internal links using `useLocalePath()`.
- Test IDs:
  - `blog-detail`
  - `blog-detail-title`
  - `blog-detail-meta`
  - `blog-detail-cover`
  - `article-prose`
  - `article-prev-link`
  - `article-next-link`
  - `article-back-link`

## Route List For Browser Coverage

Default locale:

- `/`
- `/blog`
- `/blog/mysql-basics`
- `/blog/ai-thinking`
- `/blog/linux-commands`
- `/projects`
- `/movies`
- `/anime`
- `/music`
- `/tools`
- `/life`
- `/notes`
- `/about`

Japanese locale:

- `/ja`
- `/ja/blog`
- `/ja/blog/mysql-basics`
- `/ja/blog/ai-thinking`
- `/ja/blog/linux-commands`
- `/ja/projects`
- `/ja/movies`
- `/ja/anime`
- `/ja/music`
- `/ja/tools`
- `/ja/life`
- `/ja/notes`
- `/ja/about`

Required extra negative route:

- `/blog/not-a-real-post` returns Nuxt 404.

## Global Test IDs

Use these exact IDs for real-surface checks:

- `site-shell`
- `site-main`
- `right-nav-rail`
- `right-nav-brand`
- `right-nav-menu-button`
- `right-nav-drawer`
- `right-nav-overlay`
- `right-nav-close`
- `right-nav-links`
- `nav-link-home`
- `nav-link-blog`
- `nav-link-projects`
- `nav-link-movies`
- `nav-link-anime`
- `nav-link-music`
- `nav-link-tools`
- `nav-link-life`
- `nav-link-notes`
- `nav-link-about`
- `drawer-tools`
- `drawer-search-toggle`
- `drawer-search-panel`
- `drawer-search-input`
- `search-results`
- `locale-switch`
- `theme-toggle`
- `home-visual`
- `hero-main-image`
- `home-brand`
- `home-latest-update`
- `home-category-nav`
- `home-media-slot`
- `information-feed`
- `feed-column-primary`
- `feed-column-secondary`
- `feed-single-column`
- `category-landing-blog`
- `category-landing-projects`
- `category-landing-movies`
- `category-landing-anime`
- `category-landing-music`
- `category-landing-tools`
- `category-landing-life`
- `category-landing-notes`
- `category-landing-about`
- `blog-detail`
- `article-prose`
- `scroll-to-top`

## Atomic Change Grouping

This section is a commit strategy only. Do not run git commit commands unless the user explicitly asks.

- Group 1: Test harness, test scripts, Playwright/Vitest config, first failing tests.
- Group 2: Navigation/category data source, path/article utilities, asset localization, paper tokens.
- Group 3: Right rail/drawer, focus trap, body lock, drawer tools.
- Group 4: Shared content/page primitives and home redesign.
- Group 5: Blog index/detail Content 3 routing and locale canonical handling.
- Group 6: Remaining category/about pages.
- Group 7: Dark mode, reduced motion, responsive polish, visual QA artifacts, cleanup.

## Parallel Waves And Dependencies

Wave A can start after Task 1:

- Task 2 data/util/tokens/assets.
- Task 5 shared page primitives.
- Task 9 test harness expansion for browser assertions.

Wave B is blocked by Task 2:

- Task 3 right rail/drawer uses `portalNavItems`.
- Task 6 home visual uses `portalCategories`, article helpers, and tokens.
- Task 7 blog index/detail uses path/article helpers.

Wave C is blocked by Task 3 and Task 5:

- Task 4 drawer search/locale/theme tools needs drawer structure.
- Task 8 category/about pages need `CategoryLanding`, `PaperSectionHeading`, and navigation data.

Wave D is blocked by all implementation tasks:

- Task 10 build, browser, visual diff, dual Oracle gates, asset audit, cleanup.

## Task 1: Test Harness And First RED Tests

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/navigation.test.ts`
- Create: `tests/unit/articles.test.ts`
- Create: `tests/unit/paths.test.ts`
- Create: `tests/e2e/redesign.spec.ts`

**Interfaces:**

- Consumes: no project interfaces.
- Produces: repeatable unit and browser test commands used by all later tasks.

- [ ] **Step 1: Install dev-only test tools**

Run:

```powershell
npm install -D vitest @playwright/test
```

Expected:

```text
exit code 0
package.json updated with devDependencies
package-lock.json updated
```

- [ ] **Step 2: Add scripts**

Add to `package.json` scripts:

```json
{
  "test:unit": "vitest run",
  "test:e2e": "playwright test",
  "test": "npm run test:unit && npm run test:e2e"
}
```

Expected after edit: `npm run test:unit` command exists.

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Create Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

- [ ] **Step 5: RED navigation test**

Create `tests/unit/navigation.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { portalCategories, portalNavItems } from '../../app/data/navigation'

describe('portal navigation data', () => {
  it('keeps the spec route order and exposes eight home categories', () => {
    expect(portalNavItems.map(item => item.key)).toEqual([
      'home',
      'blog',
      'projects',
      'movies',
      'anime',
      'music',
      'tools',
      'life',
      'notes',
      'about',
    ])
    expect(portalCategories.map(item => item.key)).toEqual([
      'blog',
      'projects',
      'movies',
      'anime',
      'music',
      'tools',
      'life',
      'notes',
    ])
  })

  it('does not use emoji or icon data for structural navigation', () => {
    for (const item of portalNavItems) {
      expect(Object.keys(item)).not.toContain('icon')
      expect(item.labelZh).not.toMatch(/\p{Extended_Pictographic}/u)
      expect(item.labelJa).not.toMatch(/\p{Extended_Pictographic}/u)
    }
  })
})
```

Run:

```powershell
npm run test:unit -- tests/unit/navigation.test.ts
```

Expected RED:

```text
FAIL tests/unit/navigation.test.ts
Cannot find module '../../app/data/navigation'
```

- [ ] **Step 6: RED article helper test**

Create `tests/unit/articles.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { sortArticlesByDateDesc, splitEvenOddFeed } from '../../app/utils/articles'

const posts = [
  { path: '/blog/mysql-basics', title: 'MySQL', date: '2023-04-20' },
  { path: '/blog/linux-commands', title: 'Linux', date: '2023-06-10' },
  { path: '/blog/ai-thinking', title: 'AI', date: '2023-05-15' },
] as const

describe('article feed helpers', () => {
  it('sorts by date descending without mutating the source array', () => {
    const sorted = sortArticlesByDateDesc(posts)

    expect(sorted.map(post => post.path)).toEqual([
      '/blog/linux-commands',
      '/blog/ai-thinking',
      '/blog/mysql-basics',
    ])
    expect(posts.map(post => post.path)).toEqual([
      '/blog/mysql-basics',
      '/blog/linux-commands',
      '/blog/ai-thinking',
    ])
  })

  it('splits a sorted feed into even primary and odd secondary columns', () => {
    const sorted = sortArticlesByDateDesc(posts)
    const split = splitEvenOddFeed(sorted)

    expect(split.primary.map(post => post.path)).toEqual([
      '/blog/linux-commands',
      '/blog/mysql-basics',
    ])
    expect(split.secondary.map(post => post.path)).toEqual([
      '/blog/ai-thinking',
    ])
    expect(split.combined.map(post => post.path)).toEqual([
      '/blog/linux-commands',
      '/blog/ai-thinking',
      '/blog/mysql-basics',
    ])
  })
})
```

Run:

```powershell
npm run test:unit -- tests/unit/articles.test.ts
```

Expected RED:

```text
FAIL tests/unit/articles.test.ts
Cannot find module '../../app/utils/articles'
```

- [ ] **Step 7: RED path helper test**

Create `tests/unit/paths.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { canonicalContentPathFromRoute, slugFromBlogPath } from '../../app/utils/paths'

describe('locale-aware canonical content paths', () => {
  it('keeps default-locale content paths unchanged', () => {
    expect(canonicalContentPathFromRoute('/blog/mysql-basics')).toBe('/blog/mysql-basics')
  })

  it('strips the Japanese locale prefix before Nuxt Content lookup', () => {
    expect(canonicalContentPathFromRoute('/ja/blog/mysql-basics')).toBe('/blog/mysql-basics')
  })

  it('normalizes the Japanese homepage to the default canonical path', () => {
    expect(canonicalContentPathFromRoute('/ja')).toBe('/')
    expect(canonicalContentPathFromRoute('/ja/')).toBe('/')
  })

  it('extracts a slug from a canonical blog path', () => {
    expect(slugFromBlogPath('/blog/linux-commands')).toBe('linux-commands')
  })
})
```

Run:

```powershell
npm run test:unit -- tests/unit/paths.test.ts
```

Expected RED:

```text
FAIL tests/unit/paths.test.ts
Cannot find module '../../app/utils/paths'
```

- [ ] **Step 8: RED browser smoke test**

Create `tests/e2e/redesign.spec.ts` with an initial absent-surface assertion:

```ts
import { expect, test } from '@playwright/test'

test.describe('right rail redesign shell', () => {
  test('renders the right rail and no old left sidebar on the homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('right-nav-rail')).toBeVisible()
    await expect(page.locator('.sidebar')).toHaveCount(0)
    await expect(page.getByTestId('site-main')).toBeVisible()
  })
})
```

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected RED:

```text
1 failed
Error: Timed out ... getByTestId('right-nav-rail')
```

## Task 2: Navigation Data, Article Helpers, Paths, Tokens, And Local Assets

**Files:**

- Create: `app/data/navigation.ts`
- Create: `app/utils/articles.ts`
- Create: `app/utils/paths.ts`
- Modify: `app/assets/css/main.css`
- Modify: `tailwind.config.ts`
- Modify: `nuxt.config.ts`
- Create: `public/images/reference/deaimon/hero-main.png`
- Create: `public/images/reference/deaimon/cover-mysql.jpg`
- Create: `public/images/reference/deaimon/cover-ai.jpg`
- Create: `public/images/reference/deaimon/cover-linux.jpg`
- Create: `public/images/reference/deaimon/paper-body.jpg`
- Create: `public/images/reference/deaimon/paper-section.jpg`
- Create: `public/images/reference/deaimon/paper-nav.jpg`
- Create: `public/images/reference/deaimon/petal-01.png`
- Create: `public/images/reference/deaimon/petal-03.png`
- Create: `public/images/reference/deaimon/petal-07.png`
- Create: `public/images/reference/deaimon/ASSET-SOURCES.md`
- Modify: `content/blog/mysql-basics.md`
- Modify: `content/blog/ai-thinking.md`
- Modify: `content/blog/linux-commands.md`

**Interfaces:**

- Produces `portalNavItems`, `portalCategories`, article helpers, and path helpers for every later page/component.
- Produces paper CSS tokens, three local article covers, local paper/petal materials, and temporary hero path `/images/reference/deaimon/hero-main.png`.

- [ ] **Step 1: GREEN navigation data**

Implement `app/data/navigation.ts` with the exact interfaces in this plan.

Required item data:

```ts
[
  ['home', '/', '首页', 'ホーム', 'HOME', '返回门户首页', 'ポータルのホームへ', 'nav-link-home', false],
  ['blog', '/blog', '博客文章', 'ブログ', 'BLOG', '技术文章与学习记录', '技術記事と学習記録', 'nav-link-blog', true],
  ['projects', '/projects', '开源作品', 'オープンソース', 'PROJECTS', '开源项目与实验作品', 'オープンソースと実験作品', 'nav-link-projects', true],
  ['movies', '/movies', '电影推荐', '映画のおすすめ', 'MOVIES', '喜欢的电影与剧集', '好きな映画とドラマ', 'nav-link-movies', true],
  ['anime', '/anime', '动漫推荐', 'アニメのおすすめ', 'ANIME', '新番与经典动画', '新作と名作アニメ', 'nav-link-anime', true],
  ['music', '/music', '音乐推荐', '音楽のおすすめ', 'MUSIC', '音乐与歌单记录', '音楽とプレイリスト', 'nav-link-music', true],
  ['tools', '/tools', '工具资源', 'ツール・リソース', 'TOOLS', '开发工具和学习资源', '開発ツールと学習リソース', 'nav-link-tools', true],
  ['life', '/life', '生活随笔', '日常エッセイ', 'LIFE', '日常生活与想法', '日常生活と思考', 'nav-link-life', true],
  ['notes', '/notes', '技术笔记', '技術ノート', 'NOTES', '技术笔记和教程', '技術ノートとチュートリアル', 'nav-link-notes', true],
  ['about', '/about', '关于我', '自己紹介', 'ABOUT', '个人简介与经历', 'プロフィールと経歴', 'nav-link-about', false],
]
```

Run:

```powershell
npm run test:unit -- tests/unit/navigation.test.ts
```

Expected GREEN:

```text
PASS tests/unit/navigation.test.ts
```

- [ ] **Step 2: GREEN article helpers**

Implement `app/utils/articles.ts` with immutable helper behavior.

Run:

```powershell
npm run test:unit -- tests/unit/articles.test.ts
```

Expected GREEN:

```text
PASS tests/unit/articles.test.ts
```

- [ ] **Step 3: GREEN path helpers**

Implement `app/utils/paths.ts`.

Run:

```powershell
npm run test:unit -- tests/unit/paths.test.ts
```

Expected GREEN:

```text
PASS tests/unit/paths.test.ts
```

- [ ] **Step 4: Replace CSS tokens with paper design tokens**

Modify `app/assets/css/main.css`.

Required root tokens:

```css
:root {
  --paper: #f8f5ed;
  --paper-warm: #fffaf0;
  --ink: #2a0c00;
  --ink-soft: #6f5748;
  --vermilion: #e85845;
  --sakura: #efcbd5;
  --matcha: #dce8c8;
  --wagashi: #ead8ad;
  --rule: rgba(42, 12, 0, 0.34);
  --nav-paper: rgba(250, 248, 242, 0.97);
  --rail-width: 80px;
  --rail-width-tablet: 64px;
  --rail-width-mobile: 56px;
  --drawer-width: clamp(560px, 48vw, 760px);
  --color-bg: var(--paper);
  --color-surface: var(--paper-warm);
  --color-text: var(--ink);
  --color-text-secondary: var(--ink-soft);
  --color-border: var(--rule);
}
```

Required dark tokens:

```css
.dark {
  --paper: #171b22;
  --paper-warm: #20232b;
  --ink: #f2eadb;
  --ink-soft: #c6b9a8;
  --vermilion: #ef7867;
  --sakura: #5d404b;
  --matcha: #3f4c3c;
  --wagashi: #564b35;
  --rule: rgba(242, 234, 219, 0.34);
  --nav-paper: rgba(23, 27, 34, 0.97);
  --color-bg: var(--paper);
  --color-surface: var(--paper-warm);
  --color-text: var(--ink);
  --color-text-secondary: var(--ink-soft);
  --color-border: var(--rule);
}
```

Remove or stop using `.sidebar`, `.card`, `bg-mesh`, old pink/teal dashboard gradients, and emoji-oriented card utilities.

Add reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Align Tailwind tokens with CSS variables**

Modify `tailwind.config.ts`:

- Keep `darkMode: 'class'`.
- Map `primary.DEFAULT` to `var(--vermilion)`.
- Map `surface`, `bg`, `text`, and `border` to the CSS variables.
- Change serif font family to include `Noto Serif SC`, `Noto Serif JP`, `Songti SC`, `serif`.
- Do not add new Tailwind plugins.

- [ ] **Step 6: Align Nuxt head fonts and metadata**

Modify `nuxt.config.ts`:

- Replace current Inter/Noto Sans font stylesheet with Noto Serif SC and Noto Serif JP.
- Set `theme-color` to `#f8f5ed`.
- Keep existing modules unchanged.
- Keep i18n strategy unchanged.

Required font link:

```ts
{
  rel: 'stylesheet',
  href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Serif+JP:wght@400;600;700;900&display=swap',
}
```

- [ ] **Step 7: Localize temporary hero asset**

Create directory `public/images/reference/deaimon/`.

Copy:

```powershell
Copy-Item -LiteralPath "reference\images\文章底片.png" -Destination "public\images\reference\deaimon\hero-main.png"
```

Expected:

```text
exit code 0
public/images/reference/deaimon/hero-main.png exists
```

- [ ] **Step 8: Download local paper, petal, and article placeholder assets**

Download exact reference-site files into the already-created local directory. These are development-preview placeholders only; never reference the source URLs from application code.

```powershell
$assets = @(
  @{ Url = 'https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000097.jpg?1661764396'; File = 'cover-mysql.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000096.jpg?1661764396'; File = 'cover-ai.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000127.jpg?1661764396'; File = 'cover-linux.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/tz/paper2.jpg'; File = 'paper-body.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/tz/paper1.jpg'; File = 'paper-section.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/tz/nav/navi_bg.jpg'; File = 'paper-nav.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/sakura/petal01.png'; File = 'petal-01.png' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/sakura/petal03.png'; File = 'petal-03.png' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/sakura/petal07.png'; File = 'petal-07.png' }
)

foreach ($asset in $assets) {
  Invoke-WebRequest -Uri $asset.Url -OutFile (Join-Path 'public\images\reference\deaimon' $asset.File)
}
```

Expected:

```text
exit code 0
all nine files exist locally
cover files report 1500x844 dimensions
no application file contains an https://deaimon.jp image URL
```

- [ ] **Step 9: Point current Markdown covers to local temporary files**

Modify only each frontmatter `cover` value:

```yaml
# content/blog/mysql-basics.md
cover: /images/reference/deaimon/cover-mysql.jpg

# content/blog/ai-thinking.md
cover: /images/reference/deaimon/cover-ai.jpg

# content/blog/linux-commands.md
cover: /images/reference/deaimon/cover-linux.jpg
```

Do not change article titles, dates, tags, categories, or body content.

- [ ] **Step 10: Wire local material URLs into design tokens**

Add these root variables in `app/assets/css/main.css`:

```css
:root {
  --paper-texture: url('/images/reference/deaimon/paper-body.jpg');
  --section-paper-texture: url('/images/reference/deaimon/paper-section.jpg');
  --nav-paper-texture: url('/images/reference/deaimon/paper-nav.jpg');
  --petal-01: url('/images/reference/deaimon/petal-01.png');
  --petal-03: url('/images/reference/deaimon/petal-03.png');
  --petal-07: url('/images/reference/deaimon/petal-07.png');
}
```

Components consume only these local CSS variables; they must not embed source-site URLs.

- [ ] **Step 11: Create asset source audit**

Create `public/images/reference/deaimon/ASSET-SOURCES.md`:

```markdown
# Temporary Asset Sources

These assets are development-preview placeholders for the MyWorks redesign. They are not production-ready ownership-cleared assets.

| File | Source | Page Use | Replacement Status |
|---|---|---|---|
| `hero-main.png` | `reference/images/文章底片.png` in this repository | Homepage H-01 through H-05 temporary hero artwork | Replace before production素材 readiness |
| `cover-mysql.jpg` | `https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000097.jpg?1661764396` | Temporary MySQL article cover | Replace before production素材 readiness |
| `cover-ai.jpg` | `https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000096.jpg?1661764396` | Temporary AI article cover | Replace before production素材 readiness |
| `cover-linux.jpg` | `https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000127.jpg?1661764396` | Temporary Linux article cover | Replace before production素材 readiness |
| `paper-body.jpg` | `https://deaimon.jp/core_sys/images/main/tz/paper2.jpg` | Global paper texture | Replace or recreate before production素材 readiness |
| `paper-section.jpg` | `https://deaimon.jp/core_sys/images/main/tz/paper1.jpg` | Information section texture | Replace or recreate before production素材 readiness |
| `paper-nav.jpg` | `https://deaimon.jp/core_sys/images/main/tz/nav/navi_bg.jpg` | Right rail and drawer texture | Replace or recreate before production素材 readiness |
| `petal-01.png` | `https://deaimon.jp/core_sys/images/main/sakura/petal01.png` | Decorative petal | Replace or recreate before production素材 readiness |
| `petal-03.png` | `https://deaimon.jp/core_sys/images/main/sakura/petal03.png` | Decorative petal | Replace or recreate before production素材 readiness |
| `petal-07.png` | `https://deaimon.jp/core_sys/images/main/sakura/petal07.png` | Decorative petal | Replace or recreate before production素材 readiness |

## Rules

- Do not hotlink source-site assets.
- Do not copy deaimon logo, branded copy, character names, or proprietary social icons.
- Development preview may reference files in this directory.
- Production素材 readiness requires browsing all routes with zero network requests to `/images/reference/deaimon/`, including `hero-main.png`.
```

- [ ] **Step 12: Verify assets and unit tests**

Run:

```powershell
$requiredAssets = @(
  'hero-main.png', 'cover-mysql.jpg', 'cover-ai.jpg', 'cover-linux.jpg',
  'paper-body.jpg', 'paper-section.jpg', 'paper-nav.jpg',
  'petal-01.png', 'petal-03.png', 'petal-07.png', 'ASSET-SOURCES.md'
)

foreach ($file in $requiredAssets) {
  if (-not (Test-Path -LiteralPath (Join-Path 'public\images\reference\deaimon' $file))) {
    throw "Missing temporary asset: $file"
  }
}

npm run test:unit
```

Run:

```powershell
npm run test:unit
```

Expected:

```text
PASS tests/unit/navigation.test.ts
PASS tests/unit/articles.test.ts
PASS tests/unit/paths.test.ts
```

## Task 3: Right Fixed Rail And Accessible Drawer

**Files:**

- Modify: `app/layouts/default.vue`
- Create: `app/components/layout/RightNavRail.vue`
- Create: `app/components/layout/RightNavDrawer.vue`
- Create: `app/components/icons/PaperIcons.vue`

**Interfaces:**

- Consumes `portalNavItems` from `app/data/navigation.ts`.
- Produces the global shell and drawer behavior used by every route.

- [ ] **Step 1: RED browser drawer behavior test**

Append to `tests/e2e/redesign.spec.ts`:

```ts
test('opens and closes the right drawer with keyboard, overlay, and Escape', async ({ page }) => {
  await page.goto('/')

  const menuButton = page.getByTestId('right-nav-menu-button')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')

  await menuButton.press('Enter')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByTestId('right-nav-drawer')).toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

  await menuButton.click()
  await page.getByTestId('right-nav-overlay').click({ position: { x: 10, y: 10 } })
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
})
```

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected RED:

```text
failed because right-nav-menu-button is missing
```

- [ ] **Step 2: Implement shell state in default layout**

Modify `app/layouts/default.vue`:

- Root wrapper test ID: `site-shell`.
- Main test ID: `site-main`.
- Remove `LayoutSidebar` and `LayoutHeader`.
- Use `LayoutRightNavRail` and `LayoutRightNavDrawer`.
- Keep `LayoutFooter` and `UiScrollToTop`.
- Use `const navOpen = ref(false)`.
- Close drawer after route changes with `watch(() => route.fullPath, () => { navOpen.value = false })`.

- [ ] **Step 3: Implement `RightNavRail.vue`**

Required behavior:

- `position: fixed; inset-block: 0; inset-inline-end: 0`.
- Width uses CSS var with responsive breakpoints.
- Button hit area at least `44px`.
- Three-line SVG changes to close SVG when open.
- Uses vertical brand text, not a logo image.
- No search/theme/locale controls in rail.

- [ ] **Step 4: Implement `RightNavDrawer.vue`**

Required behavior:

- Renders overlay and drawer only once in DOM.
- Uses `portalNavItems` order.
- Uses `useLocalePath()` for every route link.
- Active item is indicated with vermilion stamp dot and ink emphasis.
- Focus trap:
  - On open, store `document.activeElement`.
  - Focus first drawer nav link.
  - On Tab at last focusable, wrap to first.
  - On Shift+Tab at first focusable, wrap to last.
  - On close, restore previous focused button if still connected.
- Body lock:
  - Set `document.body.style.overflow = 'hidden'` while open.
  - Restore prior body overflow value on close and unmount.
- Escape closes.
- Overlay click closes.
- Reduced motion uses near-zero transition through CSS media query.

- [ ] **Step 5: Verify drawer browser test**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected for tests added so far:

```text
2 passed
```

## Task 4: Drawer Search, Locale, And Theme Controls

**Files:**

- Modify: `app/components/layout/RightNavDrawer.vue`
- Modify: `app/components/ui/SearchBar.vue`
- Modify: `app/components/ui/ThemeToggle.vue`
- Create: `app/components/ui/LocaleSwitch.vue`
- Modify: `i18n/locales/zh.json`
- Modify: `i18n/locales/ja.json`

**Interfaces:**

- Consumes `SearchBar`, `ThemeToggle`, i18n composables, and drawer bottom tool group.
- Produces single-instance search, locale, and theme controls.

- [ ] **Step 1: RED browser test for single drawer tools**

Append to `tests/e2e/redesign.spec.ts`:

```ts
test('renders search locale and theme controls only inside the expanded drawer', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('drawer-search-input')).toHaveCount(0)
  await expect(page.getByTestId('locale-switch')).toHaveCount(0)
  await expect(page.getByTestId('theme-toggle')).toHaveCount(0)

  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('drawer-search-toggle').click()

  await expect(page.getByTestId('drawer-search-input')).toHaveCount(1)
  await expect(page.getByTestId('locale-switch')).toHaveCount(1)
  await expect(page.getByTestId('theme-toggle')).toHaveCount(1)
  await expect(page.getByTestId('drawer-tools').getByTestId('drawer-search-input')).toBeVisible()
})
```

Expected RED: controls absent or duplicated.

- [ ] **Step 2: RED browser test for search result paths**

Append:

```ts
test('search finds existing posts and links through the current locale', async ({ page }) => {
  await page.goto('/ja')
  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('drawer-search-toggle').click()
  await page.getByTestId('drawer-search-input').fill('Linux')

  await expect(page.getByTestId('search-result-linux-commands')).toBeVisible()
  await expect(page.getByTestId('search-result-linux-commands')).toHaveAttribute('href', '/ja/blog/linux-commands')
})
```

Expected RED: search result missing or wrong unlocalized href.

- [ ] **Step 3: RED browser test for theme behavior**

Append:

```ts
test('theme toggle preserves the existing dark-mode behavior', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('theme-toggle').click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.evaluate(() => window.localStorage.getItem('theme'))).resolves.toBe('dark')
})
```

Expected RED: theme toggle missing from drawer.

- [ ] **Step 4: Update `SearchBar.vue`**

Required changes:

- Add `compact` and `inputId` props.
- Preserve current `handleSearch`, `hideResults`, and `handleResultClick` behavior.
- Use `useLocalePath()` so result hrefs match current locale.
- Use drawer-friendly paper styling.
- Add `data-testid` values listed in this plan.
- Keep `@mousedown.prevent="handleResultClick"` for result clicks.

- [ ] **Step 5: Update `ThemeToggle.vue`**

Required changes:

- Preserve localStorage and `prefers-color-scheme`.
- Add text label.
- Add `data-testid="theme-toggle"`.
- Use SVG, no emoji.
- Keep the `.dark` class on `document.documentElement`.

- [ ] **Step 6: Create `LocaleSwitch.vue`**

Required behavior:

- Render inside drawer tools only.
- Current locale is indicated with vermilion/ink state.
- Uses `useSwitchLocalePath()` to preserve current route.
- Test ID `locale-switch`.

- [ ] **Step 7: Render drawer tools**

Modify `RightNavDrawer.vue`:

- Add bottom tool group `data-testid="drawer-tools"`.
- Add search toggle `data-testid="drawer-search-toggle"`.
- Search input is hidden until search panel is opened.
- Search panel uses `data-testid="drawer-search-panel"`.
- Add `UiLocaleSwitch`.
- Add `UiThemeToggle`.

- [ ] **Step 8: Verify drawer tools**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected:

```text
5 passed
```

## Task 5: Shared Paper Content Primitives

**Files:**

- Create: `app/components/content/PaperSectionHeading.vue`
- Create: `app/components/content/ArticleRow.vue`
- Create: `app/components/content/ArticleProse.vue`
- Create: `app/components/content/CategoryLanding.vue`
- Create: `app/components/sections/ChronologicalFeed.vue`
- Create: `app/components/sections/VerticalCategoryNav.vue`
- Create: `app/components/decor/PatternDecoration.vue`

**Interfaces:**

- Consumes article helpers, path helpers, `portalCategories`, and `useLocalePath`.
- Produces reusable primitives for home, blog, category pages, and article details.

- [ ] **Step 1: RED browser test for no card-grid article wall**

Append:

```ts
test('blog index uses chronological rows instead of the old card grid wall', async ({ page }) => {
  await page.goto('/blog')

  await expect(page.getByTestId('category-landing-blog')).toBeVisible()
  await expect(page.getByTestId('article-row-linux-commands')).toBeVisible()
  await expect(page.locator('.card')).toHaveCount(0)
  await expect(page.locator('.grid.lg\\:grid-cols-3')).toHaveCount(0)
})
```

Expected RED: old blog card grid exists and new test IDs are missing.

- [ ] **Step 2: Implement `PaperSectionHeading.vue`**

Props:

```ts
interface Props {
  readonly stamp: string
  readonly english: string
  readonly title: string
  readonly description?: string
}
```

Render:

- Vermilion stamp text.
- English uppercase label with `0.28em–0.42em` letter spacing.
- Chinese/Japanese title and optional description.
- No emoji.

- [ ] **Step 3: Implement `ArticleRow.vue`**

Props:

```ts
interface Props {
  readonly post: ArticleListItem
  readonly emphasis?: boolean
}
```

Render:

- Date.
- Category.
- Title link.
- Optional description.
- Stamp-style tags.
- Dotted ink divider.
- Localized link path.
- `data-testid="article-row-${slug}"`.

- [ ] **Step 4: Implement `ChronologicalFeed.vue`**

Use `splitEvenOddFeed` for `variant="home"`.

Desktop home:

- `feed-column-primary` renders even indexes.
- `feed-column-secondary` renders odd indexes.

Mobile:

- `feed-single-column` renders combined date-desc order.
- No horizontal scrolling.

- [ ] **Step 5: Implement `VerticalCategoryNav.vue`**

Props:

```ts
interface Props {
  readonly categories: readonly PortalCategory[]
  readonly density?: 'hero' | 'drawer'
}
```

Render:

- `writing-mode: vertical-rl`.
- Semantic link order remains normal DOM order.
- Touch targets at least `44px`.
- Localized links.

- [ ] **Step 6: Implement `CategoryLanding.vue`**

Use `PaperSectionHeading` and `ArticleRow` or open feature rows.

Rules:

- Empty state uses patterned paper explanation.
- No large rounded card grid.
- No emoji icons.
- Test IDs from this plan.

- [ ] **Step 7: Implement `ArticleProse.vue`**

Wrap `ContentRenderer`.

Required style coverage:

- Headings.
- Paragraph rhythm.
- Links.
- Blockquotes.
- Code blocks.
- Images with stable aspect/fixed max width.
- Tables if rendered by Content.
- Uses paper/ink tokens.

- [ ] **Step 8: Implement `PatternDecoration.vue`**

Use CSS gradients or empty-alt decorative layers. Do not add information-bearing images.

- [ ] **Step 9: Verify primitive compile through build**

Run:

```powershell
npm run build
```

Expected:

```text
exit code 0
Nuxt build completes without TypeScript or Vue template errors
```

## Task 6: Homepage H-01 Through H-05 And F-01/F-02

**Files:**

- Create: `app/components/sections/HomeVisual.vue`
- Modify: `app/pages/index.vue`
- Modify: `app/components/layout/Footer.vue`

**Interfaces:**

- Consumes `portalCategories`, `sortArticlesByDateDesc`, `splitEvenOddFeed`, `HomeVisual`, `ChronologicalFeed`, and shared primitives.
- Produces the approved homepage hero and feed.

- [ ] **Step 1: RED homepage visual test**

Append:

```ts
test('homepage renders H-01 through H-05 with real DOM layers', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('home-visual')).toBeVisible()
  await expect(page.getByTestId('hero-main-image')).toHaveAttribute('src', /\/images\/reference\/deaimon\/hero-main\.png/)
  await expect(page.getByTestId('home-brand')).toContainText('MyWorks')
  await expect(page.getByTestId('home-latest-update')).toContainText('Linux常用命令')
  await expect(page.getByTestId('home-category-nav').getByRole('link')).toHaveCount(8)
  await expect(page.getByTestId('home-media-slot')).toBeVisible()
  await expect(page.getByTestId('right-nav-rail')).toBeVisible()
})
```

Expected RED: new hero IDs missing.

- [ ] **Step 2: RED feed allocation test**

Append:

```ts
test('homepage feed uses F-01 and F-02 even odd allocation without duplicates', async ({ page }) => {
  await page.goto('/')

  const primary = page.getByTestId('feed-column-primary')
  const secondary = page.getByTestId('feed-column-secondary')

  await expect(primary.getByTestId('article-row-linux-commands')).toBeVisible()
  await expect(secondary.getByTestId('article-row-ai-thinking')).toBeVisible()
  await expect(primary.getByTestId('article-row-mysql-basics')).toBeVisible()
  await expect(secondary.getByTestId('article-row-linux-commands')).toHaveCount(0)
})
```

Expected RED: feed columns missing.

- [ ] **Step 3: Implement `HomeVisual.vue`**

Required details:

- Background image is real `<img>`, not full-page screenshot.
- `src="/images/reference/deaimon/hero-main.png"`.
- `alt="Temporary watercolor-style storefront artwork for the MyWorks homepage"`.
- `loading="eager"`.
- `fetchpriority="high"`.
- `object-fit: cover`.
- Desktop `object-position: 50% 34%`.
- Tablet `object-position: 58% 38%`.
- Mobile `object-position: 72% 42%`.
- Left content sits on soft paper/warm/sakura mist, not a hard dashboard card.
- H-04 shows restrained paper placeholder when no media exists and no fake play button.
- Mobile content moves into bottom paper gradient and avoids key faces.

- [ ] **Step 4: Rewrite `app/pages/index.vue`**

Required flow:

1. Query all blog posts ordered by date desc.
2. Compute `latestPost`.
3. Render `HomeVisual`.
4. Render `ChronologicalFeed variant="home"` for `INFORMATION / 最近更新`.
5. Render project/about summary using shared paper primitives.
6. Keep footer.

- [ ] **Step 5: Update footer**

Modify `Footer.vue`:

- Remove dashboard wording if present.
- Keep RSS link.
- Use paper/ink tokens.
- Keep copyright.
- No emoji.

- [ ] **Step 6: Verify homepage tests**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected:

```text
homepage H-01 through H-05 test passes
F-01/F-02 allocation test passes
```

## Task 7: Blog Index And `/blog/[slug].vue` Content 3 Detail Lookup

**Files:**

- Modify: `app/pages/blog/index.vue`
- Create: `app/pages/blog/[slug].vue`
- Modify: `app/components/ui/SearchBar.vue` if path localization gaps remain
- Modify: `app/components/content/ArticleProse.vue` if detail rendering requires prose fixes

**Interfaces:**

- Consumes `canonicalContentPathFromRoute`, `localizedPathFromCanonical`, `ArticleProse`, `ArticleRow`, `CategoryLanding`, and Content 3 query APIs.
- Produces article detail pages for default and Japanese locale paths.

- [ ] **Step 1: RED detail route browser test**

Append:

```ts
test('renders all current article detail routes without router no-match warnings', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleErrors.push(message.text())
    }
  })

  for (const path of ['/blog/mysql-basics', '/blog/ai-thinking', '/blog/linux-commands']) {
    await page.goto(path)
    await expect(page.getByTestId('blog-detail')).toBeVisible()
    await expect(page.getByTestId('article-prose')).toBeVisible()
  }

  expect(consoleErrors.join('\n')).not.toContain('No match found for location')
})
```

Expected RED: article route does not render detail page.

- [ ] **Step 2: RED Japanese canonical lookup browser test**

Append:

```ts
test('Japanese article routes strip /ja for Content lookup and keep localized links', async ({ page }) => {
  await page.goto('/ja/blog/mysql-basics')

  await expect(page.getByTestId('blog-detail')).toBeVisible()
  await expect(page.getByTestId('blog-detail-title')).toContainText('MySQL基础教程')
  await expect(page.getByTestId('article-back-link')).toHaveAttribute('href', '/ja/blog')
})
```

Expected RED: Japanese article route missing or Content lookup fails.

- [ ] **Step 3: RED 404 test**

Append:

```ts
test('missing blog detail returns the Nuxt 404 surface', async ({ page }) => {
  const response = await page.goto('/blog/not-a-real-post')
  expect(response?.status()).toBe(404)
})
```

Expected RED: route not handled correctly.

- [ ] **Step 4: Rewrite blog index**

Modify `app/pages/blog/index.vue`:

- Use `CategoryLanding` or `ChronologicalFeed variant="single"`.
- Keep client-side category filter.
- Filter options are text labels with line/ink state, not rounded colorful buttons.
- Use all categories derived from posts.
- No old `UiContentCard` grid.

- [ ] **Step 5: Create article detail page**

Create `app/pages/blog/[slug].vue`.

Required data fetch shape:

```ts
const route = useRoute()
const localePath = useLocalePath()
const contentPath = computed(() => canonicalContentPathFromRoute(route.path))

const { data } = await useAsyncData(`blog-detail:${contentPath.value}`, () =>
  Promise.all([
    queryCollection('blog').path(contentPath.value).first(),
    queryCollectionItemSurroundings('blog', contentPath.value, {
      fields: ['title', 'description', 'path'],
    }),
  ]),
  {
    transform: ([page, surround]) => ({ page, surround }),
  },
)

if (!data.value?.page) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
  })
}
```

Render with `ContentRenderer` inside `ArticleProse`.

- [ ] **Step 6: Implement previous/next/back links**

Rules:

- Previous and next links use returned `path` and `localePath(path)`.
- Back link uses `localePath('/blog')`.
- Hidden if surrounding item is missing.

- [ ] **Step 7: Verify route and detail behavior**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected:

```text
article detail tests pass
Japanese canonical lookup test passes
missing detail test passes
```

## Task 8: Projects, Movies, Anime, Music, Tools, Life, Notes, And About Pages

**Files:**

- Modify: `app/pages/projects/index.vue`
- Modify: `app/pages/movies/index.vue`
- Modify: `app/pages/anime/index.vue`
- Modify: `app/pages/music/index.vue`
- Modify: `app/pages/tools/index.vue`
- Modify: `app/pages/life/index.vue`
- Modify: `app/pages/notes/index.vue`
- Modify: `app/pages/about.vue`

**Interfaces:**

- Consumes `CategoryLanding`, `PaperSectionHeading`, and `portalNavItems`.
- Produces all existing category/about pages in the new paper visual system.

- [ ] **Step 1: RED browser route-list page primitive test**

Append:

```ts
test('all category and about pages use paper landing surfaces', async ({ page }) => {
  const routes = [
    ['projects', '/projects'],
    ['movies', '/movies'],
    ['anime', '/anime'],
    ['music', '/music'],
    ['tools', '/tools'],
    ['life', '/life'],
    ['notes', '/notes'],
    ['about', '/about'],
  ] as const

  for (const [key, path] of routes) {
    await page.goto(path)
    await expect(page.getByTestId(`category-landing-${key}`)).toBeVisible()
    await expect(page.locator('.card')).toHaveCount(0)
    await expect(page.locator('main')).not.toContainText('🎬')
    await expect(page.locator('main')).not.toContainText('📺')
    await expect(page.locator('main')).not.toContainText('🎵')
    await expect(page.locator('main')).not.toContainText('🔧')
    await expect(page.locator('main')).not.toContainText('🌸')
    await expect(page.locator('main')).not.toContainText('📚')
  }
})
```

Expected RED: pages still use old grids and emojis.

- [ ] **Step 2: Rewrite projects page**

Use `CategoryLanding navKey="projects"` with open feature-list items:

- `MyWorks`
- `More work in progress`

Replace the old unknown-language placeholder. Use `languages: ['Vue', 'TypeScript', 'Nuxt']` for `MyWorks` and `languages: ['Research', 'Prototype']` for the second entry.

- [ ] **Step 3: Rewrite movies page**

Use `CategoryLanding navKey="movies"`.

Items:

- `推荐电影列表`
- `推荐剧集列表`

No emoji, no card grid.

- [ ] **Step 4: Rewrite anime page**

Use `CategoryLanding navKey="anime"`.

Items:

- `每月新番推荐`
- `经典动漫回顾`

No emoji, no card grid.

- [ ] **Step 5: Rewrite music page**

Use `CategoryLanding navKey="music"`.

Items:

- `推荐歌单`

No emoji, no card grid.

- [ ] **Step 6: Rewrite tools page**

Use `CategoryLanding navKey="tools"`.

Items:

- `开发工具推荐`
- `学习资源汇总`

No emoji, no card grid.

- [ ] **Step 7: Rewrite life page**

Use `CategoryLanding navKey="life"`.

Items:

- `生活随笔`

No emoji, no card grid.

- [ ] **Step 8: Rewrite notes page**

Use `CategoryLanding navKey="notes"`.

Items:

- `技术笔记汇总`

No emoji, no card grid.

- [ ] **Step 9: Rewrite about page**

Use a paper about layout:

- `data-testid="category-landing-about"`.
- Large visual/pattern area.
- Vertical self-introduction heading.
- Horizontal body text.
- Skills as fine-line list, not grid of emoji skills.
- Experience as thin timeline.
- Social links as text/SVG, not emoji.

- [ ] **Step 10: Verify category/about pages**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected:

```text
all category and about page tests pass
```

## Task 9: Responsive, Dark Mode, Reduced Motion, And Real-Surface Browser Tests

**Files:**

- Modify: `app/assets/css/main.css`
- Modify: `tests/e2e/redesign.spec.ts`
- Create: `tests/e2e/visual-redesign.spec.ts`

**Interfaces:**

- Consumes completed UI.
- Produces responsive and visual evidence artifacts.

- [ ] **Step 1: Add viewport behavior tests**

Append to `tests/e2e/redesign.spec.ts`:

```ts
test('responsive rail and drawer dimensions match the approved breakpoints', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.getByTestId('right-nav-rail')).toHaveCSS('width', '80px')
  await page.getByTestId('right-nav-menu-button').click()
  await expect(page.getByTestId('right-nav-drawer')).toBeVisible()

  const desktopDrawer = await page.getByTestId('right-nav-drawer').boundingBox()
  expect(desktopDrawer?.width).toBeGreaterThanOrEqual(560)
  expect(desktopDrawer?.width).toBeLessThanOrEqual(760)

  await page.setViewportSize({ width: 768, height: 1024 })
  await page.reload()
  await expect(page.getByTestId('right-nav-rail')).toHaveCSS('width', '64px')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(page.getByTestId('right-nav-rail')).toHaveCSS('width', '56px')
  await page.getByTestId('right-nav-menu-button').click()
  const mobileDrawer = await page.getByTestId('right-nav-drawer').boundingBox()
  expect(Math.round(mobileDrawer?.width ?? 0)).toBe(390)
})
```

Expected before polish: may fail on widths or drawer sizing.

- [ ] **Step 2: Add focus trap test**

Append:

```ts
test('drawer traps focus and restores focus to the trigger', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByTestId('right-nav-menu-button')
  await trigger.focus()
  await page.keyboard.press('Enter')

  await expect(page.getByTestId('nav-link-home')).toBeFocused()

  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press('Tab')
    const activeInsideDrawer = await page.evaluate(() => {
      const drawer = document.querySelector('[data-testid="right-nav-drawer"]')
      return drawer?.contains(document.activeElement)
    })
    expect(activeInsideDrawer).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})
```

Expected before polish: may fail if focus trap incomplete.

- [ ] **Step 3: Add reduced motion test**

Append:

```ts
test.use({ reducedMotion: 'reduce' })

test('reduced motion removes drawer and decoration animation duration', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('right-nav-menu-button').click()

  const duration = await page.getByTestId('right-nav-drawer').evaluate(element =>
    window.getComputedStyle(element).transitionDuration,
  )

  expect(duration === '0.01ms' || duration === '0s').toBe(true)
})
```

Expected before polish: may fail if transition override not applied.

- [ ] **Step 4: Add dark mode layout tests**

Append:

```ts
test('dark mode keeps layout dimensions and readable surfaces', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByTestId('right-nav-menu-button').click()
  await page.getByTestId('theme-toggle').click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByTestId('right-nav-rail')).toHaveCSS('width', '80px')
  await expect(page.getByTestId('home-brand')).toBeVisible()

  await page.goto('/blog/linux-commands')
  await expect(page.getByTestId('article-prose')).toBeVisible()
})
```

Expected: passes after dark tokens and theme toggle are complete.

- [ ] **Step 5: Create screenshot test file**

Create `tests/e2e/visual-redesign.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
  { name: '375x667', width: 375, height: 667 },
] as const

for (const viewport of viewports) {
  test(`homepage closed state screenshot ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await expect(page.getByTestId('home-visual')).toBeVisible()
    await page.screenshot({
      path: `test-results/screenshots/home-closed-${viewport.name}.png`,
      fullPage: false,
    })
  })
}

test('homepage expanded drawer screenshot 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByTestId('right-nav-menu-button').click()
  await expect(page.getByTestId('right-nav-drawer')).toBeVisible()
  await page.screenshot({
    path: 'test-results/screenshots/home-drawer-1440x900.png',
    fullPage: false,
  })
})

test('homepage information section screenshot 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByTestId('information-feed').scrollIntoViewIfNeeded()
  await page.screenshot({
    path: 'test-results/screenshots/home-information-1440x900.png',
    fullPage: false,
  })
})
```

- [ ] **Step 6: Verify responsive/browser tests**

Run:

```powershell
npm run test:e2e -- tests/e2e/redesign.spec.ts
```

Expected:

```text
all tests in redesign.spec.ts pass
```

Run:

```powershell
npm run test:e2e -- tests/e2e/visual-redesign.spec.ts
```

Expected:

```text
7 passed
PNG files exist under test-results/screenshots/
```

## Task 10: Full Route, Build, Visual Diff, Dual Oracle Gates, Asset Audit, And Cleanup

**Files:**

- Modify: `tests/e2e/redesign.spec.ts`
- Modify: any implementation file needed to resolve final QA findings
- Do not modify files after the final green verification without rerunning this task

**Interfaces:**

- Consumes the completed implementation.
- Produces the release readiness evidence.

- [ ] **Step 1: Add full route list test**

Append:

```ts
test('all approved default and Japanese routes render the right rail shell', async ({ page }) => {
  const routes = [
    '/',
    '/blog',
    '/blog/mysql-basics',
    '/blog/ai-thinking',
    '/blog/linux-commands',
    '/projects',
    '/movies',
    '/anime',
    '/music',
    '/tools',
    '/life',
    '/notes',
    '/about',
    '/ja',
    '/ja/blog',
    '/ja/blog/mysql-basics',
    '/ja/blog/ai-thinking',
    '/ja/blog/linux-commands',
    '/ja/projects',
    '/ja/movies',
    '/ja/anime',
    '/ja/music',
    '/ja/tools',
    '/ja/life',
    '/ja/notes',
    '/ja/about',
  ]

  for (const route of routes) {
    await page.goto(route)
    await expect(page.getByTestId('right-nav-rail')).toBeVisible()
    await expect(page.getByTestId('site-main')).toBeVisible()
  }
})
```

- [ ] **Step 2: Add no hotlink test**

Append:

```ts
test('runtime pages do not hotlink external reference assets', async ({ page }) => {
  const externalImageRequests: string[] = []

  page.on('request', request => {
    const url = request.url()
    if (
      request.resourceType() === 'image'
      && !url.startsWith('http://127.0.0.1:3000')
      && !url.startsWith('http://localhost:3000')
      && !url.startsWith('data:')
    ) {
      externalImageRequests.push(url)
    }
  })

  await page.goto('/')
  await page.goto('/blog/linux-commands')
  await page.goto('/about')

  expect(externalImageRequests).toEqual([])
})
```

- [ ] **Step 3: Add development temporary asset audit test**

Append:

```ts
test('development preview temporary hero asset is declared in ASSET-SOURCES', async ({ page }) => {
  const referenceRequests: string[] = []

  page.on('request', request => {
    if (request.url().includes('/images/reference/deaimon/')) {
      referenceRequests.push(request.url())
    }
  })

  await page.goto('/')
  expect(referenceRequests.some(url => url.endsWith('/hero-main.png'))).toBe(true)
})
```

This confirms development preview uses the declared temporary hero asset. Production素材 readiness remains a separate zero-request audit after owned replacement assets exist.

- [ ] **Step 4: Run all unit tests**

Run:

```powershell
npm run test:unit
```

Expected:

```text
PASS tests/unit/navigation.test.ts
PASS tests/unit/articles.test.ts
PASS tests/unit/paths.test.ts
```

- [ ] **Step 5: Run full browser tests**

Run:

```powershell
npm run test:e2e
```

Expected:

```text
all Playwright tests pass
```

- [ ] **Step 6: Run production build**

Run:

```powershell
npm run build
```

Expected:

```text
exit code 0
Nuxt build completes
No Vue Router "No match found for location" warnings
No Content collection errors
No TypeScript errors
```

- [ ] **Step 7: Run preview server for Playwright MCP real-surface QA**

Run:

```powershell
npm run preview -- --host 127.0.0.1 --port 3000
```

Expected:

```text
Listening on http://127.0.0.1:3000
```

If port 3000 is in use, stop the conflicting process only if it belongs to this task. Otherwise use an alternate port and update browser URLs in this QA section.

- [ ] **Step 8: Playwright MCP real-surface checks**

Using Playwright MCP against `http://127.0.0.1:3000`, check these real surfaces:

- At `/`, `right-nav-rail` fixed at right.
- At `/`, old `.sidebar` count is `0`.
- At `/`, `home-brand`, `home-latest-update`, `home-category-nav`, `home-media-slot`, and `hero-main-image` are real DOM nodes, not baked into one screenshot.
- At `/`, `hero-main-image` computed `object-position` is `50% 34%` at `1440x900`.
- At `/`, `hero-main-image` computed `object-position` is `58% 38%` at `768x1024`.
- At `/`, `hero-main-image` computed `object-position` is `72% 42%` at `390x844`.
- At `/`, drawer opens from right, overlay appears, body overflow locks, Escape closes, and focus returns.
- At `/`, `drawer-search-input`, `locale-switch`, and `theme-toggle` each have exactly one interactive instance while drawer is open.
- At `/ja`, searching `Linux` links to `/ja/blog/linux-commands`.
- At `/blog/linux-commands`, Content body renders and no router no-match warning appears.
- At `/ja/blog/linux-commands`, Content lookup succeeds from canonical `/blog/linux-commands`.
- At `/blog`, article rows are date-desc and no old card grid is visible.
- At `/projects`, `/movies`, `/anime`, `/music`, `/tools`, `/life`, `/notes`, `/about`, shared page surfaces render and no emoji structural icons appear.
- With reduced motion emulation, drawer transition duration is `0.01ms` or `0s`.
- In dark mode at `1440x900` and `390x844`, layout dimensions match light mode.

- [ ] **Step 9: Capture five viewport screenshots**

Using Playwright Test or Playwright MCP, create these exact screenshots:

- `test-results/screenshots/home-closed-1440x900.png`
- `test-results/screenshots/home-closed-1280x800.png`
- `test-results/screenshots/home-closed-768x1024.png`
- `test-results/screenshots/home-closed-390x844.png`
- `test-results/screenshots/home-closed-375x667.png`

Also capture:

- `test-results/screenshots/home-drawer-1440x900.png`
- `test-results/screenshots/home-information-1440x900.png`
- `test-results/screenshots/home-dark-1440x900.png`
- `test-results/screenshots/home-dark-390x844.png`
- `test-results/screenshots/blog-detail-dark-1440x900.png`
- `test-results/screenshots/blog-detail-dark-390x844.png`

Expected:

```text
all PNG files exist
screenshots are fresher than the last edited source file
```

- [ ] **Step 10: Visual diff against reference images**

Run visual diff commands with the visual QA script path available in this environment:

```powershell
node "C:\Users\Administrator\.cache\opencode\packages\oh-my-openagent@latest\node_modules\oh-my-openagent\dist\skills\visual-qa\scripts\visual-qa.mjs" image-diff "reference\ref_design\首页参考图.png" "test-results\screenshots\home-closed-1440x900.png"
```

```powershell
node "C:\Users\Administrator\.cache\opencode\packages\oh-my-openagent@latest\node_modules\oh-my-openagent\dist\skills\visual-qa\scripts\visual-qa.mjs" image-diff "reference\ref_design\侧边栏展开参考.png" "test-results\screenshots\home-drawer-1440x900.png"
```

```powershell
node "C:\Users\Administrator\.cache\opencode\packages\oh-my-openagent@latest\node_modules\oh-my-openagent\dist\skills\visual-qa\scripts\visual-qa.mjs" image-diff "reference\ref_design\下滑内容展示排版.png" "test-results\screenshots\home-information-1440x900.png"
```

Expected diagnostic outputs:

- `dimensionsMatch` may be false if reference image dimensions differ; compare region intent if so.
- Right rail width actual is `80px` with `≤1px` tolerance.
- Desktop drawer width is within `560–760px`.
- First viewport hero height equals viewport height at desktop.
- Hotspot regions for H-01 through H-05, N-01, F-01, and F-02 are explainable by MyWorks copy/brand replacement and not by missing DOM structure.
- Structural hotspot difference does not exceed the spec’s `35%` red-box region threshold unless the cause is approved copy/brand replacement.

- [ ] **Step 11: Run dual Oracle gate A**

Dispatch read-only Oracle A with:

```text
REVIEW TYPE: DESIGN-SYSTEM AND FUNCTIONAL INTEGRITY

Intent: Verify the Nuxt 4 MyWorks redesign against DESIGN.md and the approved spec. Check real DOM implementation, reusable tokens/primitives, no pasted screenshot UI, no hotlinks, no copied deaimon logo/copy, preserved search/i18n/theme behavior, right rail/drawer behavior, Content 3 detail lookup, responsive behavior, reduced motion, and dark mode.

Evidence:
- DESIGN.md
- approved spec path
- changed file list
- npm run test:unit output
- npm run test:e2e output
- npm run build output
- screenshot paths
- visual diff JSON outputs
- Playwright MCP real-surface observations

Required verdict: PASS only if no blocking findings remain.
```

Expected:

```text
VERDICT: PASS
BLOCKING: empty
```

If Oracle A returns REVISE or FAIL, implement fixes and restart Task 10 from Step 4.

- [ ] **Step 12: Run dual Oracle gate B**

Dispatch read-only Oracle B with:

```text
REVIEW TYPE: VISUAL FIDELITY AND CJK PRECISION

Intent: Compare actual screenshots against 首页参考图.png, 侧边栏展开参考.png, 下滑内容展示排版.png, DESIGN.md, and the approved spec. Inspect CJK line breaking, vertical writing semantics, font fallback, mobile crop at 390x844 and 375x667, drawer panel width, rail width, home H-01..H-05, drawer N-01, feed F-01/F-02, dark mode dimensions, and reduced-motion output.

Evidence:
- reference image paths
- actual screenshot paths
- visual diff JSON outputs and hotspots
- route list
- source files for CSS/components/pages
- Playwright MCP observations

Required verdict: PASS only if no blocking visual/CJK findings remain.
```

Expected:

```text
VERDICT: PASS
BLOCKING: empty
```

If Oracle B returns REVISE or FAIL, implement fixes and restart Task 10 from Step 4.

- [ ] **Step 13: Temporary asset audit**

Development preview audit:

```powershell
Select-String -Path "app\**\*.vue","app\**\*.ts","app\assets\css\main.css" -Pattern "https://deaimon.jp|deaimon.jp|/images/reference/deaimon/" -CaseSensitive:$false
```

Expected development preview result:

```text
No https://deaimon.jp hotlinks
Only intentional /images/reference/deaimon/hero-main.png references are present
ASSET-SOURCES.md documents hero-main.png
```

Production素材 readiness audit after owned replacement assets exist:

- Browse all route-list routes.
- Network request count matching `/images/reference/deaimon/` must be `0`.
- If the count is greater than `0`, report “development preview complete; production素材 not ready.”

- [ ] **Step 14: Cleanup unused old UI components**

Search references:

```powershell
Select-String -Path "app\**\*.vue" -Pattern "LayoutSidebar|LayoutHeader|SectionsHeroSection|SectionsCategoryGrid|SectionsLatestPosts|SectionsAboutSection|UiContentCard|UiTagBadge"
```

Expected:

```text
No references from active pages/layouts
```

If no references remain, remove unused old components:

- `app/components/layout/Header.vue`
- `app/components/layout/Sidebar.vue`
- `app/components/sections/HeroSection.vue`
- `app/components/sections/CategoryGrid.vue`
- `app/components/sections/LatestPosts.vue`
- `app/components/sections/AboutSection.vue`

Keep `UiContentCard.vue` and `UiTagBadge.vue` only if still used by a deliberate page. If removed, run all tests and build again.

- [ ] **Step 15: Final verification after cleanup**

Run:

```powershell
npm run test:unit
npm run test:e2e
npm run build
```

Expected:

```text
unit tests pass
browser tests pass
Nuxt build exits 0
```

## Completion Criteria

Implementation is complete only when all are true:

- H-01 through H-05 are present as real DOM and match the approved homepage intent.
- N-01 drawer is present as real DOM and supports keyboard, focus trap, Escape, overlay close, body lock, and focus restoration.
- F-01 and F-02 use date-desc even/odd feed allocation with no duplicate posts.
- Search still searches blog title, description, category, and tags.
- Search results use localized article links in Japanese routes.
- Theme toggle still uses `.dark`, `localStorage.theme`, and `prefers-color-scheme`.
- Locale switching preserves equivalent current routes.
- `/blog/mysql-basics`, `/blog/ai-thinking`, `/blog/linux-commands`, `/ja/blog/mysql-basics`, `/ja/blog/ai-thinking`, and `/ja/blog/linux-commands` render Content 3 detail pages.
- Missing blog detail returns Nuxt 404.
- All route-list routes render the right rail shell.
- No old left sidebar, old sticky dashboard header, old three-column blog card wall, or emoji structural icons remain on active pages.
- Dark mode preserves layout dimensions and text contrast.
- Reduced motion disables drawer/decor animation durations.
- `npm run test:unit` passes.
- `npm run test:e2e` passes.
- `npm run build` passes.
- Five required viewport screenshots exist.
- Visual diffs are generated for homepage closed, drawer open, and information section.
- Oracle A returns PASS with no blocking findings.
- Oracle B returns PASS with no blocking findings.
- `ASSET-SOURCES.md` documents all temporary assets.
- Development preview has no hotlinks.
- Production素材 readiness is not claimed while `/images/reference/deaimon/` requests remain.

## Execution Notes For Workers

- Start every behavior change with a RED test.
- Do not write broad component code before the relevant test fails for the expected reason.
- Prefer pure TypeScript helpers for logic that can be unit tested: route canonicalization, article sorting, feed split, navigation data.
- Use browser tests for DOM behavior: drawer focus, body lock, responsive widths, localized links, search, theme, dark mode, and route list.
- Keep Vue component files focused. If a new component approaches 250 pure LOC, split by responsibility before adding more behavior.
- Do not add raw hex values outside `app/assets/css/main.css` and Tailwind config token mapping.
- Do not add new runtime dependencies for focus trap or icons; implement the small focus loop locally and use inline SVG.
- Do not commit during execution unless the user explicitly asks.
