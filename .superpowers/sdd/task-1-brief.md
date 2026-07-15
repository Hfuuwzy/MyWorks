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

