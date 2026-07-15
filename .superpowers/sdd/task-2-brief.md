## Task 2: Navigation Data, Article Helpers, Paths, Tokens, And Local Assets

**Files:**

- Create: `app/data/navigation.ts`
- Create: `app/utils/articles.ts`
- Create: `app/utils/paths.ts`
- Modify: `app/assets/css/main.css`
- Modify: `tailwind.config.ts`
- Modify: `nuxt.config.ts`
- Create: `public/images/reference/deaimon/hero-main.png`
- Create: `public/images/reference/deaimon/cover-mysql.jpg`
- Create: `public/images/reference/deaimon/cover-ai.jpg`
- Create: `public/images/reference/deaimon/cover-linux.jpg`
- Create: `public/images/reference/deaimon/paper-body.jpg`
- Create: `public/images/reference/deaimon/paper-section.jpg`
- Create: `public/images/reference/deaimon/paper-nav.jpg`
- Create: `public/images/reference/deaimon/petal-01.png`
- Create: `public/images/reference/deaimon/petal-03.png`
- Create: `public/images/reference/deaimon/petal-07.png`
- Create: `public/images/reference/deaimon/ASSET-SOURCES.md`
- Modify: `content/blog/mysql-basics.md`
- Modify: `content/blog/ai-thinking.md`
- Modify: `content/blog/linux-commands.md`

**Interfaces:**

- Produces `portalNavItems`, `portalCategories`, article helpers, and path helpers for every later page/component.
- Produces paper CSS tokens, three local article covers, local paper/petal materials, and temporary hero path `/images/reference/deaimon/hero-main.png`.

- [ ] **Step 1: GREEN navigation data**

Implement `app/data/navigation.ts` with the exact interfaces in this plan.

Required item data:

```ts
[
  ['home', '/', '首页', 'ホーム', 'HOME', '返回门户首页', 'ポータルのホームへ', 'nav-link-home', false],
  ['blog', '/blog', '博客文章', 'ブログ', 'BLOG', '技术文章与学习记录', '技術記事と学習記録', 'nav-link-blog', true],
  ['projects', '/projects', '开源作品', 'オープンソース', 'PROJECTS', '开源项目与实验作品', 'オープンソースと実験作品', 'nav-link-projects', true],
  ['movies', '/movies', '电影推荐', '映画のおすすめ', 'MOVIES', '喜欢的电影与剧集', '好きな映画とドラマ', 'nav-link-movies', true],
  ['anime', '/anime', '动漫推荐', 'アニメのおすすめ', 'ANIME', '新番与经典动画', '新作と名作アニメ', 'nav-link-anime', true],
  ['music', '/music', '音乐推荐', '音楽のおすすめ', 'MUSIC', '音乐与歌单记录', '音楽とプレイリスト', 'nav-link-music', true],
  ['tools', '/tools', '工具资源', 'ツール・リソース', 'TOOLS', '开发工具和学习资源', '開発ツールと学習リソース', 'nav-link-tools', true],
  ['life', '/life', '生活随笔', '日常エッセイ', 'LIFE', '日常生活与想法', '日常生活と思考', 'nav-link-life', true],
  ['notes', '/notes', '技术笔记', '技術ノート', 'NOTES', '技术笔记和教程', '技術ノートとチュートリアル', 'nav-link-notes', true],
  ['about', '/about', '关于我', '自己紹介', 'ABOUT', '个人简介与经历', 'プロフィールと経歴', 'nav-link-about', false],
]
```

Run:

```powershell
npm run test:unit -- tests/unit/navigation.test.ts
```

Expected GREEN:

```text
PASS tests/unit/navigation.test.ts
```

- [ ] **Step 2: GREEN article helpers**

Implement `app/utils/articles.ts` with immutable helper behavior.

Run:

```powershell
npm run test:unit -- tests/unit/articles.test.ts
```

Expected GREEN:

```text
PASS tests/unit/articles.test.ts
```

- [ ] **Step 3: GREEN path helpers**

Implement `app/utils/paths.ts`.

Run:

```powershell
npm run test:unit -- tests/unit/paths.test.ts
```

Expected GREEN:

```text
PASS tests/unit/paths.test.ts
```

- [ ] **Step 4: Replace CSS tokens with paper design tokens**

Modify `app/assets/css/main.css`.

Required root tokens:

```css
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
  --color-bg: var(--paper);
  --color-surface: var(--paper-warm);
  --color-text: var(--ink);
  --color-text-secondary: var(--ink-soft);
  --color-border: var(--rule);
}
```

Required dark tokens:

```css
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
```

Remove or stop using `.sidebar`, `.card`, `bg-mesh`, old pink/teal dashboard gradients, and emoji-oriented card utilities.

Add reduced motion:

```css
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

- [ ] **Step 5: Align Tailwind tokens with CSS variables**

Modify `tailwind.config.ts`:

- Keep `darkMode: 'class'`.
- Map `primary.DEFAULT` to `var(--vermilion)`.
- Map `surface`, `bg`, `text`, and `border` to the CSS variables.
- Change serif font family to include `Noto Serif SC`, `Noto Serif JP`, `Songti SC`, `serif`.
- Do not add new Tailwind plugins.

- [ ] **Step 6: Align Nuxt head fonts and metadata**

Modify `nuxt.config.ts`:

- Replace current Inter/Noto Sans font stylesheet with Noto Serif SC and Noto Serif JP.
- Set `theme-color` to `#f8f5ed`.
- Keep existing modules unchanged.
- Keep i18n strategy unchanged.

Required font link:

```ts
{
  rel: 'stylesheet',
  href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Serif+JP:wght@400;600;700;900&display=swap',
}
```

- [ ] **Step 7: Localize temporary hero asset**

Create directory `public/images/reference/deaimon/`.

Copy:

```powershell
Copy-Item -LiteralPath "reference\images\文章底片.png" -Destination "public\images\reference\deaimon\hero-main.png"
```

Expected:

```text
exit code 0
public/images/reference/deaimon/hero-main.png exists
```

- [ ] **Step 8: Download local paper, petal, and article placeholder assets**

Download exact reference-site files into the already-created local directory. These are development-preview placeholders only; never reference the source URLs from application code.

```powershell
$assets = @(
  @{ Url = 'https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000097.jpg?1661764396'; File = 'cover-mysql.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000096.jpg?1661764396'; File = 'cover-ai.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/contents/00000032/block/00000061/00000127.jpg?1661764396'; File = 'cover-linux.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/tz/paper2.jpg'; File = 'paper-body.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/tz/paper1.jpg'; File = 'paper-section.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/tz/nav/navi_bg.jpg'; File = 'paper-nav.jpg' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/sakura/petal01.png'; File = 'petal-01.png' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/sakura/petal03.png'; File = 'petal-03.png' },
  @{ Url = 'https://deaimon.jp/core_sys/images/main/sakura/petal07.png'; File = 'petal-07.png' }
)

foreach ($asset in $assets) {
  Invoke-WebRequest -Uri $asset.Url -OutFile (Join-Path 'public\images\reference\deaimon' $asset.File)
}
```

Expected:

```text
exit code 0
all nine files exist locally
cover files report 1500x844 dimensions
no application file contains an https://deaimon.jp image URL
```

- [ ] **Step 9: Point current Markdown covers to local temporary files**

Modify only each frontmatter `cover` value:

```yaml
# content/blog/mysql-basics.md
cover: /images/reference/deaimon/cover-mysql.jpg

# content/blog/ai-thinking.md
cover: /images/reference/deaimon/cover-ai.jpg

# content/blog/linux-commands.md
cover: /images/reference/deaimon/cover-linux.jpg
```

Do not change article titles, dates, tags, categories, or body content.

- [ ] **Step 10: Wire local material URLs into design tokens**

Add these root variables in `app/assets/css/main.css`:

```css
:root {
  --paper-texture: url('/images/reference/deaimon/paper-body.jpg');
  --section-paper-texture: url('/images/reference/deaimon/paper-section.jpg');
  --nav-paper-texture: url('/images/reference/deaimon/paper-nav.jpg');
  --petal-01: url('/images/reference/deaimon/petal-01.png');
  --petal-03: url('/images/reference/deaimon/petal-03.png');
  --petal-07: url('/images/reference/deaimon/petal-07.png');
}
```

Components consume only these local CSS variables; they must not embed source-site URLs.

- [ ] **Step 11: Create asset source audit**

Create `public/images/reference/deaimon/ASSET-SOURCES.md`:

```markdown
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

- [ ] **Step 12: Verify assets and unit tests**

Run:

```powershell
$requiredAssets = @(
  'hero-main.png', 'cover-mysql.jpg', 'cover-ai.jpg', 'cover-linux.jpg',
  'paper-body.jpg', 'paper-section.jpg', 'paper-nav.jpg',
  'petal-01.png', 'petal-03.png', 'petal-07.png', 'ASSET-SOURCES.md'
)

foreach ($file in $requiredAssets) {
  if (-not (Test-Path -LiteralPath (Join-Path 'public\images\reference\deaimon' $file))) {
    throw "Missing temporary asset: $file"
  }
}

npm run test:unit
```

Run:

```powershell
npm run test:unit
```

Expected:

```text
PASS tests/unit/navigation.test.ts
PASS tests/unit/articles.test.ts
PASS tests/unit/paths.test.ts
```

