# Lonelyyang3

一个基于 **Nuxt 4 + Nuxt Content 3** 的中日双语个人内容门户。项目采用和纸、墨色、朱红印章与竖排导航构成视觉语言，内容覆盖技术博客、开源项目、推荐内容、生活随笔和个人介绍。

> [!IMPORTANT]
> 当前状态是 **development preview（开发预览）**。网站功能和响应式布局已经完成验证，但 `public/images/reference/deaimon/` 中仍包含开发期临时参考素材；替换为拥有发布权利的素材前，不应宣称生产素材就绪。

## 核心能力

- 固定右侧导航轨与响应式抽屉，支持键盘操作、焦点陷阱/循环、Escape 和焦点恢复，不改变页面背景滚动。
- 图片主导的首页首屏，以及按日期排序、桌面奇偶双栏、移动端单栏的文章流。
- Nuxt Content 3 博客索引、分类筛选、详情、上一篇/下一篇和显式 404。
- 中文默认路由与 `/ja` 日语前缀路由；站内链接、搜索结果和文章查询保持 locale 一致。
- 抽屉内搜索、语言切换和主题切换；主题偏好保存在 `localStorage.theme`。
- 和纸/墨色设计令牌、深色主题、减弱动效和移动端无横向溢出约束。
- Vitest 单元测试与 Playwright 浏览器测试覆盖关键路由和交互。

## 技术栈

| 层次 | 技术 |
|---|---|
| 应用框架 | Nuxt `4.4.8`、Vue `3.5.39` |
| 内容 | `@nuxt/content` `3.15.x`、Markdown |
| 国际化 | `@nuxtjs/i18n` `10.4.x`，`prefix_except_default` |
| 样式 | Tailwind CSS Nuxt Module `6.14.x` + scoped CSS + CSS variables |
| 图片与工具 | `@nuxt/image`、VueUse |
| 测试 | Vitest `4.1.x`、Playwright `1.61.x` |

## 快速开始

项目当前不要求环境变量。锁定的 Nuxt 版本要求 Node.js `^22.12.0`、`^24.11.0` 或 `>=26.0.0`。

```bash
# 安装锁定版本依赖
npm ci

# 启动开发服务器：http://localhost:3000
npm run dev
```

生产构建与本地预览：

```bash
npm run build
npm run preview
```

## 测试

```bash
# 纯 TypeScript 单元测试
npm run test:unit

# Playwright 浏览器测试
npm run test:e2e

# 两者顺序执行
npm test
```

截至 `2026-07-15` 的验证快照：**18 条单元测试、44 条 Playwright 测试和 Nuxt 生产构建通过**。浏览器测试会通过 `playwright.config.ts` 自动启动开发服务器。

## 路由

| 页面 | 默认语言 | 日语 |
|---|---|---|
| 首页 | `/` | `/ja` |
| 博客 | `/blog` | `/ja/blog` |
| 文章详情 | `/blog/:slug` | `/ja/blog/:slug` |
| 开源作品 | `/projects` | `/ja/projects` |
| 电影推荐 | `/movies` | `/ja/movies` |
| 动漫推荐 | `/anime` | `/ja/anime` |
| 音乐推荐 | `/music` | `/ja/music` |
| 工具资源 | `/tools` | `/ja/tools` |
| 生活随笔 | `/life` | `/ja/life` |
| 技术笔记 | `/notes` | `/ja/notes` |
| 关于我 | `/about` | `/ja/about` |

## 项目结构

```text
portfolio/
├─ app/
│  ├─ assets/css/       # 全局令牌、纸张材质和主题变量
│  ├─ components/       # 布局、内容、首页区块、装饰和 UI 控件
│  ├─ data/             # 全站导航与分类的单一数据源
│  ├─ layouts/          # 右侧导航轨驱动的默认外壳
│  ├─ pages/            # 文件路由页面
│  ├─ plugins/          # 客户端主题初始化
│  └─ utils/            # 文章排序、分栏和 locale 路径函数
├─ content/blog/        # Nuxt Content 博客 Markdown
├─ i18n/locales/        # 实际运行时中日文翻译
├─ public/              # 浏览器可直接访问的静态资源
├─ tests/unit/          # 数据和路径纯函数测试
├─ tests/e2e/           # 路由、交互、响应式和视觉回归测试
├─ docs/                # 当前架构说明与历史文档索引
├─ DESIGN.md            # 视觉系统与设计约束
└─ content.config.ts    # Content collection 与 frontmatter schema
```

更完整的组件关系、数据流和扩展方法见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

## 添加博客文章

在 `content/blog/` 新建 Markdown。路径由文件名生成，例如 `content/blog/nuxt-notes.md` 对应 `/blog/nuxt-notes`。

```yaml
---
title: Nuxt 学习笔记
description: 文章摘要
date: 2026-07-15
category: Nuxt
tags:
  - Vue
  - Nuxt
cover: /images/posts/nuxt-notes.jpg
---
```

随后编写正文，并运行：

```bash
npm run test:unit
npm run test:e2e -- tests/e2e/blog-routes.spec.ts
npm run build
```

## 添加导航分类或页面

1. 在 `app/data/navigation.ts` 扩展 `PortalRouteKey`。
2. 在 `portalNavItemsByKey` 添加包含中日文标签、路径、test ID 和 `appearsOnHome` 的完整记录。
3. 将记录加入有序的 `portalNavItems`；需要出现在首页时，再加入 `portalCategories`。
4. 在 `app/pages/<route>/index.vue` 创建页面；普通内容分类优先复用 `CategoryLanding`。
5. 更新中日文文案、路由测试和必要的响应式测试。

不要在首页、抽屉和页面中分别维护导航数组；`app/data/navigation.ts` 是唯一来源。

## 设计与素材规则

- [`DESIGN.md`](DESIGN.md) 是视觉令牌、布局断点、组件行为和可访问性约束的当前权威。
- 颜色和材质优先使用 `app/assets/css/main.css` 中的 CSS variables，不在组件中散落新色值。
- 不使用 Emoji 作为结构性图标；图标使用 SVG。
- `public/images/reference/deaimon/ASSET-SOURCES.md` 记录了临时素材来源和替换状态。
- 上线前必须替换 `public/images/reference/deaimon/` 下的运行时素材，并确认页面不再请求该目录。

## 下一步改进

推荐按以下顺序迭代：

1. **替换临时素材**：这是从开发预览进入生产发布的前置条件。
2. **清理遗留组件和重复 locale**：删除前先确认无引用，并运行完整测试与构建。
3. **完善内容模型**：将电影、动漫、音乐、工具等静态占位项迁移为 Content collection。
4. **优化搜索**：当前每次输入都会查询完整博客集合，可增加缓存或预构建索引。
5. **统一主题状态**：将插件和按钮中的 DOM/localStorage 逻辑收敛为共享 composable。
6. **完善媒体管线**：更多使用 `@nuxt/image`、响应式尺寸和自有 WebP/AVIF 素材。
7. **实现 RSS**：页脚已有 `/atom.xml` 链接，但当前没有对应生成逻辑。

技术债务的文件级清单见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#已知技术债务)。

## 文档入口

- [`README.md`](README.md)：安装、使用和日常改进入口。
- [`DESIGN.md`](DESIGN.md)：现役视觉设计合同。
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)：运行时架构、数据流和扩展指南。
- [`docs/README.md`](docs/README.md)：文档权威层级与历史归档说明。

## 许可与素材

仓库当前没有声明软件许可证。临时参考图片不代表已获得生产发布授权；请在公开部署前完成代码许可选择和素材权利确认。
