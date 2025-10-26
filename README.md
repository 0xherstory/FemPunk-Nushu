# FemPunk NüShu - Web3 Collaborative Painting Platform

A Web3-powered collaborative painting platform that celebrates and preserves NüShu (女书) culture through digital art and NFTs.

## 🎨 About

FemPunk NüShu is an innovative platform that combines traditional Chinese NüShu script with modern Web3 technology. Users can collaboratively create digital artworks, mint color NFTs, and participate in a community-driven creative ecosystem.

### Key Features

- **Collaborative Canvas**: Real-time collaborative painting with other users
- **Color NFTs**: Purchase and own unique color tokens for painting
- **Daily Themes**: New creative challenges featuring NüShu characters
- **Community Gallery**: Showcase and purchase community artworks
- **Cultural Preservation**: Learn about NüShu script and women's history

## 🏗️ Project Structure

```
fempunk-nushu/
├── frontend/          # Next.js web application
├── backend/           # Express.js API server
├── contract/          # Smart contracts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask wallet
- PostgreSQL (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AllenWang-Yang/FemPunk-Nushu.git
   cd FemPunk-Nushu
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   **Frontend (.env.local)**
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
   
   **Backend (.env)**
   ```env
   PORT=3001
   DATABASE_URL=postgresql://username:password@localhost:5432/fempunk_nushu
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   ```

4. **Database Setup**
   ```bash
   cd backend
   # Create database and run migrations
   psql -U postgres -c "CREATE DATABASE fempunk_nushu;"
   psql -U postgres -d fempunk_nushu -f db.sql
   psql -U postgres -d fempunk_nushu -f db_initdata.sql
   ```

5. **Start Development Servers**
   
   **Backend**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem, RainbowKit
- **Real-time**: Liveblocks
- **Canvas**: Fabric.js
- **State Management**: Zustand
- **Testing**: Vitest, Testing Library

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL
- **Blockchain**: Ethers.js, Viem
- **Cloud**: AWS SDK
- **Authentication**: Web3 wallet signatures

### Smart Contracts
- **Framework**: OpenZeppelin
- **Network**: Ethereum Sepolia (testnet)

## 🎮 How to Use

1. **Connect Wallet**: Use MetaMask to connect to the platform
2. **Get Test ETH**: Obtain Sepolia testnet ETH from a faucet
3. **Buy Colors**: Purchase color NFTs to paint with
4. **Create Art**: Join daily collaborative painting sessions
5. **Collect**: View and manage your NFT collection

## 🌐 Network Configuration

### Sepolia Testnet
- **Network Name**: Sepolia
- **RPC URL**: `https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`
- **Chain ID**: 11155111
- **Currency**: ETH
- **Faucet**: [Sepolia Faucet](https://sepoliafaucet.com/)

## 📚 API Documentation

### Backend Endpoints

- `GET /api/colors` - Get available colors
- `POST /api/canvas` - Save canvas data
- `GET /api/contributions` - Get user contributions
- `GET /api/revenue` - Get revenue data
- `GET /api/users` - Get user information

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend
```bash
cd backend
# Deploy to your preferred hosting service
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Too Many Requests` | Configure Alchemy API key in environment variables |
| `User rejected` | User cancelled transaction, try again |
| `Insufficient funds` | Get more test ETH from Sepolia faucet |
| `Network error` | Check network connection and switch to Sepolia |

### Getting Help

- Check the [Setup Guide](frontend/SETUP.md) for detailed configuration
- View browser console for detailed error messages
- Ensure all environment variables are properly configured
- Click the ⚙️ settings button in the app for troubleshooting tips

## 🔗 Links

- **Repository**: [GitHub](https://github.com/AllenWang-Yang/FemPunk-Nushu)
- **Issues**: [GitHub Issues](https://github.com/AllenWang-Yang/FemPunk-Nushu/issues)
- **Documentation**: See `frontend/functions.md` for detailed feature specifications

---

**Built with ❤️ for preserving and celebrating NüShu culture through Web3 technology**