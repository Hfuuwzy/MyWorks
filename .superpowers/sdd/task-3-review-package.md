# Task 3 Review Package (Post-Fix)

Git is unavailable; this package contains current post-fix Task 3 snapshots.

## app/layouts/default.vue
```
<template>
  <div data-testid="site-shell" class="site-shell">
    <div class="site-content">
      <main data-testid="site-main" class="site-main">
        <slot />
      </main>

      <LayoutFooter />
    </div>

    <LayoutRightNavDrawer
      :open="navOpen"
      :items="portalNavItems"
      @close="closeNavigation"
    />
    <LayoutRightNavRail
      :open="navOpen"
      @toggle="toggleNavigation"
      @close="closeNavigation"
    />
    <UiScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { portalNavItems } from '~/data/navigation'

const route = useRoute()
const navOpen = ref(false)

function closeNavigation(): void {
  navOpen.value = false
}

function toggleNavigation(): void {
  navOpen.value = !navOpen.value
}

watch(() => route.fullPath, () => {
  navOpen.value = false
})
</script>

<style scoped>
.site-shell {
  min-block-size: 100dvh;
  background: var(--paper);
  color: var(--ink);
}

.site-content {
  min-inline-size: 0;
  padding-inline-end: var(--rail-width);
}

.site-main {
  min-block-size: 70dvh;
}

@media (width < 1024px) {
  .site-content {
    padding-inline-end: var(--rail-width-tablet);
  }
}

@media (width < 768px) {
  .site-content {
    padding-inline-end: var(--rail-width-mobile);
  }
}
</style>

```

## app/components/icons/PaperIcons.vue
```
<template>
  <svg
    class="paper-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-width="1.75"
    :data-testid="testId"
    aria-hidden="true"
  >
    <template v-if="open">
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </template>
    <template v-else>
      <path d="M7 4v16" />
      <path d="M12 4v16" />
      <path d="M17 4v16" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  readonly open: boolean
  readonly testId?: string
}>()
</script>

<style scoped>
.paper-icon {
  display: block;
  inline-size: 24px;
  block-size: 24px;
}
</style>

```

## app/components/layout/RightNavRail.vue
```
<template>
  <aside data-testid="right-nav-rail" class="right-nav-rail" aria-label="Site navigation controls">
    <NuxtLink to="/" data-testid="right-nav-brand" class="rail-brand" aria-label="MyWorks home">
      <span class="rail-brand__name">MyWorks</span>
      <span class="rail-brand__subtitle">和风门户</span>
    </NuxtLink>

    <button
      type="button"
      data-testid="right-nav-menu-button"
      class="rail-menu"
      :aria-label="open ? 'Close navigation' : 'Open navigation'"
      :aria-expanded="open"
      aria-controls="right-nav-drawer"
      @click="handleMenuClick"
    >
      <IconsPaperIcons
        :open="open"
        :test-id="open ? 'right-nav-close-icon' : 'right-nav-menu-icon'"
      />
    </button>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  readonly open: boolean
}

interface Emits {
  toggle: []
  close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleMenuClick(): void {
  if (props.open) {
    emit('close')
    return
  }

  emit('toggle')
}
</script>

<style scoped>
.right-nav-rail {
  position: fixed;
  z-index: 60;
  inset-block: 0;
  inset-inline-end: 0;
  display: flex;
  inline-size: var(--rail-width);
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-block: 32px 24px;
  border-inline-start: 1px solid var(--rule);
  background-color: var(--nav-paper);
  background-image: var(--nav-paper-texture);
  color: var(--ink);
}

.rail-brand {
  display: inline-flex;
  min-inline-size: 44px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  writing-mode: vertical-rl;
}

.rail-brand__name {
  font-family: "Noto Serif JP", "Noto Serif SC", "Songti SC", serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.16em;
}

.rail-brand__subtitle {
  color: var(--ink-soft);
  font-size: 12px;
  letter-spacing: 0.24em;
}

.rail-menu {
  display: grid;
  inline-size: 48px;
  block-size: 48px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.rail-menu:hover {
  border-color: var(--rule);
  background: var(--sakura);
  color: var(--vermilion);
}

.rail-menu:focus-visible,
.rail-brand:focus-visible {
  outline: 3px solid var(--vermilion);
  outline-offset: 3px;
}

@media (width < 1024px) {
  .right-nav-rail {
    inline-size: var(--rail-width-tablet);
  }
}

@media (width < 768px) {
  .right-nav-rail {
    inline-size: var(--rail-width-mobile);
    padding-block: 24px 16px;
  }

  .rail-brand__subtitle {
    display: none;
  }
}

</style>

```

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
const { locale } = useI18n()
const route = useRoute()
const drawerElement = ref<HTMLElement | null>(null)
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
  return drawerElement.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? null
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

  restorePageState()
}, { flush: 'post' })

onBeforeUnmount(() => {
  restorePageState()
})
</script>

<style scoped src="./right-nav-drawer.css"></style>

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
  min-inline-size: 44px;
  min-block-size: 164px;
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
    min-block-size: 136px;
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
})

```
