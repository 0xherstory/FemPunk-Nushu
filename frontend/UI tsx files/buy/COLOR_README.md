# FemPunk Nvshu - Color Mint Page

> 1:1 精确还原的 Figma 颜色购买页面设计 - 女书颜色NFT铸造平台

## 📐 设计规格

- **Figma Node ID**: `100:1983`
- **页面名称**: Mint颜色页 (Color Mint Page)
- **设计尺寸**: `1440px × 1024px`
- **设计特点**:
  - 大型交互式彩虹渐变色轮
  - 实时颜色选择和预览
  - 价格折扣显示
  - 邀请码免费领取功能
  - 用户颜色收藏展示

## 🗂️ 文件结构

```
page1/
├── ColorPage.tsx              # Next.js React 组件
├── ColorPage.module.css       # CSS Modules 样式
├── color-page.html           # 独立 HTML 版本
├── color-page.css            # 独立 CSS 版本
├── color-types.ts            # TypeScript 类型定义
└── COLOR_README.md           # 本文档
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
cp ColorPage.tsx your-project/app/color/page.tsx
cp ColorPage.module.css your-project/app/color/
cp color-types.ts your-project/types/
```

#### 2. 在 App Router 中使用

```tsx
// app/color/page.tsx
import ColorPage from './ColorPage';

export default function Color() {
  return (
    <ColorPage
      selectedColor={{
        hex: '#AD4AFF',
        imageUrl: 'https://...',
      }}
      onMintColor={(color) => {
        console.log('Minting color:', color);
        // 调用智能合约 mint 功能
      }}
      onInvitationCodeSubmit={(code) => {
        console.log('Invitation code:', code);
        // 验证邀请码
      }}
      onFreeReceive={() => {
        console.log('Free receive clicked');
        // 免费领取 NFT
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
| Primary Green | `#1ee11f` | 免费领取按钮、高亮文字 |
| Primary Purple | `#7b2eff` | Mint 按钮 |
| Panel Background | `#2c2c2c` | Your Color 面板背景 |
| Border Light | `rgba(255, 255, 255, 0.1)` | 面板边框 |
| Border Medium | `rgba(255, 255, 255, 0.3)` | 输入框、按钮边框 |
| Text White | `#ffffff` | 主要文字 |
| Text Gray | `#989898` | 占位符文字 |
| Text Light Gray | `rgba(255, 255, 255, 0.5)` | 次要文字 |
| Divider Gray | `#5e5e5e` | 分隔线 |

## 📏 关键尺寸

| 元素 | 尺寸 | 位置 |
|------|------|------|
| 页面容器 | `1440px × 1024px` | - |
| 导航栏 | `1440px × 96px` | `top: 0` |
| 色轮 | `382px × 382px` | `left: 354px, top: 130px` |
| Mint 面板 | `280px × auto` | `left: 806px, top: 130px` |
| Mint 按钮 | `280px × 48px` | - |
| Your Color 面板 | `732px × 140px` | `top: 536px, centered` |
| 颜色圆圈 | `40px × 40px` | - |

## 🎯 页面结构

### 1. 导航栏
- Logo (FemPunk)
- 菜单: PAINT, **COLOR** (active), GALLERY, COLLECT
- 钱包连接按钮 (显示地址)

### 2. 左侧：彩虹色轮
- **大型渐变色轮**: 382×382px
- **交互式选择**: 点击选择颜色
- **实时预览**: 选中颜色高亮
- **图片资源**: `img1652` (彩虹渐变)

### 3. 右侧：Mint 面板
- **标题**: "Mint a Color"
- **选中颜色显示**:
  - 颜色圆圈 (40×40px)
  - Hex 值显示 (#AD4AFF)
  - Hex 输入框
- **价格信息**:
  - 当前价格: 0.0001 ETH
  - 原价: ~~0.0006 ETH~~ (划线)
- **Mint 按钮**: 紫色 (#7b2eff)
- **分隔线**: "or" 文字 + 两条横线
- **随机提示**: "You can get a random color NFT！"
- **邀请码输入**:
  - 输入框 + 占位符
  - "Free to receive" 绿色按钮

### 4. 底部：Your Color
- **标题**: "Your Color"
- **颜色列表**: 4个颜色圆圈
- **Hex 显示**: 每个颜色下方

## 🖼️ 图片资源

所有图片都从 Figma API 加载：

### 核心资源
- **彩虹色轮**: img1652 (4ede6f9f-ca64-4bd5-a766-14faa87d4dd6)
- **色轮遮罩**: img1651 (b440c43e-6279-46ac-b2e0-501869ca189c)
- **选中颜色**: imgEllipse4 (a70741bf-8c0e-41d4-964d-4e53d996bd1e)

### 用户颜色
- **Color 1**: imgEllipse5 (3be8ec3a-9340-4a2d-b016-b4e5578c25ca)
- **Color 2**: imgEllipse6 (b0fe4ea1-9d89-4b4f-a639-e58c37785105)
- **Color 3**: imgEllipse7 (cd3c8998-08de-4ea9-b60a-429182691272)
- **Color 4**: imgEllipse8 (d7c7e3a6-4753-486a-beb0-871a8469dd5e)

### 装饰资源
- **分隔线左**: imgVector27 (3e1fcf5b-6789-4d31-bf3e-354115da5c8a)
- **分隔线右**: imgVector28 (14927a93-dc9c-4cd8-b5f4-0b7f6037e2ab)

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

const { write: mintColor } = useContractWrite({
  address: COLOR_NFT_CONTRACT_ADDRESS,
  abi: COLOR_NFT_ABI,
  functionName: 'mint',
});

<ColorPage
  onMintColor={(color) => {
    mintColor({
      args: [color.hex],
      value: parseEther('0.0001'),
    });
  }}
/>
```

### 集成颜色选择器

```tsx
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const [selectedColor, setSelectedColor] = useState('#AD4AFF');

<ColorPage
  selectedColor={{
    hex: selectedColor,
    imageUrl: generateColorImageUrl(selectedColor),
  }}
  onColorSelect={(color) => {
    setSelectedColor(color.hex);
  }}
/>
```

### 集成邀请码验证

```tsx
import { useState } from 'react';

const [invitationCode, setInvitationCode] = useState('');

<ColorPage
  onInvitationCodeSubmit={async (code) => {
    const isValid = await validateInvitationCode(code);
    if (isValid) {
      // 允许免费领取
      await freeReceiveNFT();
    } else {
      alert('Invalid invitation code');
    }
  }}
/>
```

## 🎨 复杂样式说明

### 色轮遮罩

```css
.colorWheelImage {
  mask-image: url('https://www.figma.com/api/mcp/asset/b440c43e-6279-46ac-b2e0-501869ca189c');
  mask-size: 382px 382px;
  mask-position: 43.785px -0.755px;
  mask-repeat: no-repeat;
}
```

### 输入框浮动标签

```css
.invitationInput:focus + .invitationLabel,
.invitationInput:not(:placeholder-shown) + .invitationLabel {
  top: -8px;
  font-size: 10px;
  color: #1ee11f;
}
```

### 导航栏毛玻璃效果

```css
.navbarBackdrop {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(22, 22, 22, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 价格划线效果

```css
.priceOriginal {
  text-decoration: line-through;
  text-decoration-skip-ink: none;
  text-underline-position: from-font;
  color: rgba(255, 255, 255, 0.5);
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
}

@media (max-width: 768px) {
  .container {
    transform: scale(0.5);
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

2. **色轮交互**
   - 添加 Canvas 或 SVG 交互式色轮
   - **建议**: 使用 `react-colorful` 或 `react-color`
   - 实现实时颜色拾取

3. **动画性能**
   - 按钮 hover 效果
   - **建议**: 使用 CSS transforms 而非 width/height
   - 添加 `will-change` 优化

### 可访问性

1. **表单标签**
   - 确保所有 input 有关联的 label
   - 添加 aria-label 属性

2. **键盘导航**
   - 确保所有交互元素可 focus
   - 添加 Tab 键顺序
   - 添加 focus 样式

3. **色彩对比度**
   - 确保文字与背景对比度符合 WCAG 标准
   - 特别注意灰色文字 (#989898)

### 功能增强

1. **颜色预览**
   - 实时预览选中颜色
   - 显示 RGB/HSL 值
   - 颜色历史记录

2. **交易状态**
   - Loading 状态
   - 成功/失败提示
   - Transaction hash 显示

3. **验证**
   - 邀请码格式验证
   - 钱包余额检查
   - Gas fee 估算

## 📝 组件 Props API

### ColorPage

```typescript
interface ColorPageProps {
  className?: string;
  selectedColor?: SelectedColor;
  userColors?: ColorItem[];
  walletAddress?: string;
  price?: {
    current: number;
    original?: number;
    currency: 'ETH' | 'MATIC' | string;
  };
  onMintColor?: (color: SelectedColor) => void;
  onColorSelect?: (color: SelectedColor) => void;
  onInvitationCodeSubmit?: (code: string) => void;
  onFreeReceive?: () => void;
}
```

### 使用示例

```tsx
<ColorPage
  selectedColor={{
    hex: '#AD4AFF',
    imageUrl: 'https://...',
  }}
  userColors={[
    { id: '1', hex: '#592386', imageUrl: 'https://...' },
    { id: '2', hex: '#1ee11f', imageUrl: 'https://...' },
  ]}
  walletAddress="0xF7a1...7BAD"
  price={{
    current: 0.0001,
    original: 0.0006,
    currency: 'ETH',
  }}
  onMintColor={(color) => console.log('Mint:', color)}
  onColorSelect={(color) => console.log('Select:', color)}
  onInvitationCodeSubmit={(code) => console.log('Code:', code)}
  onFreeReceive={() => console.log('Free receive')}
/>
```

## 🎯 后续开发计划

1. **交互式色轮**
   - 集成 react-colorful
   - 实时颜色拾取
   - 触摸/鼠标拖拽支持

2. **智能合约集成**
   - Mint 功能
   - 邀请码验证
   - NFT 元数据生成

3. **用户体验优化**
   - 加载动画
   - 交易状态提示
   - 错误处理

4. **数据持久化**
   - 保存用户选择的颜色
   - 历史记录
   - 收藏功能

## 🔗 相关资源

- [Figma 设计稿](https://www.figma.com/design/PstNpfNzIRD7shqtqVVszd/FemFunk-Nvshu--Copy-?node-id=100-1983)
- [Next.js Image 文档](https://nextjs.org/docs/app/api-reference/components/image)
- [react-colorful](https://github.com/omgovich/react-colorful)
- [RainbowKit](https://www.rainbowkit.com/)
- [wagmi](https://wagmi.sh/)

---

**Created with precision and attention to detail**

> "这是一个简洁而功能强大的颜色 NFT 铸造界面。每个像素、每个颜色值都经过精确计算，完美还原 Figma 设计。这不是妥协，这是像素级完美。"
