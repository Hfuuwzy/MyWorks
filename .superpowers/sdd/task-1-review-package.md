# Task 1 Review Package

Git is unavailable; this package contains current snapshots of every task-scoped text file. package-lock.json was npm-generated and is covered by the install/audit evidence in task-1-report.md.

## package.json
```
{
  "name": "portfolio",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:e2e"
  },
  "dependencies": {
    "@nuxt/content": "^3.15.0",
    "@nuxt/image": "^2.0.0",
    "@nuxtjs/i18n": "^10.4.1",
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@vueuse/nuxt": "^14.3.0",
    "better-sqlite3": "^12.11.1",
    "nuxt": "^4.4.8",
    "vue": "^3.5.39",
    "vue-router": "^5.1.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.61.1",
    "vitest": "^4.1.10"
  }
}

```

## vitest.config.ts
```
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})

```

## playwright.config.ts
```
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

## tests/unit/navigation.test.ts
```
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

## tests/unit/articles.test.ts
```
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

## tests/unit/paths.test.ts
```
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

## tests/e2e/redesign.spec.ts
```
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

## app/data/navigation.ts
```
// Task 1 RED seam: Task 2 replaces these placeholders with real portal navigation data.
export interface PortalNavItem {
  readonly key: string
  readonly labelZh: string
  readonly labelJa: string
  readonly path: string
}

export const portalNavItems: readonly PortalNavItem[] = []
export const portalCategories: readonly PortalNavItem[] = []

```

## app/utils/articles.ts
```
// Task 1 RED seam: Task 2 replaces these placeholders with real article feed behavior.
export interface ArticleSummary {
  readonly path: string
  readonly title: string
  readonly date: string
}

export interface SplitArticleFeed<TPost extends ArticleSummary> {
  readonly primary: readonly TPost[]
  readonly secondary: readonly TPost[]
  readonly combined: readonly TPost[]
}

export function sortArticlesByDateDesc<TPost extends ArticleSummary>(posts: readonly TPost[]): readonly TPost[] {
  return posts
}

export function splitEvenOddFeed<TPost extends ArticleSummary>(_posts: readonly TPost[]): SplitArticleFeed<TPost> {
  return {
    primary: [],
    secondary: [],
    combined: [],
  }
}

```

## app/utils/paths.ts
```
// Task 1 RED seam: Task 2 replaces these placeholders with real locale/path behavior.
export function canonicalContentPathFromRoute(path: string): string {
  return path
}

export function slugFromBlogPath(path: string): string {
  return path
}

```
