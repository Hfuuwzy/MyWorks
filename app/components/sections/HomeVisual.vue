<template>
  <section id="home-visual" data-testid="home-visual" class="home-visual" aria-labelledby="home-brand">
    <img
      id="hero-main-image"
      data-testid="hero-main-image"
      class="home-visual__image"
      src="/images/reference/deaimon/hero-main.png"
      alt="Temporary watercolor-style storefront artwork for the MyWorks homepage"
      width="1920"
      height="2566"
      loading="eager"
      fetchpriority="high"
    >
    <div class="home-visual__mist" aria-hidden="true" />

    <div class="home-visual__content">
      <header class="home-visual__brand-block">
        <h1 id="home-brand" data-testid="home-brand" class="home-visual__brand">MyWorks</h1>
        <p id="home-brand-subtitle" data-testid="home-brand-subtitle" class="home-visual__subtitle">
          个人创作与学习记录
        </p>
      </header>

      <NuxtLink
        v-if="latestPost"
        id="home-latest-update"
        data-testid="home-latest-update"
        class="home-visual__latest"
        :to="localePath(latestPost.path)"
        :prefetch="false"
      >
        <span class="home-visual__latest-label">最近更新</span>
        <span>{{ latestPost.title ?? latestPost.path }}</span>
      </NuxtLink>

      <div id="home-category-nav" data-testid="home-category-nav" class="home-visual__categories">
        <SectionsVerticalCategoryNav :categories="categories" density="hero" />
      </div>

      <aside id="home-media-slot" data-testid="home-media-slot" class="home-visual__media" aria-label="Featured media">
        <span class="home-visual__media-kicker">MEDIA</span>
        <p>影像与声音记录，待作品整理后在此呈现。</p>
      </aside>
    </div>

    <a id="home-scroll-cue" data-testid="home-scroll-cue" class="home-visual__scroll" href="#information">
      <span>向下阅读</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </a>
  </section>
</template>

<script setup lang="ts">
import type { PortalCategory } from '~/data/navigation'
import type { ArticleListItem } from '~/utils/articles'

interface Props {
  readonly latestPost?: ArticleListItem
  readonly categories: readonly PortalCategory[]
}

defineProps<Props>()
const localePath = useLocalePath()
</script>

<style scoped src="./home-visual.css"></style>
