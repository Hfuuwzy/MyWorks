# Task 2 Review Package (Post-Fix)

Git is unavailable; this package contains current post-fix snapshots. Binary asset evidence is in task-2-report.md.

## app/data/navigation.ts
```
export type PortalRouteKey =
  | 'home'
  | 'blog'
  | 'projects'
  | 'movies'
  | 'anime'
  | 'music'
  | 'tools'
  | 'life'
  | 'notes'
  | 'about'

export interface PortalNavItem {
  readonly key: PortalRouteKey
  readonly path: string
  readonly labelZh: string
  readonly labelJa: string
  readonly englishLabel: string
  readonly descriptionZh: string
  readonly descriptionJa: string
  readonly testId: string
  readonly appearsOnHome: boolean
}

export interface PortalCategory extends PortalNavItem {
  readonly appearsOnHome: true
}

const portalNavItemsByKey = {
  home: { key: 'home', path: '/', labelZh: '首页', labelJa: 'ホーム', englishLabel: 'HOME', descriptionZh: '返回门户首页', descriptionJa: 'ポータルのホームへ', testId: 'nav-link-home', appearsOnHome: false },
  blog: { key: 'blog', path: '/blog', labelZh: '博客文章', labelJa: 'ブログ', englishLabel: 'BLOG', descriptionZh: '技术文章与学习记录', descriptionJa: '技術記事と学習記録', testId: 'nav-link-blog', appearsOnHome: true },
  projects: { key: 'projects', path: '/projects', labelZh: '开源作品', labelJa: 'オープンソース', englishLabel: 'PROJECTS', descriptionZh: '开源项目与实验作品', descriptionJa: 'オープンソースと実験作品', testId: 'nav-link-projects', appearsOnHome: true },
  movies: { key: 'movies', path: '/movies', labelZh: '电影推荐', labelJa: '映画のおすすめ', englishLabel: 'MOVIES', descriptionZh: '喜欢的电影与剧集', descriptionJa: '好きな映画とドラマ', testId: 'nav-link-movies', appearsOnHome: true },
  anime: { key: 'anime', path: '/anime', labelZh: '动漫推荐', labelJa: 'アニメのおすすめ', englishLabel: 'ANIME', descriptionZh: '新番与经典动画', descriptionJa: '新作と名作アニメ', testId: 'nav-link-anime', appearsOnHome: true },
  music: { key: 'music', path: '/music', labelZh: '音乐推荐', labelJa: '音楽のおすすめ', englishLabel: 'MUSIC', descriptionZh: '音乐与歌单记录', descriptionJa: '音楽とプレイリスト', testId: 'nav-link-music', appearsOnHome: true },
  tools: { key: 'tools', path: '/tools', labelZh: '工具资源', labelJa: 'ツール・リソース', englishLabel: 'TOOLS', descriptionZh: '开发工具和学习资源', descriptionJa: '開発ツールと学習リソース', testId: 'nav-link-tools', appearsOnHome: true },
  life: { key: 'life', path: '/life', labelZh: '生活随笔', labelJa: '日常エッセイ', englishLabel: 'LIFE', descriptionZh: '日常生活与想法', descriptionJa: '日常生活と思考', testId: 'nav-link-life', appearsOnHome: true },
  notes: { key: 'notes', path: '/notes', labelZh: '技术笔记', labelJa: '技術ノート', englishLabel: 'NOTES', descriptionZh: '技术笔记和教程', descriptionJa: '技術ノートとチュートリアル', testId: 'nav-link-notes', appearsOnHome: true },
  about: { key: 'about', path: '/about', labelZh: '关于我', labelJa: '自己紹介', englishLabel: 'ABOUT', descriptionZh: '个人简介与经历', descriptionJa: 'プロフィールと経歴', testId: 'nav-link-about', appearsOnHome: false },
} as const satisfies Readonly<Record<PortalRouteKey, PortalNavItem>>

export const portalNavItems: readonly PortalNavItem[] = [
  portalNavItemsByKey.home,
  portalNavItemsByKey.blog,
  portalNavItemsByKey.projects,
  portalNavItemsByKey.movies,
  portalNavItemsByKey.anime,
  portalNavItemsByKey.music,
  portalNavItemsByKey.tools,
  portalNavItemsByKey.life,
  portalNavItemsByKey.notes,
  portalNavItemsByKey.about,
]

export const portalCategories: readonly PortalCategory[] = [
  portalNavItemsByKey.blog,
  portalNavItemsByKey.projects,
  portalNavItemsByKey.movies,
  portalNavItemsByKey.anime,
  portalNavItemsByKey.music,
  portalNavItemsByKey.tools,
  portalNavItemsByKey.life,
  portalNavItemsByKey.notes,
]

export function getPortalNavItem(key: PortalRouteKey): PortalNavItem {
  return portalNavItemsByKey[key]
}

```

## app/utils/articles.ts
```
export interface ArticleListItem {
  readonly path: string
  readonly title?: string
  readonly description?: string
  readonly date?: string | Date
  readonly category?: string
  readonly tags?: readonly string[]
  readonly cover?: string
}

export interface SplitFeed<T> {
  readonly primary: readonly T[]
  readonly secondary: readonly T[]
  readonly combined: readonly T[]
}

const articleDateLocales = {
  zh: 'zh-CN',
  ja: 'ja-JP',
} as const satisfies Readonly<Record<'zh' | 'ja', string>>

export function getArticleTimestamp(date: string | Date | undefined): number {
  if (date === undefined) {
    return Number.NEGATIVE_INFINITY
  }

  const timestamp = date instanceof Date ? date.getTime() : Date.parse(date)
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

export function sortArticlesByDateDesc<T extends ArticleListItem>(items: readonly T[]): readonly T[] {
  return [...items].sort((left, right) => getArticleTimestamp(right.date) - getArticleTimestamp(left.date))
}

export function splitEvenOddFeed<T extends ArticleListItem>(items: readonly T[]): SplitFeed<T> {
  const primary: T[] = []
  const secondary: T[] = []

  items.forEach((item, index) => {
    if (index % 2 === 0) {
      primary.push(item)
      return
    }

    secondary.push(item)
  })

  return {
    primary,
    secondary,
    combined: [...items],
  }
}

export function formatDisplayDate(date: string | Date | undefined, locale: 'zh' | 'ja'): string {
  const timestamp = getArticleTimestamp(date)
  if (timestamp === Number.NEGATIVE_INFINITY) {
    return ''
  }

  return new Intl.DateTimeFormat(articleDateLocales[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(timestamp)
}

```

## app/utils/paths.ts
```
export const DEFAULT_LOCALE = 'zh'
export const JA_PREFIX = '/ja'

export function canonicalContentPathFromRoute(routePath: string): string {
  const canonicalPath = routePath.replace(/^\/ja(?=\/|$)/, '')
  return canonicalPath === '' ? '/' : canonicalPath
}

export function slugFromBlogPath(path: string): string {
  const segments = canonicalContentPathFromRoute(path).split('/').filter(Boolean)
  return segments.at(-1) ?? ''
}

export function localizedPathFromCanonical(canonicalPath: string, localePath: (path: string) => string): string {
  return localePath(canonicalPath)
}

```

## tests/unit/navigation.test.ts
```
import { describe, expect, it } from 'vitest'
import { getPortalNavItem, portalCategories, portalNavItems } from '../../app/data/navigation'

const navigationModule = await import('../../app/data/navigation')

describe('portal navigation data', () => {
  it('exposes only the planned runtime navigation API', () => {
    expect(Object.keys(navigationModule).sort()).toEqual([
      'getPortalNavItem',
      'portalCategories',
      'portalNavItems',
    ])
  })

  it('uses the planned runtime property names', () => {
    const expectedKeys = [
      'appearsOnHome',
      'descriptionJa',
      'descriptionZh',
      'englishLabel',
      'key',
      'labelJa',
      'labelZh',
      'path',
      'testId',
    ]

    for (const item of portalNavItems) {
      expect(Object.keys(item).sort()).toEqual(expectedKeys)
    }
  })

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

  it('returns the exact item for every planned route key', () => {
    for (const item of portalNavItems) {
      expect(getPortalNavItem(item.key)).toBe(item)
    }
  })
})

```

## tests/unit/articles.test.ts
```
import { describe, expect, it } from 'vitest'
import {
  formatDisplayDate,
  getArticleTimestamp,
  sortArticlesByDateDesc,
  splitEvenOddFeed,
} from '../../app/utils/articles'

const articlesModule = await import('../../app/utils/articles')

const posts = [
  { path: '/blog/mysql-basics', title: 'MySQL', date: '2023-04-20' },
  { path: '/blog/linux-commands', title: 'Linux', date: '2023-06-10' },
  { path: '/blog/ai-thinking', title: 'AI', date: '2023-05-15' },
] as const

describe('article feed helpers', () => {
  it('exposes only the planned runtime article API', () => {
    expect(Object.keys(articlesModule).sort()).toEqual([
      'formatDisplayDate',
      'getArticleTimestamp',
      'sortArticlesByDateDesc',
      'splitEvenOddFeed',
    ])
  })

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

  it('supports Date timestamps and maps missing or invalid dates to negative infinity', () => {
    const date = new Date('2023-06-10T00:00:00.000Z')

    expect(getArticleTimestamp(date)).toBe(date.getTime())
    expect(getArticleTimestamp(undefined)).toBe(Number.NEGATIVE_INFINITY)
    expect(getArticleTimestamp('not-a-date')).toBe(Number.NEGATIVE_INFINITY)
  })

  it('sorts Date values and leaves missing or invalid dates last without mutation', () => {
    const mixedPosts = [
      { path: '/missing' },
      { path: '/date-object', date: new Date('2024-02-01T00:00:00.000Z') },
      { path: '/invalid', date: 'not-a-date' },
      { path: '/date-string', date: '2024-03-01' },
    ] as const

    const sorted = sortArticlesByDateDesc(mixedPosts)

    expect(sorted.map(post => post.path)).toEqual([
      '/date-string',
      '/date-object',
      '/missing',
      '/invalid',
    ])
    expect(mixedPosts.map(post => post.path)).toEqual([
      '/missing',
      '/date-object',
      '/invalid',
      '/date-string',
    ])
  })

  it('formats string and Date inputs by locale and returns empty text for missing or invalid dates', () => {
    const date = new Date('2023-06-10T00:00:00.000Z')

    expect(formatDisplayDate('2023-06-10', 'zh')).toBe('2023年6月10日')
    expect(formatDisplayDate(date, 'ja')).toBe('2023年6月10日')
    expect(formatDisplayDate(undefined, 'zh')).toBe('')
    expect(formatDisplayDate('not-a-date', 'ja')).toBe('')
  })
})

```

## tests/unit/paths.test.ts
```
import { describe, expect, it } from 'vitest'
import {
  canonicalContentPathFromRoute,
  DEFAULT_LOCALE,
  JA_PREFIX,
  localizedPathFromCanonical,
  slugFromBlogPath,
} from '../../app/utils/paths'

const pathsModule = await import('../../app/utils/paths')

describe('locale-aware canonical content paths', () => {
  it('exposes only the planned runtime path API', () => {
    expect(Object.keys(pathsModule).sort()).toEqual([
      'DEFAULT_LOCALE',
      'JA_PREFIX',
      'canonicalContentPathFromRoute',
      'localizedPathFromCanonical',
      'slugFromBlogPath',
    ])
  })

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

  it('exposes the planned locale constants', () => {
    expect(DEFAULT_LOCALE).toBe('zh')
    expect(JA_PREFIX).toBe('/ja')
  })

  it('delegates a canonical path to the supplied locale callback', () => {
    const receivedPaths: string[] = []
    const localePath = (path: string): string => {
      receivedPaths.push(path)
      return `/ja${path}`
    }

    expect(localizedPathFromCanonical('/blog/mysql-basics', localePath)).toBe('/ja/blog/mysql-basics')
    expect(receivedPaths).toEqual(['/blog/mysql-basics'])
  })
})

```

## app/assets/css/main.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --paper: #f8f5ed;
  --paper-warm: #fffaf0;
  --ink: #2a0c00;
  --ink-soft: #6f5748;
  --vermilion: #e85845;
  --sakura: #efcbd5;
  --matcha: #dce8c8;
  --wagashi: #ead8ad;
  --rule: rgba(42, 12, 0, 0.34);
  --nav-paper: rgba(250, 248, 242, 0.97);
  --rail-width: 80px;
  --rail-width-tablet: 64px;
  --rail-width-mobile: 56px;
  --drawer-width: clamp(560px, 48vw, 760px);
  --paper-texture: url('/images/reference/deaimon/paper-body.jpg');
  --section-paper-texture: url('/images/reference/deaimon/paper-section.jpg');
  --nav-paper-texture: url('/images/reference/deaimon/paper-nav.jpg');
  --petal-01: url('/images/reference/deaimon/petal-01.png');
  --petal-03: url('/images/reference/deaimon/petal-03.png');
  --petal-07: url('/images/reference/deaimon/petal-07.png');
  --color-bg: var(--paper);
  --color-surface: var(--paper-warm);
  --color-text: var(--ink);
  --color-text-secondary: var(--ink-soft);
  --color-border: var(--rule);
}

.dark {
  --paper: #171b22;
  --paper-warm: #20232b;
  --ink: #f2eadb;
  --ink-soft: #c6b9a8;
  --vermilion: #ef7867;
  --sakura: #5d404b;
  --matcha: #3f4c3c;
  --wagashi: #564b35;
  --rule: rgba(242, 234, 219, 0.34);
  --nav-paper: rgba(23, 27, 34, 0.97);
  --color-bg: var(--paper);
  --color-surface: var(--paper-warm);
  --color-text: var(--ink);
  --color-text-secondary: var(--ink-soft);
  --color-border: var(--rule);
}

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-bg text-text font-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  ::selection {
    background-color: var(--sakura);
    color: var(--vermilion);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

```

## tailwind.config.ts
```
import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--vermilion)',
        },
        surface: 'var(--color-surface)',
        bg: 'var(--color-bg)',
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
        },
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        serif: ['Noto Serif SC', 'Noto Serif JP', 'Songti SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

```

## nuxt.config.ts
```
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: 3000,
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  app: {
    head: {
      title: 'MyWorks - 个人专属门户',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'description', content: '个人专属门户网站，展示博客、开源作品、推荐内容等' },
        { name: 'theme-color', content: '#f8f5ed' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Serif+JP:wght@400;600;700;900&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  content: {
    highlight: {
      theme: 'github-dark',
    },
  },

  i18n: {
    locales: [
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
  },

  image: {},

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { swr: 3600 },
    '/projects/**': { swr: 3600 },
  },
})

```

## public/images/reference/deaimon/ASSET-SOURCES.md
```
# Temporary Asset Sources

These assets are development-preview placeholders for the MyWorks redesign. They are not production-ready ownership-cleared assets.

| File | Source | Page Use | Replacement Status |
|---|---|---|---|
| `hero-main.png` | `reference/images/文章底片.png` in this repository | Homepage H-01 through H-05 temporary hero artwork | Replace before production素材 readiness |
| `cover-mysql.jpg` | `https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000097.jpg?1661764396` | Temporary MySQL article cover | Replace before production素材 readiness |
| `cover-ai.jpg` | `https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000096.jpg?1661764396` | Temporary AI article cover | Replace before production素材 readiness |
| `cover-linux.jpg` | `https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000127.jpg?1661764396` | Temporary Linux article cover | Replace before production素材 readiness |
| `paper-body.jpg` | `https://deaimon.jp/core_sys/images/main/tz/paper2.jpg` | Global paper texture | Replace or recreate before production素材 readiness |
| `paper-section.jpg` | `https://deaimon.jp/core_sys/images/main/tz/paper1.jpg` | Information section texture | Replace or recreate before production素材 readiness |
| `paper-nav.jpg` | `https://deaimon.jp/core_sys/images/main/tz/nav/navi_bg.jpg` | Right rail and drawer texture | Replace or recreate before production素材 readiness |
| `petal-01.png` | `https://deaimon.jp/core_sys/images/main/sakura/petal01.png` | Decorative petal | Replace or recreate before production素材 readiness |
| `petal-03.png` | `https://deaimon.jp/core_sys/images/main/sakura/petal03.png` | Decorative petal | Replace or recreate before production素材 readiness |
| `petal-07.png` | `https://deaimon.jp/core_sys/images/main/sakura/petal07.png` | Decorative petal | Replace or recreate before production素材 readiness |

## Rules

- Do not hotlink source-site assets.
- Do not copy deaimon logo, branded copy, character names, or proprietary social icons.
- Development preview may reference files in this directory.
- Production素材 readiness requires browsing all routes with zero network requests to `/images/reference/deaimon/`, including `hero-main.png`.

```

## content/blog/mysql-basics.md
```
---
title: MySQL基础教程
description: 本文介绍了MySQL的基础知识，包括数据库操作、表操作、查询语句等。
date: 2023-04-20
category: 技术
tags: [MySQL, 数据库]
cover: /images/reference/deaimon/cover-mysql.jpg
---

# MySQL基础教程

本文介绍了MySQL的基础知识，包括数据库操作、表操作、查询语句等。

## 数据库操作

```sql
-- 创建数据库
CREATE DATABASE mydb;

-- 使用数据库
USE mydb;

-- 删除数据库
DROP DATABASE mydb;
```

## 表操作

```sql
-- 创建表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (name, email) VALUES ('张三', 'zhangsan@example.com');

-- 查询数据
SELECT * FROM users WHERE name = '张三';
```

## 总结

MySQL是一个功能强大的关系型数据库，掌握这些基础操作是学习其他高级特性的前提。

```

## content/blog/ai-thinking.md
```
---
title: 关于AI的思考
description: 人工智能正在改变我们的生活方式，本文分享了我对AI的一些思考。
date: 2023-05-15
category: AI
tags: [LLMs, AI]
cover: /images/reference/deaimon/cover-ai.jpg
---

# 关于AI的思考

人工智能正在改变我们的生活方式，本文分享了我对AI的一些思考。

## AI的发展趋势

近年来，大语言模型（LLM）取得了巨大突破：

- **GPT系列**：从GPT-3到GPT-4，能力不断提升
- **开源模型**：Llama、Mistral等开源模型快速发展
- **多模态**：图像、语音、视频理解能力增强

## AI的应用场景

1. **编程辅助**：代码生成、调试、重构
2. **内容创作**：写作、翻译、总结
3. **数据分析**：数据处理、可视化、洞察

## 未来展望

AI将继续深入我们的工作和生活，关键是要学会如何与AI协作，而不是被AI替代。

```

## content/blog/linux-commands.md
```
---
title: Linux常用命令
description: 整理了Linux系统中常用的命令，方便日常开发使用。
date: 2023-06-10
category: Linux
tags: [Linux, 命令行]
cover: /images/reference/deaimon/cover-linux.jpg
---

# Linux常用命令

整理了Linux系统中常用的命令，方便日常开发使用。

## 文件操作

```bash
# 查看文件
ls -la

# 创建目录
mkdir -p /path/to/dir

# 复制文件
cp -r source/ destination/

# 移动/重命名
mv oldname newname
```

## 系统信息

```bash
# 查看系统信息
uname -a

# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看进程
ps aux | grep process_name
```

## 网络工具

```bash
# 查看网络连接
netstat -tuln

# 测试连通性
ping example.com

# 下载文件
wget https://example.com/file.zip
```

## 总结

掌握这些常用命令可以大大提高开发效率，建议多加练习。

```
