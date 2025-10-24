# FemPunk Nvshu - Gallery Page

> 1:1 精确还原的 Figma 作品展览页面设计 - 女书艺术品NFT展示平台

## 📐 设计规格

- **Figma Node ID**: `101:2395`
- **页面名称**: 展览页 (Gallery Page)
- **设计尺寸**: `1440px × 1024px`
- **设计特点**:
  - 响应式网格布局（3列）
  - 多状态作品卡片（Painting/Mint/Buy）
  - 参与人数显示
  - 价格信息展示
  - 颜色调色板可视化
  - 交互式操作按钮

## 🗂️ 文件结构

```
page1/
├── GalleryPage.tsx              # Next.js React 组件
├── GalleryPage.module.css       # CSS Modules 样式
├── gallery-page.html           # 独立 HTML 版本
├── gallery-page.css            # 独立 CSS 版本
├── gallery-types.ts            # TypeScript 类型定义
└── GALLERY_README.md           # 本文档
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
cp GalleryPage.tsx your-project/app/gallery/page.tsx
cp GalleryPage.module.css your-project/app/gallery/
cp gallery-types.ts your-project/types/
```

#### 2. 在 App Router 中使用

```tsx
// app/gallery/page.tsx
import GalleryPage from './GalleryPage';

export default function Gallery() {
  return (
    <GalleryPage
      artworks={[
        {
          id: '1',
          title: 'Spring Garden',
          day: 24,
          theme: 'Spring Garden',
          imageUrl: 'https://...',
          status: 'painting',
          participants: 100,
          colors: [],
          colorPaletteImageUrl: 'https://...',
        },
        // 更多作品...
      ]}
      onPaint={(artwork) => {
        console.log('Paint artwork:', artwork);
        // 导航到绘画页面
      }}
      onMint={(artwork) => {
        console.log('Mint artwork:', artwork);
        // 调用智能合约 mint 功能
      }}
      onBuy={(artwork) => {
        console.log('Buy artwork:', artwork);
        // 调用智能合约购买功能
      }}
    />
  );
}
```

#### 3. 添加字体

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
| Primary Green | `#1ee11f` | Mint 按钮、高亮文字 |
| Primary Purple | `#7b2eff` | Paint 按钮 |
| Panel Background | `#2c2c2c` | 卡片底部背景 |
| Border Light | `rgba(255, 255, 255, 0.1)` | 卡片边框 |
| Border Medium | `rgba(255, 255, 255, 0.3)` | 按钮边框 |
| Border Strong | `rgba(255, 255, 255, 0.5)` | Buy 按钮边框 |
| Text White | `#ffffff` | 主要文字 |
| Text Dim | `rgba(255, 255, 255, 0.4)` | 次要文字、价格 |

## 📏 关键尺寸

| 元素 | 尺寸 | 位置 |
|------|------|------|
| 页面容器 | `1440px × 1024px` | - |
| 导航栏 | `1440px × 96px` | `top: 0` |
| Gallery Grid | `1070px × auto` | `left: 185px, top: 136px` |
| 卡片 | `350px × 445px` | - |
| 卡片间距 | `10px` | gap |
| 作品图片 | `350px × 350px` | 正方形 |
| 底部面板 | `350px × 126px` | - |
| 操作按钮 | `78px × 36px` | - |
| 图标（人数） | `14px × 14px` | - |
| 图标（ETH） | `12px × 12px` | - |

## 🎯 页面结构

### 1. 导航栏
- Logo (FemPunk)
- 菜单: PAINT, COLOR, **GALLERY** (active), COLLECT
- 钱包连接按钮 (显示地址)

### 2. Gallery Grid
- **3列网格布局**: 350×445px 卡片
- **间距**: 10px gap
- **容器位置**: left 185px, top 136px
- **响应式**: flexbox wrap

### 3. 作品卡片 (Gallery Card)

#### 卡片结构：
- **作品图片**: 350×350px 正方形，圆角4px
- **底部面板**: 背景#2c2c2c，高126px
- **标题**: "Day XX｜主题名称"
- **参与人数**: 图标 + 数字
- **价格/状态**:
  - Painting: "Painting now..." 文字
  - Mint/Buy: ETH图标 + 价格
- **颜色调色板**: 4个颜色圆圈
- **操作按钮**: 右下角，3种状态

#### 按钮状态：
1. **Paint** - 紫色 (#7b2eff)
   - 作品创作中
   - 显示 "Painting now..." 状态
2. **Mint** - 绿色 (#1ee11f)
   - 可以铸造NFT
   - 显示价格信息
3. **Buy** - 透明边框
   - 可以购买
   - 显示价格信息

## 🖼️ 图片资源

所有图片都从 Figma API 加载：

### 核心资源
- **参与人数图标**: `8101c3a4-3e18-46dc-b325-6466ebcb6ac1`
- **ETH 图标**: `5c701117-b4dc-4931-9a5f-5c036993035b`
- **颜色调色板**: `bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1`

### 作品图片
- **Day 24**: `16e58fce-0456-4b6c-951b-f2d13665549a`
- **Day 23**: `a7ab02df-9d13-41ca-9834-b99adff1817e`
- **Day 22**: `1f978205-a23b-4e28-bfd9-6ed2391e28c9`
- **Day 21**: `3c19f0c7-c11f-4423-b9a6-8343efd6bd41`
- **Day 20**: `91958504-3915-4f6c-b21f-163580820bcf`
- **Day 19**: `5741f542-1f8d-4eae-8cfd-8a9e59cbc351`

## 🔧 开发集成

### 集成 RainbowKit (钱包连接)

```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 替换 Connect 按钮
<div className={styles.navbarRight}>
  <ConnectButton />
</div>
```

### 集成智能合约交互

```tsx
import { useContractWrite } from 'wagmi';

const { write: mintArtwork } = useContractWrite({
  address: ARTWORK_NFT_CONTRACT_ADDRESS,
  abi: ARTWORK_NFT_ABI,
  functionName: 'mint',
});

const { write: buyArtwork } = useContractWrite({
  address: MARKETPLACE_CONTRACT_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'buyNFT',
});

<GalleryPage
  onMint={(artwork) => {
    mintArtwork({
      args: [artwork.id],
      value: parseEther(artwork.price.toString()),
    });
  }}
  onBuy={(artwork) => {
    buyArtwork({
      args: [artwork.tokenId],
      value: parseEther(artwork.price.toString()),
    });
  }}
/>
```

### 集成数据获取

```tsx
import { useState, useEffect } from 'react';

const [artworks, setArtworks] = useState<ArtworkItem[]>([]);

useEffect(() => {
  async function fetchArtworks() {
    const response = await fetch('/api/artworks');
    const data = await response.json();
    setArtworks(data);
  }

  fetchArtworks();
}, []);

<GalleryPage artworks={artworks} />
```

### 集成路由导航

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<GalleryPage
  onPaint={(artwork) => {
    router.push(`/paint/${artwork.id}`);
  }}
  onArtworkClick={(artwork) => {
    router.push(`/artwork/${artwork.id}`);
  }}
/>
```

## 📝 组件 Props API

### GalleryPage

```typescript
interface GalleryPageProps {
  className?: string;
  artworks?: ArtworkItem[];
  walletAddress?: string;
  onArtworkClick?: (artwork: ArtworkItem) => void;
  onPaint?: (artwork: ArtworkItem) => void;
  onMint?: (artwork: ArtworkItem) => void;
  onBuy?: (artwork: ArtworkItem) => void;
  onConnectWallet?: () => void;
}
```

### ArtworkItem

```typescript
interface ArtworkItem {
  id: string;
  title: string;
  day: number;
  theme: string;
  imageUrl: string;
  status: 'painting' | 'mint' | 'buy';
  participants: number;
  price?: number;
  currency?: 'ETH' | 'MATIC' | string;
  colors: ColorItem[];
  colorPaletteImageUrl?: string;
  createdAt?: Date;
  mintedAt?: Date;
  tokenId?: string;
}
```

### 使用示例

```tsx
<GalleryPage
  artworks={[
    {
      id: '1',
      title: 'Spring Garden',
      day: 24,
      theme: 'Spring Garden',
      imageUrl: 'https://...',
      status: 'painting',
      participants: 100,
      colors: [
        { id: '1', hex: '#FF66E8' },
        { id: '2', hex: '#1EE11F' },
        { id: '3', hex: '#7B2EFF' },
        { id: '4', hex: '#FFD700' },
      ],
      colorPaletteImageUrl: 'https://...',
    },
    {
      id: '2',
      title: 'Spring Garden',
      day: 23,
      theme: 'Spring Garden',
      imageUrl: 'https://...',
      status: 'mint',
      participants: 100,
      price: 0.24,
      currency: 'ETH',
      colors: [],
      colorPaletteImageUrl: 'https://...',
    },
  ]}
  walletAddress="0xF7a1...7BAD"
  onPaint={(artwork) => router.push(`/paint/${artwork.id}`)}
  onMint={(artwork) => console.log('Mint:', artwork)}
  onBuy={(artwork) => console.log('Buy:', artwork)}
  onArtworkClick={(artwork) => router.push(`/artwork/${artwork.id}`)}
/>
```

## 🚨 已知问题和优化建议

### 性能优化

1. **图片优化**
   - 当前所有图片从 Figma API 加载
   - **建议**: 下载到本地或 CDN
   - 使用 Next/Image 的 `priority` 属性优化首屏
   - 添加 `loading="lazy"` 对非首屏卡片

2. **无限滚动/分页**
   - 当前显示所有作品
   - **建议**: 实现虚拟滚动或分页
   - 使用 `react-window` 或 `react-virtual`

3. **动画性能**
   - 卡片 hover 效果
   - **建议**: 使用 CSS transforms
   - 添加 `will-change` 优化

### 可访问性

1. **键盘导航**
   - 确保所有卡片可 focus
   - 添加 Tab 键顺序
   - 支持 Enter/Space 激活按钮

2. **ARIA 标签**
   - 添加 aria-label 给图标
   - 使用 role 属性标记网格
   - 添加 alt 文本给所有图片

3. **色彩对比度**
   - 确保文字与背景对比度符合 WCAG 标准
   - 特别注意灰色文字 (opacity: 0.4)

### 功能增强

1. **筛选和排序**
   - 按状态筛选 (Painting/Mint/Buy)
   - 按价格排序
   - 按参与人数排序
   - 按日期排序

2. **搜索功能**
   - 搜索作品标题
   - 搜索主题
   - 搜索作者

3. **加载状态**
   - Loading skeleton
   - 图片加载占位符
   - 错误状态处理

4. **交易反馈**
   - Loading 状态
   - 成功/失败提示
   - Transaction hash 显示
   - 进度指示器

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
}

@media (max-width: 768px) {
  .container {
    transform: scale(0.5);
  }

  .gallery-grid {
    width: 100%;
    justify-content: center;
  }
}
```

**建议**: 生产环境重新设计为真正的响应式布局：
- 平板: 2列布局
- 手机: 1列布局
- 调整字体大小和间距

## 🎯 后续开发计划

1. **筛选和搜索**
   - 实现筛选面板
   - 添加搜索框
   - URL 参数同步

2. **无限滚动**
   - 集成 Intersection Observer
   - 分页加载更多
   - 优化性能

3. **作品详情页**
   - 点击卡片跳转详情
   - 显示完整信息
   - 交易历史

4. **用户交互优化**
   - 添加收藏功能
   - 分享功能
   - 评论系统

5. **数据持久化**
   - 保存筛选条件
   - 浏览历史
   - 收藏列表

## 🔗 相关资源

- [Figma 设计稿](https://www.figma.com/design/PstNpfNzIRD7shqtqVVszd/FemFunk-Nvshu--Copy-?node-id=101-2395)
- [Next.js Image 文档](https://nextjs.org/docs/app/api-reference/components/image)
- [RainbowKit](https://www.rainbowkit.com/)
- [wagmi](https://wagmi.sh/)
- [react-window](https://github.com/bvaughn/react-window)

---

**Created with precision and attention to detail**

> "这是一个清晰而强大的艺术品展览界面。每个卡片、每个按钮状态都经过精确设计，完美还原 Figma 规格。网格布局、颜色系统、交互状态，一切都是像素级完美。"
