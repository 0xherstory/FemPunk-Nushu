# FemPunk Nvshu - Home Page

> 1:1 精确还原的 Figma 首页设计 - 女书重生艺术共创平台

## 📐 设计规格

- **Figma Node ID**: `70:1809`
- **页面名称**: 首页 (Homepage)
- **设计尺寸**: `1440px × ~2700px` (可滚动)
- **设计特点**:
  - 多层背景装饰
  - 复杂的混合模式和透明度
  - Hero 区域标题动画
  - 今日女书字展示
  - 社区作品画廊

## 🗂️ 文件结构

```
page1/
├── HomePage.tsx              # Next.js React 组件
├── HomePage.module.css       # CSS Modules 样式
├── home-types.ts            # TypeScript 类型定义
├── HOME_README.md           # 本文档
├── PaintPage.tsx            # 绘画页组件 (之前创建)
├── PaintPage.module.css     # 绘画页样式
└── types.ts                 # 通用类型定义
```

## 🚀 技术栈

- **Next.js 14** (App Router)
- **React 18**
- **CSS Modules**
- **TypeScript**
- **Next/Image** (图片优化)

## 📦 使用方法

### Next.js 项目中使用

#### 1. 复制文件到项目

```bash
cp HomePage.tsx your-project/app/page.tsx
cp HomePage.module.css your-project/app/
cp home-types.ts your-project/types/
```

#### 2. 在 App Router 中使用

```tsx
// app/page.tsx
import HomePage from './HomePage';

export default function Page() {
  return (
    <HomePage
      onStartPainting={() => {
        // 导航到绘画页
      }}
      onViewAllArtworks={() => {
        // 导航到画廊页
      }}
      onBuyArtwork={(id) => {
        // 处理购买逻辑
      }}
      onMintArtwork={(id) => {
        // 处理 Mint 逻辑
      }}
    />
  );
}
```

#### 3. 添加 Google Fonts

在 `app/layout.tsx` 中：

```tsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
```

## 🎨 精确颜色规格

| 颜色名称 | 颜色值 | 用途 |
|---------|--------|------|
| Background | `#161616` | 主背景 |
| Primary Green | `#1ee11f` | 主色调 (品牌绿) |
| Primary Purple | `#7b2eff` | 次要色 (按钮紫) |
| Pink Glow | `#ff66e8` | 女书字发光效果 |
| White | `#ffffff` | 文本颜色 |
| Black | `#000000` | 标签背景 |

## 📏 关键尺寸

| 元素 | 尺寸 | 位置 |
|------|------|------|
| 页面容器 | `1440px × 2700px` | - |
| 导航栏 | `100% × 96px` | `top: 0` |
| Hero 标题 | `846px × 233px` | 居中，`top: 141px` |
| 女书字展示 | `480px × 480px` | 居中，`top: 850px` |
| 作品卡片 | `350px × 350px` | 网格布局 |
| Start 按钮 | `310px × 48px` | 居中 |
| Buy/Mint 按钮 | `138px × 48px` | 作品下方 |

## 🎯 页面结构

### 1. 导航栏
- Logo (FemPunk)
- 菜单: PAINT, COLOR, GALLERY, COLLECT
- Connect 钱包按钮

### 2. Hero Section
- **主标题**: "Nvshu Reborn Art Co-creation"
- **副标题1**: "Through decentralized collaboration,"
- **副标题2**: "the ancient script becomes the language of the future."
- **装饰元素**:
  - 荆棘图案 (顶部左右)
  - 多边形形状 (左右)
  - 撕纸效果 (底部)

### 3. Nvshu of Today
- **标题**: "Nvshu of Today"
- **描述**: 参与今日主题绘画
- **女书字展示**:
  - 发光边框效果 (`#ff66e8`)
  - 多层叠加图像
  - 翻译文字: "Spring"
- **CTA 按钮**: "Start Painting"

### 4. Community Artworks
- **标题**: "Community Artworks"
- **描述**: 探索过往协作作品
- **作品网格**: 3列 × 2行
- **按钮类型**:
  - **Mint**: 绿色背景 (`#1ee11f`)，深色文字
  - **Buy**: 半透明白色边框
- **View All**: 下划线链接 + 箭头图标

## 🖼️ 图片资源

所有图片都从 Figma API 加载：

### 核心资源
- **Hero 标题**: creation 1 (846×233)
- **女书字**: 多层叠加 (Group70, 图层07等)
- **作品图片**: IMG_6405-6408, 图层055等

### 装饰资源
- **背景**: 多个混合模式层
- **荆棘**: 旋转和缩放
- **多边形**: 左右对称
- **撕纸效果**: 顶部和底部

## 🔧 开发集成

### 集成 RainbowKit (钱包连接)

```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 替换 Connect 按钮
<div className={styles.navbarRight}>
  <ConnectButton />
</div>
```

### 集成 Next.js 路由

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<HomePage
  onStartPainting={() => router.push('/paint')}
  onViewAllArtworks={() => router.push('/gallery')}
/>
```

### 集成合约交互

```tsx
import { useContractWrite } from 'wagmi';

const { write: mintArtwork } = useContractWrite({
  address: ARTWORK_CONTRACT_ADDRESS,
  abi: ARTWORK_ABI,
  functionName: 'mint',
});

<HomePage
  onMintArtwork={(id) => {
    mintArtwork({
      args: [id],
    });
  }}
/>
```

## 🎨 复杂样式说明

### 混合模式 (Blend Modes)

```css
/* 颜色减淡 - 用于发光效果 */
.thornTop {
  mix-blend-mode: color-dodge;
}

/* 正片叠底 - 用于图层融合 */
.characterMask {
  mix-blend-mode: multiply;
}

/* 变亮 - 用于高光 */
.someElement {
  mix-blend-mode: lighten;
}
```

### 复杂变换

```css
/* 旋转 + 翻转 */
.polygonLeft {
  transform: rotate(136.158deg) scaleY(-1);
}

/* 多重居中 */
.element {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

### 发光效果

```css
.characterGlow {
  box-shadow: inset 0px 3.6px 27px 0px #ff66e8;
  border-radius: 27px;
  opacity: 0.9;
}
```

## 📱 响应式设计

当前实现使用缩放方案：

```css
@media (max-width: 1440px) {
  .container {
    transform: scale(0.9);
    transform-origin: top center;
  }
}

@media (max-width: 1200px) {
  .container {
    transform: scale(0.75);
  }

  .artworksGrid {
    grid-template-columns: repeat(2, 350px);
  }
}

@media (max-width: 768px) {
  .container {
    transform: scale(0.5);
  }

  .artworksGrid {
    grid-template-columns: 1fr;
  }
}
```

**建议**: 生产环境重新设计为真正的响应式布局。

## 🚨 已知问题和优化建议

### 性能优化

1. **图片优化**
   - 当前所有图片从 Figma API 加载
   - **建议**: 下载到本地或 CDN
   - 使用 Next/Image 的 `priority` 属性优化首屏

2. **布局复杂度**
   - 大量绝对定位
   - **建议**: 关键内容使用相对定位
   - 装饰元素可以懒加载

3. **动画性能**
   - 添加 CSS 动画时使用 `will-change`
   - 避免动画过多元素

### 可访问性

1. **图片 alt 文本**
   - 装饰图片使用空 alt (`alt=""`)
   - 内容图片添加描述性 alt

2. **键盘导航**
   - 确保所有交互元素可 focus
   - 添加 focus 样式

3. **语义化 HTML**
   - 使用 `<section>`, `<nav>` 等语义标签
   - 按钮使用 `<button>` 而非 `<div>`

## 🔗 相关资源

- [Figma 设计稿](https://www.figma.com/design/PstNpfNzIRD7shqtqVVszd/FemFunk-Nvshu--Copy-?node-id=70-1809)
- [Next.js Image 文档](https://nextjs.org/docs/app/api-reference/components/image)
- [CSS Blend Modes](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)
- [RainbowKit](https://www.rainbowkit.com/)

## 📝 组件 Props API

### HomePage

```typescript
interface HomePageProps {
  className?: string;
  onStartPainting?: () => void;
  onViewAllArtworks?: () => void;
  onBuyArtwork?: (artworkId: string) => void;
  onMintArtwork?: (artworkId: string) => void;
}
```

### 使用示例

```tsx
<HomePage
  className="custom-class"
  onStartPainting={() => console.log('Start painting')}
  onViewAllArtworks={() => console.log('View all')}
  onBuyArtwork={(id) => console.log('Buy:', id)}
  onMintArtwork={(id) => console.log('Mint:', id)}
/>
```

## 🎯 后续开发计划

1. **动画效果**
   - Hero 标题渐入动画
   - 女书字旋转/脉动效果
   - 滚动视差效果

2. **数据集成**
   - 从 API 获取作品数据
   - 从合约读取 NFT 信息
   - 实时更新今日女书字

3. **交互优化**
   - 作品卡片悬停效果
   - 按钮加载状态
   - Toast 通知

4. **SEO 优化**
   - Meta 标签
   - Open Graph
   - 结构化数据

---

**Created with precision and attention to detail**

> "这是一个复杂的设计，包含 60+ 个图层，100+ 个精确定位的元素。每个像素都经过计算，每个颜色都来自 Figma。这不是妥协，这是像素级完美。"
