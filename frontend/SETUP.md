# 🚀 FemPunk NüShu 设置指南

## 解决 RPC 限制问题

如果遇到 `429 Too Many Requests` 错误，这是因为使用了公共 RPC 端点的请求限制。

### 快速解决方案

1. **获取免费 Alchemy API Key**
   - 访问 [https://www.alchemy.com/](https://www.alchemy.com/)
   - 注册免费账户
   - 创建新的 App，选择 **Ethereum Sepolia** 网络
   - 复制 API Key

2. **配置环境变量**
   ```bash
   # 在项目根目录创建 .env.local 文件
   cp .env.example .env.local
   
   # 编辑 .env.local，添加你的 API Key
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key_here
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

## 完整环境变量配置

```env
# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Smart Contract Addresses
NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_COLOR_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ARTWORK_NFT_CONTRACT_ADDRESS=0x...

# Liveblocks Configuration
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

## 钱包设置

1. **安装 MetaMask**
   - 下载并安装 [MetaMask 浏览器扩展](https://metamask.io/)

2. **添加 Sepolia 测试网络**
   - 网络名称: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   - 链 ID: 11155111
   - 货币符号: ETH

3. **获取测试 ETH**
   - 访问 [Sepolia Faucet](https://sepoliafaucet.com/)
   - 输入你的钱包地址获取测试 ETH

## 故障排除

### 常见错误及解决方案

| 错误 | 解决方案 |
|------|----------|
| `Too Many Requests` | 配置 Alchemy API Key |
| `User rejected` | 用户取消了交易，重新尝试 |
| `Insufficient funds` | 获取更多测试 ETH |
| `Network error` | 检查网络连接，切换网络 |

### 备用 RPC 端点

如果 Alchemy 不可用，系统会自动切换到以下备用端点：
- https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
- https://rpc.sepolia.org
- https://ethereum-sepolia.publicnode.com
- https://sepolia.gateway.tenderly.co

## 开发模式

在开发模式下，系统会自动检查 RPC 端点健康状态：

```javascript
// 手动检查 RPC 健康状态
import { checkAllRPCs } from './lib/utils/rpcHealth';
checkAllRPCs('sepolia');
```

## 需要帮助？

- 点击页面右下角的 ⚙️ 按钮查看设置指南
- 查看浏览器控制台的详细错误信息
- 确保所有环境变量都已正确配置