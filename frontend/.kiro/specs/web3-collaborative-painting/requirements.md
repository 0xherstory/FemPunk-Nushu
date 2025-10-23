# FemPunk NüShu Web3 协作绘画平台需求文档

## 简介

FemPunk NüShu 是一个基于区块链技术的 Web3 协作绘画平台，专注于传承女书文化。用户可以在每日主题画布上协作创作，购买颜色 NFT 参与绘画，并将完成的作品铸造为 NFT 进行收藏和交易。平台采用简化的页面结构：展示页 → 画布页 → 其他功能页。

## 术语表

- **FemPunk_Platform**: FemPunk NüShu Web3 协作绘画平台系统
- **Exhibition_Page**: 展示页（首页），展示平台介绍和精选作品
- **Canvas_System**: 画布系统，提供协作绘画功能和每日主题
- **Purchase_System**: 购买系统，处理颜色 NFT 购买和兑换码功能
- **Collection_System**: 藏品系统，展示用户的 NFT 资产和参与作品
- **Community_System**: 社区系统，提供联系方式和公众号入口
- **Wallet_Modal**: 钱包连接弹窗，全局组件处理钱包连接
- **Color_NFT**: 颜色 NFT，用户购买后可在画布中使用的颜色代币
- **Daily_Theme**: 每日主题，包含主题名称、描述和对应的女书字
- **Redemption_Code**: 兑换码，用于免费获取颜色 NFT 的代码
- **Navigation_Bar**: 导航栏，固定在画布页及其他功能页顶部

## 需求

### 需求 1: 展示页和平台入口

**用户故事:** 作为一个访客，我希望能够在展示页了解平台功能并查看精选作品，以便决定是否参与创作。

#### 验收标准

1. WHEN 用户访问平台，THE Exhibition_Page SHALL 显示平台名称、介绍和精选作品
2. THE Exhibition_Page SHALL 在首屏显示"进入创作"按钮
3. WHEN 用户向下滚动，THE Exhibition_Page SHALL 显示社区创作藏品网格
4. WHEN 用户点击"进入创作"按钮，THE FemPunk_Platform SHALL 跳转到画布页
5. WHEN 用户点击作品的"购买"按钮，THE FemPunk_Platform SHALL 检查钱包连接状态并处理购买流程

### 需求 2: 协作画布和每日主题

**用户故事:** 作为一个艺术创作者，我希望能够在每日主题画布上与其他用户协作绘画，以便共同创作与女书文化相关的艺术作品。

#### 验收标准

1. WHEN 用户进入画布页，THE Canvas_System SHALL 显示当前每日主题和对应的女书字
2. THE Canvas_System SHALL 在左侧显示协作画布区域
3. THE Canvas_System SHALL 在右侧显示今日主题信息和女书字介绍
4. WHEN 用户未连接钱包，THE Canvas_System SHALL 在"我的颜色"区域显示"连接钱包获取随机颜色"提示
5. WHEN 用户已连接钱包，THE Canvas_System SHALL 显示用户拥有的颜色选择器

### 需求 3: 导航系统

**用户故事:** 作为一个用户，我希望能够在不同功能页面之间自由切换，以便使用平台的各项功能。

#### 验收标准

1. THE Exhibition_Page SHALL 不显示导航栏
2. WHEN 用户进入画布页，THE Navigation_Bar SHALL 固定显示在页面顶部
3. THE Navigation_Bar SHALL 包含画布、购买、藏品、社区四个导航选项
4. WHEN 用户点击导航选项，THE FemPunk_Platform SHALL 切换到对应页面
5. THE Navigation_Bar SHALL 在画布页、购买页、藏品页、社区页之间保持一致

### 需求 4: 颜色 NFT 购买系统

**用户故事:** 作为一个艺术创作者，我希望能够购买颜色 NFT 或使用兑换码获取颜色，以便在绘画中使用更多颜色选择。

#### 验收标准

1. THE Purchase_System SHALL 显示当日颜色 NFT 价格和价格浮动信息
2. THE Purchase_System SHALL 提供颜色选择网格供用户选择
3. WHEN 用户选择颜色并点击购买，THE Purchase_System SHALL 检查钱包连接状态
4. THE Purchase_System SHALL 提供兑换码输入功能
5. WHEN 用户输入兑换码并点击兑换，THE Purchase_System SHALL 验证兑换码并发放对应颜色 NFT

### 需求 5: 用户藏品管理

**用户故事:** 作为一个用户，我希望能够查看我拥有的颜色 NFT 和参与的作品，以便管理我的数字资产。

#### 验收标准

1. WHEN 用户进入藏品页，THE Collection_System SHALL 检查钱包连接状态
2. THE Collection_System SHALL 显示用户拥有的所有颜色 NFT
3. THE Collection_System SHALL 显示用户参与的作品信息
4. THE Collection_System SHALL 显示当前参与作品的结算倒计时
5. WHERE 用户未连接钱包，THE Collection_System SHALL 触发钱包连接弹窗

### 需求 6: 社区和联系功能

**用户故事:** 作为一个用户，我希望能够关注平台公众号并获取联系方式，以便获得最新活动信息和申请邀请码。

#### 验收标准

1. THE Community_System SHALL 显示"开发中"状态提示
2. THE Community_System SHALL 显示公众号二维码
3. THE Community_System SHALL 提供联系信息和商务合作说明
4. THE Community_System SHALL 引导用户通过公众号联系平台
5. THE Community_System SHALL 提供返回画布的导航选项

### 需求 7: 钱包连接管理

**用户故事:** 作为一个用户，我希望能够在需要时连接钱包，以便使用平台的 Web3 功能。

#### 验收标准

1. WHEN 用户在展示页点击作品购买且未连接钱包，THE Wallet_Modal SHALL 弹出连接选项
2. WHEN 用户在购买页点击购买或兑换且未连接钱包，THE Wallet_Modal SHALL 弹出连接选项
3. WHEN 用户进入藏品页且未连接钱包，THE Wallet_Modal SHALL 弹出连接选项
4. THE Wallet_Modal SHALL 提供连接钱包和取消选项
5. WHEN 钱包连接成功，THE Wallet_Modal SHALL 关闭并继续之前的操作

### 需求 8: 支付和交易流程

**用户故事:** 作为一个用户，我希望能够使用 ETH 购买颜色 NFT 和艺术作品，以便参与平台的经济活动。

#### 验收标准

1. THE FemPunk_Platform SHALL 支持 ETH 支付
2. WHEN 用户购买颜色 NFT，THE Purchase_System SHALL 唤起 MetaMask 支付
3. WHEN 用户购买艺术作品，THE FemPunk_Platform SHALL 执行智能合约转账
4. WHEN 支付成功，THE FemPunk_Platform SHALL 显示购买成功提示并更新用户资产
5. IF 交易失败，THEN THE FemPunk_Platform SHALL 显示错误信息

### 需求 9: 实时协作绘画

**用户故事:** 作为一个艺术创作者，我希望能够与其他用户实时协作绘画，以便共同创作独特的艺术作品。

#### 验收标准

1. WHEN 用户在画布上绘画，THE Canvas_System SHALL 实时同步操作到所有协作者
2. WHILE 多个用户同时绘画，THE Canvas_System SHALL 显示每个用户的操作
3. WHEN 用户选择颜色，THE Canvas_System SHALL 验证用户是否拥有该颜色 NFT
4. THE Canvas_System SHALL 支持画笔工具和颜色切换功能
5. THE Canvas_System SHALL 记录用户的绘画贡献度用于后续结算