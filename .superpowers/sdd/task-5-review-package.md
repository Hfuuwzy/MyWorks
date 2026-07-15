# Task 5 Review Package (Post-Fix)

Git is unavailable; current post-fix snapshots. Task 5 integration test intentionally RED until Task 7.

## app/components/content/PaperSectionHeading.vue
```
<template>
  <header class="paper-section-heading">
    <span class="paper-section-heading__stamp">{{ stamp }}</span>
    <div class="paper-section-heading__copy">
      <p class="paper-section-heading__english">{{ english }}</p>
      <h2 class="paper-section-heading__title">{{ title }}</h2>
      <p v-if="description" class="paper-section-heading__description">{{ description }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  readonly stamp: string
  readonly english: string
  readonly title: string
  readonly description?: string
}

defineProps<Props>()
</script>

<style scoped src="./paper-section-heading.css"></style>

```

## app/components/content/paper-section-heading.css
```
.paper-section-heading {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.paper-section-heading__stamp {
  display: inline-grid;
  min-inline-size: 44px;
  min-block-size: 44px;
  place-items: center;
  border: 2px solid var(--vermilion);
  color: var(--vermilion);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
  writing-mode: vertical-rl;
}

.paper-section-heading__copy {
  max-inline-size: 720px;
}

.paper-section-heading__english {
  margin: 0 0 8px;
  color: var(--vermilion);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
}

.paper-section-heading__title {
  margin: 0;
  color: var(--ink);
  font-family: "Noto Serif SC", "Noto Serif JP", "Songti SC", serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 600;
  line-height: 1.3;
}

.paper-section-heading__description {
  max-inline-size: 640px;
  margin: 12px 0 0;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.75;
}

@media (max-width: 767px) {
  .paper-section-heading {
    gap: 16px;
  }
}

```

## app/components/content/ArticleRow.vue
```
<template>
  <article
    class="article-row"
    :class="{ 'article-row--emphasis': emphasis }"
    :data-testid="`article-row-${slug}`"
  >
    <img
      v-if="emphasis && post.cover"
      class="article-row__cover"
      :src="post.cover"
      :alt="post.title ?? ''"
      width="640"
      height="360"
      loading="lazy"
    >
    <div class="article-row__body">
      <div class="article-row__meta">
        <time v-if="displayDate" :datetime="dateTime">{{ displayDate }}</time>
        <span v-if="post.category">{{ post.category }}</span>
      </div>
      <h3 class="article-row__title">
        <NuxtLink class="article-row__link" :to="localizedPath">
          {{ post.title ?? post.path }}
        </NuxtLink>
      </h3>
      <p v-if="post.description" class="article-row__description">{{ post.description }}</p>
      <ul v-if="post.tags?.length" class="article-row__tags" aria-label="Tags">
        <li v-for="tag in post.tags" :key="tag" class="article-row__tag">{{ tag }}</li>
      </ul>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ArticleListItem } from '~/utils/articles'
import { formatDisplayDate } from '~/utils/articles'
import { localizedPathFromCanonical, slugFromBlogPath } from '~/utils/paths'

interface Props {
  readonly post: ArticleListItem
  readonly emphasis?: boolean
}

const props = defineProps<Props>()
const localePath = useLocalePath()
const { locale } = useI18n()
const slug = computed(() => slugFromBlogPath(props.post.path))
const localizedPath = computed(() => localizedPathFromCanonical(props.post.path, localePath))
const displayLocale = computed<'zh' | 'ja'>(() => locale.value.startsWith('ja') ? 'ja' : 'zh')
const displayDate = computed(() => formatDisplayDate(props.post.date, displayLocale.value))
const dateTime = computed(() => {
  if (props.post.date instanceof Date) {
    return props.post.date.toISOString()
  }

  return props.post.date ?? ''
})
</script>

<style scoped src="./article-row.css"></style>

```

## app/components/content/article-row.css
```
.article-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  padding-block: 24px;
  border-block-end: 1px dotted var(--rule);
}

.article-row--emphasis {
  grid-template-columns: minmax(160px, 32%) minmax(0, 1fr);
  gap: 24px;
}

.article-row__cover {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.article-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  color: var(--ink-soft);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.article-row__title {
  margin: 8px 0 0;
  color: var(--ink);
  font-size: clamp(18px, 2vw, 24px);
  line-height: 1.5;
}

.article-row__link {
  display: inline-block;
  color: inherit;
  text-decoration: none;
  transition: transform 180ms ease-out;
}

.article-row__link:hover {
  color: var(--vermilion);
  transform: translateX(4px);
}

.article-row__link:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 4px;
}

.article-row__description {
  max-inline-size: 680px;
  margin: 8px 0 0;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.75;
}

.article-row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.article-row__tag {
  border: 1px solid var(--vermilion);
  padding: 4px 8px;
  color: var(--vermilion);
  font-size: 12px;
  letter-spacing: 0.08em;
}

@media (max-width: 767px) {
  .article-row--emphasis {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .article-row__link {
    transition: none;
  }
}

```

## app/components/content/CategoryLanding.vue
```
<template>
  <section :data-testid="`category-landing-${navKey}`" class="category-landing">
    <ContentPaperSectionHeading
      :stamp="headingStamp"
      :english="navItem.englishLabel"
      :title="localizedTitle"
      :description="localizedDescription"
    />

    <div v-if="articleItems.length === 0" :data-testid="`category-empty-${navKey}`" class="category-landing__empty">
      <DecorPatternDecoration variant="checker" />
      <p>{{ emptyMessage }}</p>
    </div>

    <div
      v-else
      :data-testid="`category-list-${navKey}`"
      class="category-landing__list"
      :class="`category-landing__list--${layout}`"
    >
      <ContentArticleRow
        v-for="item in articleItems"
        :key="item.path"
        :post="item"
        :emphasis="layout === 'feature-list'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PortalRouteKey } from '~/data/navigation'
import { getPortalNavItem } from '~/data/navigation'
import type { ArticleListItem } from '~/utils/articles'

export interface CategoryLandingItem {
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

const props = withDefaults(defineProps<Props>(), {
  layout: 'timeline',
})
const { locale } = useI18n()
const navItem = computed(() => getPortalNavItem(props.navKey))
const localizedTitle = computed(() => locale.value.startsWith('ja') ? navItem.value.labelJa : navItem.value.labelZh)
const localizedDescription = computed(() => locale.value.startsWith('ja') ? navItem.value.descriptionJa : navItem.value.descriptionZh)
const headingStamp = computed(() => localizedTitle.value.slice(0, 2))
const articleItems = computed<readonly ArticleListItem[]>(() => props.items.map(item => ({
  path: item.href,
  title: item.title,
  description: item.description,
  category: item.category,
  tags: item.tags,
  date: item.date,
  cover: item.cover,
})))
</script>

<style scoped src="./category-landing.css"></style>

```

## app/components/content/category-landing.css
```
.category-landing {
  position: relative;
  display: grid;
  gap: 48px;
}

.category-landing__list {
  max-inline-size: 960px;
}

.category-landing__list--feature-list {
  max-inline-size: 1120px;
}

.category-landing__empty {
  position: relative;
  min-block-size: 240px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-block: 1px dotted var(--rule);
  color: var(--ink-soft);
  text-align: center;
}

.category-landing__empty > p {
  position: relative;
  margin: 0;
  padding: 24px;
  font-size: 16px;
  line-height: 1.75;
}

@media (max-width: 767px) {
  .category-landing {
    gap: 32px;
  }
}

```

## app/components/content/ArticleProse.vue
```
<template>
  <article class="article-prose">
    <ContentRenderer :value="value" />
  </article>
</template>

<script setup lang="ts">
import type { PageCollectionItemBase } from '@nuxt/content'

interface Props {
  readonly value: PageCollectionItemBase
}

defineProps<Props>()
</script>

<style scoped src="./article-prose.css"></style>

```

## app/components/content/article-prose.css
```
.article-prose {
  max-inline-size: 760px;
  color: var(--ink);
  font-family: "Noto Serif SC", "Noto Serif JP", "Songti SC", serif;
  font-size: 17px;
  line-height: 1.8;
}

.article-prose :deep(h2),
.article-prose :deep(h3),
.article-prose :deep(h4) {
  color: var(--ink);
  font-weight: 600;
  line-height: 1.4;
  text-wrap: balance;
}

.article-prose :deep(h2) {
  margin: 56px 0 20px;
  padding-block-end: 12px;
  border-block-end: 1px dotted var(--rule);
  font-size: 32px;
}

.article-prose :deep(h3) {
  margin: 40px 0 16px;
  font-size: 24px;
}

.article-prose :deep(h4) {
  margin: 32px 0 12px;
  font-size: 20px;
}

.article-prose :deep(p) {
  margin: 0 0 24px;
}

.article-prose :deep(a) {
  color: var(--vermilion);
  text-decoration-color: var(--rule);
  text-underline-offset: 4px;
}

.article-prose :deep(a:focus-visible) {
  outline: 3px solid var(--vermilion);
  outline-offset: 4px;
}

.article-prose :deep(blockquote) {
  margin: 32px 0;
  padding: 16px 24px;
  border-inline-start: 4px solid var(--vermilion);
  background: var(--paper-warm);
  color: var(--ink-soft);
}

.article-prose :deep(code) {
  padding: 2px 4px;
  background: var(--paper-warm);
  color: var(--ink);
  font-size: 0.9em;
}

.article-prose :deep(pre) {
  max-inline-size: 100%;
  margin: 32px 0;
  overflow-x: auto;
  border: 1px solid var(--rule);
  background: var(--paper-warm);
  padding: 20px;
}

.article-prose :deep(pre code) {
  padding: 0;
  background: transparent;
}

.article-prose :deep(img) {
  display: block;
  inline-size: min(100%, 720px);
  block-size: auto;
  margin: 32px auto;
}

.article-prose :deep(table) {
  inline-size: 100%;
  margin: 32px 0;
  border-collapse: collapse;
  font-size: 15px;
}

.article-prose :deep(th),
.article-prose :deep(td) {
  border: 1px solid var(--rule);
  padding: 12px 16px;
  text-align: start;
}

.article-prose :deep(th) {
  background: var(--paper-warm);
}

@media (max-width: 767px) {
  .article-prose {
    font-size: 16px;
    line-height: 1.75;
  }

  .article-prose :deep(table) {
    display: block;
    overflow-x: auto;
  }
}

```

## app/components/sections/ChronologicalFeed.vue
```
<template>
  <section data-testid="information-feed" class="chronological-feed">
    <h2 v-if="title" class="chronological-feed__title">{{ title }}</h2>

    <template v-if="variant === 'home'">
      <div class="chronological-feed__desktop">
        <div data-testid="feed-column-primary">
          <ContentArticleRow v-for="post in feed.primary" :key="post.path" :post="post" />
        </div>
        <div data-testid="feed-column-secondary">
          <ContentArticleRow v-for="post in feed.secondary" :key="post.path" :post="post" />
        </div>
      </div>
      <div data-testid="feed-single-column" class="chronological-feed__mobile">
        <ContentArticleRow v-for="post in feed.combined" :key="post.path" :post="post" />
      </div>
    </template>

    <div v-else data-testid="feed-single-column" class="chronological-feed__single">
      <ContentArticleRow v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ArticleListItem } from '~/utils/articles'
import { splitEvenOddFeed } from '~/utils/articles'

interface Props {
  readonly posts: readonly ArticleListItem[]
  readonly variant: 'home' | 'single'
  readonly title?: string
}

const props = defineProps<Props>()
const feed = computed(() => splitEvenOddFeed(props.posts))
</script>

<style scoped src="./chronological-feed.css"></style>

```

## app/components/sections/chronological-feed.css
```
.chronological-feed {
  inline-size: 100%;
  overflow-x: clip;
}

.chronological-feed__title {
  margin: 0 0 24px;
  color: var(--ink);
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1.4;
}

.chronological-feed__desktop {
  display: grid;
  grid-template-columns: minmax(0, 58fr) minmax(0, 42fr);
  gap: 48px;
}

.chronological-feed__mobile {
  display: none;
}

.chronological-feed__single {
  max-inline-size: 880px;
}

@media (max-width: 767px) {
  .chronological-feed__desktop {
    display: none;
  }

  .chronological-feed__mobile {
    display: block;
  }
}

```

## app/components/sections/VerticalCategoryNav.vue
```
<template>
  <nav class="vertical-category-nav" :class="`vertical-category-nav--${density}`" aria-label="Content categories">
    <NuxtLink
      v-for="category in categories"
      :key="category.key"
      :to="localePath(category.path)"
      class="vertical-category-nav__link"
    >
      <span class="vertical-category-nav__label">{{ localizedLabel(category) }}</span>
      <span class="vertical-category-nav__english">{{ category.englishLabel }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { PortalCategory } from '~/data/navigation'

interface Props {
  readonly categories: readonly PortalCategory[]
  readonly density?: 'hero' | 'drawer'
}

withDefaults(defineProps<Props>(), {
  density: 'hero',
})

const localePath = useLocalePath()
const { locale } = useI18n()

function localizedLabel(category: PortalCategory): string {
  return locale.value.startsWith('ja') ? category.labelJa : category.labelZh
}
</script>

<style scoped src="./vertical-category-nav.css"></style>

```

## app/components/sections/vertical-category-nav.css
```
.vertical-category-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}

.vertical-category-nav__link {
  display: flex;
  min-inline-size: 44px;
  min-block-size: 44px;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-inline-start: 1px solid var(--rule);
  color: var(--ink);
  text-decoration: none;
  writing-mode: vertical-rl;
  transition: transform 180ms ease-out;
}

.vertical-category-nav__link:hover {
  color: var(--vermilion);
  transform: translateY(-4px);
}

.vertical-category-nav__link:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 4px;
}

.vertical-category-nav__label {
  font-size: 16px;
  letter-spacing: 0.12em;
}

.vertical-category-nav__english {
  color: var(--ink-soft);
  font-size: 10px;
  letter-spacing: 0.2em;
}

.vertical-category-nav--drawer {
  gap: 8px;
}

.vertical-category-nav--drawer .vertical-category-nav__link {
  padding-block: 8px;
}

@media (prefers-reduced-motion: reduce) {
  .vertical-category-nav__link {
    transition: none;
  }
}

```

## app/components/decor/PatternDecoration.vue
```
<template>
  <span class="pattern-decoration" :class="`pattern-decoration--${variant}`" aria-hidden="true">
    <span class="pattern-decoration__layer pattern-decoration__layer--one" />
    <span class="pattern-decoration__layer pattern-decoration__layer--two" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  readonly variant?: 'asanoha' | 'checker' | 'wash'
}

withDefaults(defineProps<Props>(), {
  variant: 'asanoha',
})
</script>

<style scoped src="./pattern-decoration.css"></style>

```

## app/components/decor/pattern-decoration.css
```
.pattern-decoration,
.pattern-decoration__layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.pattern-decoration {
  overflow: hidden;
  opacity: 0.72;
}

.pattern-decoration__layer--one {
  background-image:
    linear-gradient(30deg, var(--sakura) 12%, transparent 12.5%, transparent 87%, var(--sakura) 87.5%),
    linear-gradient(150deg, var(--sakura) 12%, transparent 12.5%, transparent 87%, var(--sakura) 87.5%);
  background-size: 48px 80px;
}

.pattern-decoration__layer--two {
  background: radial-gradient(circle at 75% 25%, var(--wagashi), transparent 40%);
  opacity: 0.48;
}

.pattern-decoration--checker .pattern-decoration__layer--one {
  background-image:
    linear-gradient(45deg, var(--matcha) 25%, transparent 25%),
    linear-gradient(-45deg, var(--matcha) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--wagashi) 75%),
    linear-gradient(-45deg, transparent 75%, var(--wagashi) 75%);
  background-position: 0 0, 0 24px, 24px -24px, -24px 0;
  background-size: 48px 48px;
}

.pattern-decoration--wash .pattern-decoration__layer--one {
  background:
    radial-gradient(circle at 20% 35%, var(--sakura), transparent 36%),
    radial-gradient(circle at 80% 70%, var(--matcha), transparent 40%);
}

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

  test('exposes the approved rail and drawer IDs at responsive rail widths', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const rail = page.getByTestId('right-nav-rail')
    const menuButton = page.getByTestId('right-nav-menu-button')
    await expect(page.getByTestId('right-nav-brand')).toBeVisible()
    await expect(page.getByTestId('right-nav-menu-icon')).toHaveCount(1)
    await expect(page.getByTestId('right-nav-close-icon')).toHaveCount(0)
    await expect(rail).toHaveCSS('width', '80px')

    await menuButton.click()
    await expect(page.getByTestId('right-nav-menu-icon')).toHaveCount(0)
    await expect(page.getByTestId('right-nav-close-icon')).toHaveCount(1)
    await expect(page.getByTestId('right-nav-links')).toBeVisible()
    await expect(page.getByTestId('right-nav-close')).toBeVisible()

    await page.setViewportSize({ width: 900, height: 800 })
    await expect(rail).toHaveCSS('width', '64px')
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(rail).toHaveCSS('width', '56px')
  })

  test('traps focus and restores page state after Escape, close, and route navigation', async ({ page }) => {
    await page.goto('/')

    const menuButton = page.getByTestId('right-nav-menu-button')
    const firstLink = page.getByTestId('nav-link-home')
    const closeButton = page.getByTestId('right-nav-close')

    await menuButton.click()
    await expect(firstLink).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(closeButton).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(firstLink).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(menuButton).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

    await menuButton.click()
    await closeButton.click()
    await expect(menuButton).toBeFocused()

    await menuButton.click()
    await page.getByTestId('nav-link-blog').click()
    await expect(page).toHaveURL(/\/blog$/)
    await expect(page.getByTestId('right-nav-drawer')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
    await expect(menuButton).toBeFocused()
  })

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

  test('search finds existing posts and links through the current locale', async ({ page }) => {
    await page.goto('/ja')
    await page.getByTestId('right-nav-menu-button').click()
    await page.getByTestId('drawer-search-toggle').click()
    await page.getByTestId('drawer-search-input').fill('Linux')

    await expect(page.getByTestId('search-result-linux-commands')).toBeVisible()
    await expect(page.getByTestId('search-result-linux-commands')).toHaveAttribute('href', '/ja/blog/linux-commands')
  })

  test('theme toggle preserves the existing dark-mode behavior', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('right-nav-menu-button').click()
    await page.getByTestId('theme-toggle').click()

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.evaluate(() => window.localStorage.getItem('theme'))).resolves.toBe('dark')
  })
})

test('blog index uses chronological rows instead of the old card grid wall', async ({ page }) => {
  await page.goto('/blog')

  await expect(page.getByTestId('category-landing-blog')).toBeVisible()
  await expect(page.getByTestId('article-row-linux-commands')).toBeVisible()
  await expect(page.locator('.card')).toHaveCount(0)
  await expect(page.locator('.grid.lg\\:grid-cols-3')).toHaveCount(0)
})

```
