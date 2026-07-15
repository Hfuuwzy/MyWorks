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

