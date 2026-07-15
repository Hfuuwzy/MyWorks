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

