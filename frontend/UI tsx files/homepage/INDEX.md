# FemPunk Nvshu - 页面组件索引

## 📦 已创建的文件

### 🏠 Homepage (首页) - Node ID: 70:1809

**主要文件**:
- `HomePage.tsx` - Next.js React 组件
- `HomePage.module.css` - CSS Modules 样式
- `home-types.ts` - TypeScript 类型定义
- `HOME_README.md` - 详细文档

**特性**:
- ✅ Hero 区域标题
- ✅ 今日女书字展示 (带发光效果)
- ✅ 社区作品画廊 (3×2 网格)
- ✅ Start Painting CTA 按钮
- ✅ 复杂背景装饰层
- ✅ 导航栏组件

---

### 🎨 Paint Page (绘画页) - Node ID: 101:2188

**主要文件**:
- `PaintPage.tsx` - Next.js React 组件
- `PaintPage.module.css` - CSS Modules 样式
- `paint-page.html` - 独立 HTML 版本
- `paint-page.css` - 独立 CSS 版本
- `types.ts` - TypeScript 类型定义
- `README.md` - 详细文档

**特性**:
- ✅ 画布区域 (910×910px, 带遮罩)
- ✅ 工具面板 (移动、缩放、笔刷等)
- ✅ 颜色选择器
- ✅ Mint Color 按钮
- ✅ 信息面板 (今日女书字、主题、介绍)
- ✅ 导航栏

---

## 🚀 快速开始

### 在 Next.js 14 项目中使用

#### 1. 首页

```tsx
// app/page.tsx
import HomePage from './components/HomePage';

export default function Home() {
  return <HomePage />;
}
```

#### 2. 绘画页

```tsx
// app/paint/page.tsx
import PaintPage from './components/PaintPage';

export default function Paint() {
  return <PaintPage />;
}
```

---

## 📐 设计规格对照表

| 页面 | Node ID | 尺寸 | 主要颜色 |
|------|---------|------|---------|
| Homepage | 70:1809 | 1440×2700px | `#161616`, `#1ee11f`, `#7b2eff` |
| Paint Page | 101:2188 | 1440×1024px | `#161616`, `#1ee11f`, `#7b2eff` |

---

## 🎨 颜色系统

```css
/* 主色调 */
--bg-primary: #161616;         /* 主背景 */
--color-green: #1ee11f;        /* 品牌绿 */
--color-purple: #7b2eff;       /* 主紫色 */
--color-pink-glow: #ff66e8;    /* 发光粉 */

/* 面板 */
--bg-panel: #212121;           /* 信息面板 */
--bg-toolbar: #2c2c2c;         /* 工具栏 */
--bg-button: #444444;          /* 按钮 */

/* 边框 */
--border-panel: #373737;
--border-white-10: rgba(255, 255, 255, 0.1);
--border-white-20: rgba(255, 255, 255, 0.2);
--border-white-30: rgba(255, 255, 255, 0.3);
--border-white-80: rgba(255, 255, 255, 0.8);
```

---

## 🔗 组件关系

```
App
├── HomePage (/)
│   ├── NavBar
│   ├── HeroSection
│   ├── NvshuTodaySection
│   └── CommunityArtworksSection
│
└── PaintPage (/paint)
    ├── NavBar
    ├── CanvasArea
    ├── ToolPanel
    └── InfoPanel
```

---

## 📚 文档导航

- **首页文档**: [HOME_README.md](./HOME_README.md)
- **绘画页文档**: [README.md](./README.md)
- **通用类型**: [types.ts](./types.ts)
- **首页类型**: [home-types.ts](./home-types.ts)

---

## ✅ 完成度检查表

### HomePage
- [x] TSX 组件
- [x] CSS Modules
- [x] TypeScript 类型
- [x] 文档
- [x] 所有图片资源
- [x] 响应式布局
- [x] 混合模式效果
- [x] 发光效果

### PaintPage
- [x] TSX 组件
- [x] CSS Modules
- [x] HTML 版本
- [x] CSS 版本
- [x] TypeScript 类型
- [x] 文档
- [x] 所有图片资源
- [x] 响应式布局
- [x] 遮罩效果

---

## 🔧 集成指南

### 1. 字体

```tsx
// app/layout.tsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});
```

### 2. 钱包连接 (RainbowKit)

```bash
npm install @rainbow-me/rainbowkit wagmi viem
```

```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 替换导航栏的 Connect 按钮
```

### 3. 路由导航

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<HomePage
  onStartPainting={() => router.push('/paint')}
/>
```

### 4. 画布集成 (Fabric.js)

```bash
npm install fabric
```

```tsx
import { Canvas } from 'fabric/fabric-impl';

useEffect(() => {
  const canvas = new Canvas('canvas');
  // 初始化画布
}, []);
```

---

## 📊 性能优化建议

### 图片优化
1. 下载所有 Figma 资源到本地/CDN
2. 使用 Next/Image 的 `priority` 属性
3. 装饰图片使用懒加载

### CSS 优化
1. 关键 CSS 内联
2. 使用 CSS containment
3. 避免过度使用混合模式

### 代码分割
```tsx
const HomePage = dynamic(() => import('./HomePage'), {
  loading: () => <Loading />,
});
```

---

## 🎯 下一步开发

### Homepage
- [ ] 添加滚动动画
- [ ] 集成真实作品数据
- [ ] 添加作品详情页
- [ ] 实现 Mint/Buy 功能

### PaintPage
- [ ] 集成 Fabric.js 画布
- [ ] 实现绘画工具
- [ ] 添加实时协作 (Liveblocks)
- [ ] 保存到 IPFS

---

## 📄 许可证

根据项目主许可证。

---

**技术栈**: Next.js 14 + React 18 + TypeScript + CSS Modules

**设计工具**: Figma

**代码标准**: Linus-style (简洁、直接、零废话)
