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
