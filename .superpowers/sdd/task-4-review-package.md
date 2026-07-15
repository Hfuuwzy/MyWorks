# Task 4 Review Package

Git is unavailable; this package contains current Task 4 snapshots.

## app/components/layout/RightNavDrawer.vue
```
<template>
  <Teleport to="body">
    <Transition name="drawer-layer">
      <div v-if="open" class="drawer-layer">
        <button
          type="button"
          data-testid="right-nav-overlay"
          class="drawer-overlay"
          aria-label="Close navigation"
          @click="emit('close')"
        />

        <aside
          id="right-nav-drawer"
          ref="drawerElement"
          data-testid="right-nav-drawer"
          class="right-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          @keydown="trapFocus"
        >
          <div class="drawer-heading">
            <p class="drawer-heading__eyebrow">NAVIGATION</p>
            <p class="drawer-heading__title">目录</p>
          </div>

          <nav data-testid="right-nav-links" class="drawer-nav" aria-label="Primary navigation">
            <NuxtLink
              v-for="item in props.items"
              :key="item.key"
              :to="localePath(item.path)"
              :data-testid="item.testId"
              class="drawer-link"
              :class="{ 'drawer-link--active': isActive(item.path) }"
              :aria-current="isActive(item.path) ? 'page' : undefined"
              @click="emit('close')"
            >
              <span class="drawer-link__stamp" aria-hidden="true" />
              <span class="drawer-link__label">{{ localizedLabel(item) }}</span>
              <span class="drawer-link__english">{{ item.englishLabel }}</span>
            </NuxtLink>
          </nav>

          <section data-testid="drawer-tools" class="drawer-tools" :aria-label="t('drawer.tools')">
            <button
              ref="searchToggleElement"
              type="button"
              data-testid="drawer-search-toggle"
              class="drawer-search-toggle"
              :aria-expanded="searchOpen"
              aria-controls="drawer-search-panel"
              @click="toggleSearch"
            >
              <svg class="drawer-tool-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{{ t('drawer.search') }}</span>
            </button>

            <Transition name="drawer-search-panel">
              <div v-if="searchOpen" id="drawer-search-panel" data-testid="drawer-search-panel" class="drawer-search-panel">
                <UiSearchBar compact input-id="drawer-search" />
              </div>
            </Transition>

            <div class="drawer-tools__row">
              <UiLocaleSwitch />
              <UiThemeToggle />
            </div>
          </section>

          <button
            type="button"
            data-testid="right-nav-close"
            class="drawer-close"
            aria-label="Close navigation"
            @click="emit('close')"
          >
            <IconsPaperIcons :open="true" />
            <span>关闭</span>
          </button>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PortalNavItem } from '~/data/navigation'

interface Props {
  readonly open: boolean
  readonly items: readonly PortalNavItem[]
}

interface Emits {
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localePath = useLocalePath()
const { locale, t } = useI18n()
const route = useRoute()
const drawerElement = ref<HTMLElement | null>(null)
const searchToggleElement = ref<HTMLButtonElement | null>(null)
const searchOpen = ref(false)
const previouslyFocused = ref<HTMLElement | null>(null)
let previousBodyOverflow = ''
let ownsBodyLock = false

function localizedLabel(item: PortalNavItem): string {
  if (locale.value.startsWith('ja')) {
    return item.labelJa
  }

  return item.labelZh
}

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === path
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}

function focusableElements(): NodeListOf<HTMLElement> | null {
  return drawerElement.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])') ?? null
}

async function toggleSearch(): Promise<void> {
  searchOpen.value = !searchOpen.value
  await nextTick()

  if (searchOpen.value) {
    drawerElement.value?.querySelector<HTMLInputElement>('#drawer-search')?.focus()
    return
  }

  searchToggleElement.value?.focus()
}

function trapFocus(event: KeyboardEvent): void {
  if (event.key !== 'Tab') {
    return
  }

  const focusable = focusableElements()
  if (!focusable || focusable.length === 0) {
    return
  }

  const first = focusable.item(0)
  const last = focusable.item(focusable.length - 1)

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
    return
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close')
  }
}

function restorePageState(): void {
  if (!ownsBodyLock) {
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', handleDocumentKeydown)

  if (previouslyFocused.value?.isConnected) {
    previouslyFocused.value.focus()
  }
  previouslyFocused.value = null
  ownsBodyLock = false
}

watch(() => props.open, async (open) => {
  if (open) {
    previouslyFocused.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ownsBodyLock = true
    document.addEventListener('keydown', handleDocumentKeydown)
    await nextTick()
    drawerElement.value?.querySelector<HTMLElement>('a[href]')?.focus()
    return
  }

  searchOpen.value = false
  restorePageState()
}, { flush: 'post' })

onBeforeUnmount(() => {
  restorePageState()
})
</script>

<style scoped src="./right-nav-drawer.css"></style>
<style scoped src="./right-nav-drawer-tools.css"></style>

```

## app/components/layout/right-nav-drawer.css
```
.drawer-layer {
  position: fixed;
  z-index: 50;
  inset: 0;
}

.drawer-overlay {
  position: absolute;
  inset: 0;
  border: 0;
  background: var(--paper);
  cursor: pointer;
  opacity: 0.72;
}

.right-nav-drawer {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  display: flex;
  inline-size: var(--drawer-width);
  flex-direction: column;
  overflow-y: auto;
  padding: 56px calc(var(--rail-width) + 40px) 32px 48px;
  border-inline-start: 1px solid var(--rule);
  background-color: var(--nav-paper);
  background-image: var(--nav-paper-texture);
  color: var(--ink);
}

.drawer-heading {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding-block-end: 32px;
  border-block-end: 1px solid var(--rule);
}

.drawer-heading__eyebrow,
.drawer-heading__title {
  margin: 0;
}

.drawer-heading__eyebrow {
  color: var(--vermilion);
  font-size: 12px;
  letter-spacing: 0.36em;
}

.drawer-heading__title {
  font-family: "Noto Serif SC", "Songti SC", serif;
  font-size: 28px;
}

.drawer-nav {
  display: grid;
  grid-template-columns: repeat(5, minmax(44px, 1fr));
  flex: 1;
  gap: 24px;
  padding-block: 40px 32px;
}

.drawer-link {
  display: flex;
  min-inline-size: 164px;
  min-block-size: 44px;
  align-items: center;
  gap: 8px;
  color: var(--ink-soft);
  text-decoration: none;
  writing-mode: vertical-rl;
  transition: opacity 220ms ease, transform 220ms ease;
}

.drawer-link:hover {
  color: var(--ink);
  transform: translateY(-4px);
}

.drawer-link:focus-visible,
.drawer-close:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 3px;
}

.drawer-link__stamp {
  inline-size: 8px;
  block-size: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--rule);
}

.drawer-link--active {
  color: var(--ink);
  font-weight: 700;
}

.drawer-link--active .drawer-link__stamp {
  background: var(--vermilion);
}

.drawer-link__label {
  font-family: "Noto Serif SC", "Noto Serif JP", "Songti SC", serif;
  font-size: 17px;
  letter-spacing: 0.14em;
}

.drawer-link__english {
  font-size: 10px;
  letter-spacing: 0.22em;
}

.drawer-close {
  display: inline-flex;
  min-block-size: 44px;
  align-self: flex-start;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
}

.drawer-layer-enter-active,
.drawer-layer-leave-active {
  transition: opacity 650ms ease;
}

.drawer-layer-enter-active .right-nav-drawer,
.drawer-layer-leave-active .right-nav-drawer {
  transition: transform 650ms ease, opacity 650ms ease;
}

.drawer-layer-enter-from,
.drawer-layer-leave-to,
.drawer-layer-enter-from .right-nav-drawer,
.drawer-layer-leave-to .right-nav-drawer {
  opacity: 0;
}

.drawer-layer-enter-from .right-nav-drawer,
.drawer-layer-leave-to .right-nav-drawer {
  transform: translateX(30px);
}

@media (width < 1024px) {
  .right-nav-drawer {
    inline-size: 72vw;
    padding-inline: 40px calc(var(--rail-width-tablet) + 32px);
  }
}

@media (width < 768px) {
  .right-nav-drawer {
    inline-size: 100vw;
    padding: 32px calc(var(--rail-width-mobile) + 24px) 24px 24px;
  }

  .drawer-heading {
    padding-block-end: 24px;
  }

  .drawer-nav {
    grid-template-columns: repeat(5, minmax(44px, 1fr));
    gap: 12px;
    padding-block: 32px 24px;
  }

  .drawer-link {
    min-inline-size: 136px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-layer-enter-active,
  .drawer-layer-leave-active,
  .drawer-layer-enter-active .right-nav-drawer,
  .drawer-layer-leave-active .right-nav-drawer,
  .drawer-link {
    transition-duration: 1ms;
  }
}

```

## app/components/layout/right-nav-drawer-tools.css
```
.drawer-tools {
  display: grid;
  gap: 12px;
  padding-block: 24px;
  border-block-start: 1px solid var(--rule);
}

.drawer-search-toggle {
  display: inline-flex;
  min-block-size: 44px;
  align-items: center;
  gap: 8px;
  justify-self: start;
  padding: 8px 12px;
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
}

.drawer-search-toggle:hover {
  background: var(--sakura);
  color: var(--vermilion);
}

.drawer-search-toggle:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 3px;
}

.drawer-tool-icon {
  inline-size: 20px;
  block-size: 20px;
  flex: 0 0 20px;
}

.drawer-search-panel {
  position: relative;
  z-index: 2;
  transform-origin: top center;
}

.drawer-tools__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.drawer-search-panel-enter-active,
.drawer-search-panel-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.drawer-search-panel-enter-from,
.drawer-search-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (width < 768px) {
  .drawer-tools__row {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-search-panel-enter-active,
  .drawer-search-panel-leave-active {
    transition-duration: 1ms;
  }
}

```

## app/components/ui/SearchBar.vue
```
<template>
  <div class="search-bar" :class="{ 'search-bar--compact': props.compact }">
    <input
      :id="props.inputId"
      v-model="searchQuery"
      data-testid="drawer-search-input"
      type="text"
      :placeholder="t('drawer.searchPlaceholder')"
      :aria-label="t('drawer.searchPlaceholder')"
      class="search-bar__input"
      @input="handleSearch"
      @focus="showResults = true"
      @blur="hideResults"
    />
    <svg class="search-bar__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <div
      v-if="showResults && searchResults.length > 0"
      data-testid="search-results"
      class="search-results"
    >
      <NuxtLink
        v-for="result in searchResults"
        :key="result.path"
        :to="result.path"
        :data-testid="`search-result-${result.slug}`"
        class="search-result"
        @mousedown.prevent="handleResultClick"
      >
        <span class="search-result__title">{{ result.title }}</span>
        <span class="search-result__description">{{ result.description }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  readonly compact?: boolean
  readonly inputId?: string
}

interface SearchResult {
  readonly path: string
  readonly slug: string
  readonly title?: string
  readonly description?: string
}

const props = defineProps<Props>()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const showResults = ref(false)

async function handleSearch(): Promise<void> {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const normalizedQuery = searchQuery.value.trim().toLocaleLowerCase()
  const posts = await queryCollection('blog').all()
  const localeRoot = localePath({ path: '/' }, locale.value)

  searchResults.value = posts
    .filter((post) => {
      const searchableText = [
        post.title,
        post.description,
        post.category,
        ...(post.tags ?? []),
      ]
        .filter((value): value is string => typeof value === 'string')
        .join(' ')
        .toLocaleLowerCase()

      return searchableText.includes(normalizedQuery)
    })
    .map(post => ({
      path: localeRoot === '/' ? post.path : `${localeRoot.replace(/\/$/, '')}${post.path}`,
      slug: post.path.split('/').filter(Boolean).at(-1) ?? post.path,
      title: post.title,
      description: post.description,
    }))
}

function hideResults(): void {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

function handleResultClick(): void {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}
</script>

<style scoped>
.search-bar {
  position: relative;
  inline-size: 100%;
}

.search-bar__input {
  inline-size: 100%;
  min-block-size: 48px;
  padding: 12px 16px 12px 44px;
  border: 1px solid var(--rule);
  border-radius: 0;
  background: var(--paper-warm);
  color: var(--ink);
  font: inherit;
}

.search-bar--compact .search-bar__input {
  min-block-size: 44px;
  padding-block: 8px;
}

.search-bar__input::placeholder {
  color: var(--ink-soft);
}

.search-bar__input:focus-visible {
  border-color: var(--vermilion);
  outline: 3px solid var(--vermilion);
  outline-offset: 2px;
}

.search-bar__icon {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-start: 16px;
  inline-size: 20px;
  block-size: 20px;
  color: var(--ink-soft);
  pointer-events: none;
}

.search-results {
  position: absolute;
  z-index: 70;
  inset-block-start: calc(100% + 8px);
  inset-inline: 0;
  max-block-size: 320px;
  overflow-y: auto;
  border: 1px solid var(--rule);
  background-color: var(--nav-paper);
  background-image: var(--nav-paper-texture);
}

.search-result {
  display: grid;
  gap: 4px;
  padding: 12px 16px;
  border-block-end: 1px dotted var(--rule);
  color: var(--ink);
  text-decoration: none;
}

.search-result:last-child {
  border-block-end: 0;
}

.search-result:hover {
  background: var(--sakura);
}

.search-result:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: -3px;
}

.search-result__title {
  font-size: 14px;
  font-weight: 700;
}

.search-result__description {
  overflow: hidden;
  color: var(--ink-soft);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

```

## app/components/ui/ThemeToggle.vue
```
<template>
  <button
    type="button"
    data-testid="theme-toggle"
    class="theme-toggle"
    :title="accessibleName"
    :aria-label="accessibleName"
    @click="toggleTheme"
  >
    <svg v-if="isDark" class="theme-toggle__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <svg v-else class="theme-toggle__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    <span>{{ t('drawer.theme') }}</span>
  </button>
</template>

<script setup lang="ts">
const isDark = ref(false)
const { t } = useI18n()
const accessibleName = computed(() => isDark.value ? 'Switch to light mode' : 'Switch to dark mode')

function toggleTheme(): void {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
    || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  min-block-size: 44px;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font: inherit;
}

.theme-toggle:hover {
  background: var(--sakura);
  color: var(--vermilion);
}

.theme-toggle:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 3px;
}

.theme-toggle__icon {
  inline-size: 20px;
  block-size: 20px;
  flex: 0 0 20px;
}
</style>

```

## app/components/ui/LocaleSwitch.vue
```
<template>
  <div data-testid="locale-switch" class="locale-switch" role="group" :aria-label="t('drawer.language')">
    <NuxtLink
      v-for="link in localeLinks"
      :key="link.key"
      :to="link.path"
      class="locale-switch__link"
      :class="{ 'locale-switch__link--current': locale === link.code }"
      :aria-current="locale === link.code ? 'page' : undefined"
    >
      <span>{{ link.label }}</span>
      <span v-if="locale === link.code" class="locale-switch__current">
        <svg class="locale-switch__check" fill="none" stroke="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 8 3 3 7-7" />
        </svg>
        {{ t('drawer.currentLocale') }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localeOptions = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
] as const

const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const localeLinks = computed(() => localeOptions.map(option => ({
  ...option,
  key: `${route.fullPath}:${option.code}`,
  path: switchLocalePath(option.code),
})))
</script>

<style scoped>
.locale-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.locale-switch__link {
  display: inline-flex;
  min-block-size: 44px;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--rule);
  color: var(--ink-soft);
  text-decoration: none;
}

.locale-switch__link:hover {
  background: var(--sakura);
  color: var(--ink);
}

.locale-switch__link:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 3px;
}

.locale-switch__link--current {
  border-color: var(--vermilion);
  color: var(--ink);
  font-weight: 700;
}

.locale-switch__current {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.08em;
}

.locale-switch__check {
  inline-size: 14px;
  block-size: 14px;
  flex: 0 0 14px;
}
</style>

```

## i18n/locales/zh.json
```
{
  "site": {
    "title": "MyWorks",
    "description": "个人专属门户"
  },
  "nav": {
    "home": "首页",
    "blog": "博客",
    "projects": "开源作品",
    "movies": "电影推荐",
    "anime": "动漫推荐",
    "music": "音乐推荐",
    "tools": "工具资源",
    "life": "生活随笔",
    "notes": "技术笔记",
    "about": "关于我"
  },
  "home": {
    "welcome": "欢迎来到我的个人门户",
    "subtitle": "这里记录了我的技术学习、开源项目、生活感悟和各种推荐内容。希望这些内容能对你有所帮助。",
    "viewAll": "查看全部"
  },
  "drawer": {
    "tools": "站点工具",
    "search": "搜索",
    "searchPlaceholder": "搜索文章...",
    "language": "语言",
    "currentLocale": "当前",
    "theme": "主题"
  },
  "footer": {
    "copyright": "版权所有",
    "builtWith": "使用 Nuxt.js 和 Tailwind CSS 构建"
  }
}

```

## i18n/locales/ja.json
```
{
  "site": {
    "title": "MyWorks",
    "description": "個人ポータルサイト"
  },
  "nav": {
    "home": "ホーム",
    "blog": "ブログ",
    "projects": "オープンソース",
    "movies": "映画のおすすめ",
    "anime": "アニメのおすすめ",
    "music": "音楽のおすすめ",
    "tools": "ツール・リソース",
    "life": "日常エッセイ",
    "notes": "技術ノート",
    "about": "自己紹介"
  },
  "home": {
    "welcome": "私の個人ポータルへようこそ",
    "subtitle": "技術学習、オープンソースプロジェクト、日常の気づき、おすすめコンテンツをまとめています。",
    "viewAll": "すべて見る"
  },
  "drawer": {
    "tools": "サイトツール",
    "search": "検索",
    "searchPlaceholder": "記事を検索...",
    "language": "言語",
    "currentLocale": "現在",
    "theme": "テーマ"
  },
  "footer": {
    "copyright": "著作権所有",
    "builtWith": "Nuxt.js と Tailwind CSS で構築"
  }
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

```
