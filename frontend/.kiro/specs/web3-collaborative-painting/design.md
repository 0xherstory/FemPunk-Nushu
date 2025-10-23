# FemPunk NüShu Web3 协作绘画平台设计文档

## 概览

基于 Next.js 14 (App Router) + React 18 的 Web3 协作绘画平台，专注于传承女书文化的数字艺术创作。采用现代化的前端技术栈，结合区块链和实时协作技术，为用户提供流畅的创作体验。

## 架构设计

### 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    用户界面层 (UI Layer)                  │
│  Next.js 14 App Router + React 18 + Tailwind CSS      │
│  页面组件: Exhibition, Canvas, Purchase, Collection     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                   业务逻辑层 (Business Layer)             │
│  React Context + Zustand Store + Custom Hooks         │
│  状态管理: Wallet, Colors, Canvas, User Data           │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                   服务层 (Service Layer)                 │
│  Web3: wagmi v2 + viem + RainbowKit                   │
│  协作: Liveblocks + Fabric.js                          │
│  API: Next.js API Routes + tRPC                       │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                   数据层 (Data Layer)                    │
│  区块链: Ethereum (Sepolia → Mainnet)                  │
│  存储: IPFS + Supabase/PostgreSQL                     │
│  实时: Liveblocks Cloud                                │
└─────────────────────────────────────────────────────────┘
```

## 技术选型对比与决策

### 前端框架选择

| 技术栈 | 优势 | 劣势 | 选择理由 |
|--------|------|------|----------|
| **Next.js 14 App Router** ✅ | SSR/SSG支持、优秀的开发体验、内置优化 | 学习曲线、App Router较新 | **选择**: 现代化架构，SEO友好，适合Web3应用 |
| Vite + React | 快速开发、轻量级 | 需要额外配置SSR | 不选择: 缺少内置SSR支持 |
| Create React App | 简单易用 | 已不推荐、配置受限 | 不选择: 已过时 |

### 样式方案选择

| 方案 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **Tailwind CSS** ✅ | 快速开发、一致性好、体积小 | 类名冗长 | **选择**: 快速原型开发，与设计系统契合 |
| CSS Modules | 作用域隔离、灵活性高 | 需要更多样板代码 | 备选: 复杂组件时使用 |
| Styled Components | 动态样式、主题支持 | 运行时开销 | 不选择: 性能考虑 |
### Web3
 技术栈选择

| 技术 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **wagmi v2 + viem** ✅ | TypeScript原生、现代化API、性能优秀 | 相对较新 | **选择**: 最佳的React Web3开发体验 |
| **RainbowKit** ✅ | 美观的钱包连接UI、多钱包支持 | 依赖wagmi | **选择**: 与wagmi完美集成 |
| ethers.js | 成熟稳定、文档丰富 | 体积较大、API较老 | 不选择: viem性能更好 |
| web3.js | 历史悠久 | API设计较老、TypeScript支持不佳 | 不选择: 开发体验不如wagmi |

### 实时协作技术选择

| 技术 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **Liveblocks** ✅ | 专为协作设计、易于集成、性能优秀 | 商业服务、成本 | **选择**: 专业的协作解决方案 |
| Yjs | 开源、CRDT算法、离线支持 | 复杂度高、需要自建服务 | 不选择: 开发成本高 |
| Socket.io | 灵活性高、自主控制 | 需要处理冲突解决 | 不选择: 协作逻辑复杂 |

### 画布渲染技术选择

| 技术 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **Fabric.js** ✅ | 功能丰富、对象模型、事件系统 | 体积较大 | **选择**: 适合复杂绘画功能 |
| Canvas API | 原生、性能好、轻量 | 需要大量底层实现 | 不选择: 开发成本高 |
| Konva.js | 2D性能优秀、React集成 | 学习成本 | 备选: 性能要求极高时考虑 |

## 核心依赖与版本

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    
    "tailwindcss": "^3.3.0",
    "@tailwindcss/forms": "^0.5.0",
    
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    
    "@liveblocks/client": "^1.8.0",
    "@liveblocks/react": "^1.8.0",
    "fabric": "^5.3.0",
    
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.16.0",
    
    "zod": "^3.22.0",
    "react-hook-form": "^7.47.0"
  }
}
```

## 环境与网络配置

### 开发环境
- **测试网络**: Sepolia Testnet
- **RPC**: Alchemy/Infura Sepolia endpoint
- **测试代币**: Sepolia ETH (免费获取)
- **合约部署**: Remix + Hardhat

### 生产环境
- **主网络**: Ethereum Mainnet
- **RPC**: 多节点负载均衡 (Alchemy + Infura + QuickNode)
- **CDN**: Vercel Edge Network
- **监控**: Sentry + Web3 transaction monitoring

## 工程假设

1. **用户设备**: 现代浏览器 (Chrome 90+, Safari 14+, Firefox 88+)
2. **网络环境**: 稳定的互联网连接，支持WebSocket
3. **钱包支持**: MetaMask为主要钱包，支持WalletConnect协议
4. **画布尺寸**: 固定尺寸画布 (800x600px)，适配移动端
5. **并发用户**: 单个画布最多50个同时在线用户
6. **颜色数量**: 预设64种颜色，每种颜色限量发行
7. **存储方案**: 画布数据存储在Liveblocks，最终作品存储到IPFS
8. **支付方式**: 仅支持ETH支付，价格以ETH计价
9. **移动端**: 响应式设计，支持触摸绘画
10. **国际化**: 初期支持中英双语

## 组件架构设计

### 页面组件规划

#### 1. 展示页 (`/` - Exhibition Page)

**主要组件:**
- `HeroSection`: 平台介绍和精选作品展示
- `ArtworkGrid`: 社区作品网格展示
- `ArtworkCard`: 单个作品卡片组件

**职责:**
- 展示平台品牌和核心价值
- 吸引用户进入创作流程
- 提供作品浏览和购买入口

**Props:**
```typescript
interface ExhibitionPageProps {
  featuredArtwork: Artwork;
  communityArtworks: Artwork[];
  isLoading?: boolean;
}
```

**内部状态:**
- `selectedArtwork`: 当前查看的作品
- `showPurchaseModal`: 购买弹窗显示状态

**依赖的上下文/Store:**
- `WalletContext`: 钱包连接状态
- `ArtworkStore`: 作品数据管理

**关键交互:**
- 点击"进入创作"跳转到画布页
- 点击作品卡片触发购买流程
- 滚动加载更多作品

**测试点:**
- 作品数据正确渲染
- 购买流程钱包检查
- 响应式布局适配
- 加载状态处理#
### 2. 画布页 (`/canvas` - Canvas Page)

**主要组件:**
- `CollaborativeCanvas`: 协作画布核心组件
- `ColorPalette`: 颜色选择器
- `DailyTheme`: 每日主题展示
- `NushuCharacter`: 女书字展示
- `NavigationBar`: 顶部导航栏

**职责:**
- 提供实时协作绘画功能
- 展示每日主题和女书文化
- 管理用户绘画权限和颜色使用

**Props:**
```typescript
interface CanvasPageProps {
  dailyTheme: DailyTheme;
  canvasId: string;
  initialCanvasState?: CanvasState;
}

interface CollaborativeCanvasProps {
  canvasId: string;
  userColors: Color[];
  onColorSelect: (color: Color) => void;
  isReadOnly?: boolean;
}
```

**内部状态:**
- `selectedColor`: 当前选中的绘画颜色
- `brushSize`: 画笔大小
- `isDrawing`: 绘画状态
- `canvasHistory`: 画布历史记录 (用于撤销/重做)

**依赖的上下文/Store:**
- `LiveblocksProvider`: 实时协作状态
- `WalletContext`: 钱包连接和用户身份
- `ColorStore`: 用户拥有的颜色NFT
- `CanvasStore`: 画布状态管理

**关键交互:**
- 鼠标/触摸绘画操作
- 颜色选择和权限验证
- 实时同步其他用户操作
- 导航栏页面切换

**测试点:**
- 绘画操作实时同步
- 颜色权限验证
- 画布状态持久化
- 多用户并发绘画
- 移动端触摸支持

#### 3. 购买页 (`/buy` - Purchase Page)

**主要组件:**
- `PriceDisplay`: 当日价格展示
- `ColorGrid`: 颜色选择网格
- `PurchaseButton`: 购买按钮
- `RedemptionCodeInput`: 兑换码输入组件

**职责:**
- 展示颜色NFT价格和可购买颜色
- 处理颜色购买和兑换码兑换
- 管理购买流程和支付状态

**Props:**
```typescript
interface PurchasePageProps {
  availableColors: Color[];
  currentPrice: Price;
  priceHistory?: Price[];
}

interface ColorGridProps {
  colors: Color[];
  selectedColors: string[];
  onColorSelect: (colorId: string) => void;
  maxSelection?: number;
}
```

**内部状态:**
- `selectedColors`: 选中的颜色列表
- `redemptionCode`: 兑换码输入值
- `purchaseStatus`: 购买状态 (idle, pending, success, error)
- `transactionHash`: 交易哈希

**依赖的上下文/Store:**
- `WalletContext`: 钱包连接和支付
- `ColorStore`: 颜色NFT管理
- `PriceStore`: 价格数据

**关键交互:**
- 颜色选择和取消选择
- 购买按钮触发支付流程
- 兑换码输入和验证
- 钱包连接检查

**测试点:**
- 颜色选择状态管理
- 购买流程完整性
- 兑换码验证逻辑
- 支付成功/失败处理
- 价格数据更新

#### 4. 藏品页 (`/collection` - Collection Page)

**主要组件:**
- `ColorNFTGrid`: 颜色NFT展示网格
- `ParticipatedArtworks`: 参与作品列表
- `ContributionStats`: 贡献度统计

**职责:**
- 展示用户拥有的颜色NFT
- 显示用户参与的协作作品
- 提供NFT管理和查看功能

**Props:**
```typescript
interface CollectionPageProps {
  userAddress: string;
}

interface ColorNFTGridProps {
  colorNFTs: ColorNFT[];
  onNFTClick?: (nft: ColorNFT) => void;
}

interface ParticipatedArtworksProps {
  artworks: ParticipatedArtwork[];
  contributions: ContributionRecord[];
}
```

**内部状态:**
- `selectedNFT`: 当前选中的NFT
- `showNFTDetails`: NFT详情弹窗状态
- `contributionFilter`: 贡献度筛选条件

**依赖的上下文/Store:**
- `WalletContext`: 用户钱包地址
- `ColorStore`: 用户颜色NFT数据
- `ArtworkStore`: 参与作品数据
- `ContributionStore`: 贡献度记录

**关键交互:**
- NFT卡片点击查看详情
- 作品卡片点击查看作品
- 贡献度统计展示
- 钱包连接状态检查

**测试点:**
- NFT数据正确加载
- 贡献度计算准确性
- 钱包连接状态处理
- 空状态展示
- NFT详情弹窗功能#### 5. 社
区页 (`/community` - Community Page)

**主要组件:**
- `DevelopmentPlaceholder`: 开发中占位组件
- `QRCodeDisplay`: 公众号二维码展示
- `ContactInfo`: 联系信息组件

**职责:**
- 提供社区联系入口
- 展示公众号二维码
- 引导用户关注和联系

**Props:**
```typescript
interface CommunityPageProps {
  qrCodeUrl: string;
  contactInfo: ContactInfo;
}

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  title: string;
  description: string;
}
```

**内部状态:**
- `qrCodeLoaded`: 二维码加载状态

**依赖的上下文/Store:**
- 无特殊依赖，主要为静态展示

**关键交互:**
- 二维码扫描引导
- 返回画布按钮
- 联系信息展示

**测试点:**
- 二维码正确显示
- 联系信息准确性
- 返回导航功能
- 响应式布局

#### 6. 全局钱包弹窗 (`WalletModal`)

**主要组件:**
- `WalletConnectModal`: 钱包连接弹窗
- `WalletButton`: 钱包选择按钮
- `ConnectionStatus`: 连接状态显示

**职责:**
- 处理钱包连接流程
- 提供多钱包选择
- 管理连接状态和错误处理

**Props:**
```typescript
interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (address: string) => void;
  trigger?: 'purchase' | 'collection' | 'manual';
}

interface WalletButtonProps {
  walletId: string;
  name: string;
  icon: string;
  onClick: () => void;
  isConnecting?: boolean;
}
```

**内部状态:**
- `isConnecting`: 连接进行状态
- `connectionError`: 连接错误信息
- `selectedWallet`: 选中的钱包类型

**依赖的上下文/Store:**
- `WalletContext`: 钱包连接状态管理
- `RainbowKit`: 钱包连接服务

**关键交互:**
- 钱包类型选择
- 连接确认和取消
- 错误状态处理
- 连接成功后的回调

**测试点:**
- 多钱包支持
- 连接成功/失败处理
- 弹窗开关状态
- 错误信息展示
- 连接后状态更新

## 数据模型设计

### 核心数据类型

```typescript
// 颜色NFT
interface ColorNFT {
  id: string;
  colorHex: string;
  tokenId: number;
  owner: string;
  mintedAt: Date;
  price: bigint;
}

// 每日主题
interface DailyTheme {
  id: string;
  date: string;
  title: string;
  titleEn: string;
  description: string;
  nushuCharacter: {
    character: string;
    meaning: string;
    pronunciation: string;
  };
}

// 艺术作品
interface Artwork {
  id: string;
  title: string;
  canvasData: string; // Base64 encoded canvas
  contributors: Contributor[];
  createdAt: Date;
  mintedAt?: Date;
  nftTokenId?: number;
  price?: bigint;
  dailyTheme: DailyTheme;
}

// 贡献者信息
interface Contributor {
  address: string;
  contribution: number; // 0-100 percentage
  strokeCount: number;
  timeSpent: number; // seconds
}

// 画布状态
interface CanvasState {
  objects: fabric.Object[];
  version: number;
  lastModified: Date;
  activeUsers: ActiveUser[];
}

// 活跃用户
interface ActiveUser {
  address: string;
  cursor: { x: number; y: number };
  selectedColor: string;
  isDrawing: boolean;
}
```

## 错误处理策略

### 网络错误
- 自动重试机制 (指数退避)
- 离线状态检测和提示
- 降级到只读模式

### 钱包错误
- 连接失败重试
- 交易失败详细提示
- 网络切换引导

### 协作冲突
- Liveblocks自动冲突解决
- 操作队列和重放机制
- 用户操作撤销功能

### 数据一致性
- 乐观更新 + 回滚
- 定期状态同步
- 版本控制和冲突检测

## 性能优化策略

### 前端优化
- React.memo 和 useMemo 优化渲染
- 虚拟滚动处理大量作品
- 图片懒加载和压缩
- 代码分割和动态导入

### 画布优化
- Fabric.js 对象池复用
- 画布区域裁剪渲染
- 操作防抖和节流
- WebGL 加速 (如果支持)

### Web3 优化
- 批量查询减少RPC调用
- 本地缓存合约数据
- 交易状态轮询优化
- Gas 费用估算和优化

## 安全考虑

### 前端安全
- XSS 防护 (CSP 策略)
- 输入验证和清理
- 敏感数据不存储在localStorage

### Web3 安全
- 合约地址白名单验证
- 交易参数二次确认
- 私钥永不接触前端
- 钓鱼网站防护提示

### 数据安全
- HTTPS 强制使用
- API 请求签名验证
- 用户数据最小化收集
## Fig
ma 设计系统集成

### 设计资源提取和使用

基于您提供的 Figma 设计稿 (https://www.figma.com/design/5bpFIQUuW5FSysDUu42Opr/FemFunk-Nvshu?node-id=70-1809&t=cM0uDJ0pyn5mYbqz-4)，以下是将设计转换为代码的具体方案：

#### 1. 设计令牌 (Design Tokens) 提取

**颜色系统:**
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 从 Figma 提取的品牌色彩
        primary: {
          50: '#fef7ff',
          100: '#fdeeff', 
          500: '#d946ef', // 主品牌色
          600: '#c026d3',
          700: '#a21caf',
        },
        nushu: {
          red: '#ff6b9d',    // 女书主题红
          gold: '#ffd700',   // 女书金色
          ink: '#2d3748',    // 墨色
        },
        canvas: {
          bg: '#fafafa',     // 画布背景
          grid: '#e2e8f0',   // 网格线
        }
      },
      fontFamily: {
        // 从 Figma 获取的字体
        'nushu': ['NuShu', 'serif'],
        'brand': ['Inter', 'sans-serif'],
      }
    }
  }
}
```

**间距和尺寸:**
```typescript
// 从 Figma 提取的设计规范
export const spacing = {
  xs: '4px',
  sm: '8px', 
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
} as const;
```

#### 2. 组件样式映射

**按钮组件 (基于 Figma Button 组件):**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
}

const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-white border-2 border-primary-500 text-primary-500',
  ghost: 'bg-transparent hover:bg-primary-50 text-primary-500',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base', 
  lg: 'px-6 py-3 text-lg',
};
```

**卡片组件 (基于 Figma Card 组件):**
```typescript
// components/ui/Card.tsx
const Card = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-white rounded-lg shadow-sm border border-gray-200',
    artwork: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow',
    nft: 'bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg border border-primary-200',
  };
  
  return (
    <div className={cn(variants[variant], 'p-4')}>
      {children}
    </div>
  );
};
```

#### 3. 图标和插图集成

**SVG 图标提取:**
```typescript
// 从 Figma 导出 SVG 图标并创建 React 组件
// components/icons/index.tsx
export const PaintBrushIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    {/* 从 Figma 复制的 SVG 路径 */}
    <path d="M..." fill="currentColor" />
  </svg>
);

export const NushuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    {/* 女书字符 SVG */}
    <path d="M..." fill="currentColor" />
  </svg>
);
```

**插图和背景图片:**
```typescript
// 从 Figma 导出高质量图片资源
// public/images/
// - hero-artwork.png (首页精选作品)
// - nushu-characters/ (女书字符图片)
// - backgrounds/ (背景纹理)

// 在组件中使用
import Image from 'next/image';

const HeroSection = () => (
  <div className="relative">
    <Image
      src="/images/hero-artwork.png"
      alt="Featured Artwork"
      width={800}
      height={600}
      className="rounded-xl"
    />
  </div>
);
```

#### 4. 响应式断点 (基于 Figma 设计稿)

```typescript
// tailwind.config.js - 根据 Figma 设计稿的断点
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // 移动端
      'md': '768px',   // 平板
      'lg': '1024px',  // 桌面
      'xl': '1280px',  // 大屏
    }
  }
}
```

#### 5. 动画和过渡效果

```typescript
// 基于 Figma 原型中的动画
// components/ui/animations.ts
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100 }
};
```

### 设计系统实施流程

#### 阶段 1: 设计资源提取 (使用 Figma Dev MCP)
1. **配置 Figma Dev MCP**
   - 安装和配置 Figma Dev MCP 服务
   - 获取 Figma 文件访问权限和 API token
   - 连接到您的 Figma 设计文件

2. **自动化资源提取**
   - 使用 MCP 自动提取所有设计令牌 (颜色、字体、间距)
   - 批量导出 SVG 图标和矢量元素
   - 提取组件规范和变体定义
   - 自动生成 TypeScript 类型定义

2. **创建设计令牌文件**
   - 建立 `tokens/` 目录存放设计令牌
   - 创建 TypeScript 类型定义确保类型安全
   - 配置 Tailwind CSS 使用这些令牌

#### 阶段 2: 基础组件开发
1. **UI 组件库搭建**
   - 基于 Figma 组件创建对应的 React 组件
   - 实现组件的所有变体 (variants) 和状态
   - 添加 Storybook 文档和测试

2. **布局组件实现**
   - 根据 Figma 页面布局创建 Layout 组件
   - 实现响应式网格系统
   - 确保移动端适配

#### 阶段 3: 页面级组件集成
1. **页面组件开发**
   - 严格按照 Figma 设计稿实现每个页面
   - 保持像素级精确度 (在合理范围内)
   - 实现所有交互状态和动画

2. **设计一致性检查**
   - 使用 Chromatic 或类似工具进行视觉回归测试
   - 确保所有组件符合设计规范
   - 跨浏览器兼容性测试

### 开发工具和工作流

#### Figma Dev MCP 集成工具链
```bash
# Figma Dev MCP 配置
# 在 .kiro/settings/mcp.json 中配置
{
  "mcpServers": {
    "figma-dev": {
      "command": "uvx",
      "args": ["figma-dev-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_figma_token",
        "FIGMA_FILE_KEY": "5bpFIQUuW5FSysDUu42Opr"
      }
    }
  }
}

# 辅助开发工具
npm install --save-dev @figma/code-connect
npm install --save-dev @storybook/addon-design-tokens
```

#### 设计同步工作流
1. **设计更新检测**: 使用 Figma webhooks 监听设计变更
2. **自动化资源同步**: 脚本自动拉取更新的图标和图片
3. **设计审查流程**: PR 中包含设计对比截图
4. **视觉测试**: 自动化截图对比确保实现准确性

### 质量保证

#### 设计还原度检查清单
- [ ] 颜色使用符合设计规范 (使用 design tokens)
- [ ] 字体大小和行高匹配 Figma 规范
- [ ] 间距和布局精确还原
- [ ] 组件状态 (hover, active, disabled) 完整实现
- [ ] 响应式行为符合设计预期
- [ ] 动画和过渡效果流畅自然
- [ ] 图标和插图清晰度良好
- [ ] 无障碍性符合 WCAG 标准

这样的集成方案确保了开发团队能够高效地将您的 Figma 设计转换为高质量的代码实现，同时保持设计的一致性和完整性。
## 
Figma Dev MCP 使用指南

### MCP 配置步骤

1. **获取 Figma 访问权限**
   ```bash
   # 1. 在 Figma 中生成 Personal Access Token
   # 2. 从 URL 中提取 File Key: 5bpFIQUuW5FSysDUu42Opr
   # 3. 确保对设计文件有查看权限
   ```

2. **配置 MCP 服务器**
   ```json
   // .kiro/settings/mcp.json
   {
     "mcpServers": {
       "figma-dev": {
         "command": "uvx",
         "args": ["figma-dev-mcp@latest"],
         "env": {
           "FIGMA_ACCESS_TOKEN": "figd_your_token_here",
           "FIGMA_FILE_KEY": "5bpFIQUuW5FSysDUu42Opr"
         },
         "disabled": false,
         "autoApprove": ["get_file", "get_components", "export_images"]
       }
     }
   }
   ```

### MCP 命令使用示例

#### 1. 提取设计令牌
```typescript
// 使用 MCP 提取颜色系统
const colors = await mcp.call('get_styles', {
  file_key: '5bpFIQUuW5FSysDUu42Opr',
  style_type: 'FILL'
});

// 自动生成 Tailwind 配置
const tailwindColors = colors.reduce((acc, color) => {
  acc[color.name.toLowerCase()] = color.value;
  return acc;
}, {});
```

#### 2. 批量导出图标
```typescript
// 提取所有图标组件
const icons = await mcp.call('get_components', {
  file_key: '5bpFIQUuW5FSysDUu42Opr',
  component_type: 'ICON'
});

// 批量导出 SVG
for (const icon of icons) {
  const svg = await mcp.call('export_image', {
    file_key: '5bpFIQUuW5FSysDUu42Opr',
    node_id: icon.node_id,
    format: 'svg',
    scale: 1
  });
  
  // 保存到 components/icons/
  await fs.writeFile(`./components/icons/${icon.name}.svg`, svg);
}
```

#### 3. 提取组件规范
```typescript
// 获取按钮组件的所有变体
const buttonComponent = await mcp.call('get_component_details', {
  file_key: '5bpFIQUuW5FSysDUu42Opr',
  component_name: 'Button'
});

// 自动生成 React 组件模板
const componentTemplate = generateReactComponent(buttonComponent);
```

#### 4. 提取文本样式
```typescript
// 获取所有文本样式
const textStyles = await mcp.call('get_styles', {
  file_key: '5bpFIQUuW5FSysDUu42Opr',
  style_type: 'TEXT'
});

// 生成 CSS 类
const cssClasses = textStyles.map(style => ({
  name: style.name,
  fontSize: style.fontSize,
  fontWeight: style.fontWeight,
  lineHeight: style.lineHeight,
  letterSpacing: style.letterSpacing
}));
```

### 自动化工作流

#### 设计同步脚本
```typescript
// scripts/sync-figma-design.ts
import { FigmaMCP } from './figma-mcp-client';

async function syncDesignSystem() {
  const figma = new FigmaMCP();
  
  // 1. 提取设计令牌
  const tokens = await figma.extractDesignTokens();
  await generateTailwindConfig(tokens);
  
  // 2. 导出图标
  const icons = await figma.exportIcons();
  await saveIconComponents(icons);
  
  // 3. 提取组件规范
  const components = await figma.extractComponents();
  await generateComponentTemplates(components);
  
  // 4. 导出图片资源
  const images = await figma.exportImages();
  await optimizeAndSaveImages(images);
  
  console.log('✅ Figma 设计系统同步完成');
}
```

#### CI/CD 集成
```yaml
# .github/workflows/figma-sync.yml
name: Sync Figma Design
on:
  schedule:
    - cron: '0 9 * * 1' # 每周一上午9点
  workflow_dispatch:

jobs:
  sync-design:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Sync Figma Design
        env:
          FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_TOKEN }}
        run: npm run sync:figma
      
      - name: Create PR if changes
        uses: peter-evans/create-pull-request@v5
        with:
          title: '🎨 Update design system from Figma'
          body: 'Automated sync of design tokens and assets from Figma'
```

### 质量保证和验证

#### 设计一致性检查
```typescript
// 验证提取的设计令牌
function validateDesignTokens(tokens: DesignTokens) {
  const checks = [
    () => tokens.colors.length > 0,
    () => tokens.typography.length > 0,
    () => tokens.spacing.length > 0,
    () => tokens.borderRadius.length > 0,
  ];
  
  return checks.every(check => check());
}

// 图标质量检查
function validateIcons(icons: IconAsset[]) {
  return icons.every(icon => 
    icon.svg.includes('<svg') && 
    icon.svg.includes('viewBox') &&
    !icon.svg.includes('undefined')
  );
}
```

### 使用 MCP 的优势

1. **准确性**: 直接从 Figma API 获取数据，避免手动导出错误
2. **自动化**: 可以设置定时同步，保持设计和代码一致
3. **完整性**: 能够提取所有设计元素，包括隐藏的样式和组件
4. **类型安全**: 自动生成 TypeScript 类型定义
5. **版本控制**: 可以跟踪设计变更历史

通过 Figma Dev MCP，您可以确保开发过程中完全准确地使用 Figma 中的所有设计元素，实现真正的设计-开发一体化工作流。