<template>
  <aside data-testid="right-nav-rail" class="right-nav-rail" aria-label="Site navigation controls">
    <NuxtLink :to="localePath('/')" data-testid="right-nav-brand" class="rail-brand" aria-label="MyWorks home">
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
const localePath = useLocalePath()

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
