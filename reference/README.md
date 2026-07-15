# 参考图片目录

此目录用于存放网站所需的图片资源。

## 目录结构

```
reference/images/
├── avatar.jpg          # 个人头像（建议尺寸：512x512）
├── posts/              # 文章封面图片
│   ├── mysql-basics.jpg
│   ├── ai-thinking.jpg
│   ├── linux-commands.jpg
│   └── ...
└── README.md           # 本说明文件
```

## 图片规格要求

### 头像 (avatar.jpg)
- 尺寸：512x512 像素
- 格式：JPG/PNG
- 用途：网站侧边栏、关于页面展示

### 文章封面 (posts/)
- 尺寸：1200x630 像素（推荐）
- 格式：JPG/PNG/WebP
- 用途：文章列表卡片、文章详情页头部

## 使用说明

1. 将您的图片放入对应目录
2. 在代码中引用路径：`/images/avatar.jpg`、`/images/posts/xxx.jpg`
3. 建议使用WebP格式以获得更好的性能
4. 图片文件名使用英文小写和连字符
