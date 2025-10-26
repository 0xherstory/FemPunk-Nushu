// Smart Contract ABIs for FemPunk NüShu Platform

export const ColorNFTABI = [
  // ERC721 Standard Functions
  {
    inputs: [{ name: "to", type: "address" }, { name: "tokenId", type: "uint256" }],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  
  // Custom Color NFT Functions
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "colorHex", type: "string" },
      { name: "price", type: "uint256" }
    ],
    name: "mintColor",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "colorHex", type: "string" }],
    name: "purchaseColor",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "getOwnedColors",
    outputs: [
      {
        components: [
          { name: "tokenId", type: "uint256" },
          { name: "colorHex", type: "string" },
          { name: "price", type: "uint256" },
          { name: "mintedAt", type: "uint256" }
        ],
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAvailableColors",
    outputs: [
      {
        components: [
          { name: "colorHex", type: "string" },
          { name: "price", type: "uint256" },
          { name: "available", type: "bool" }
        ],
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "code", type: "string" }],
    name: "redeemColor",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "colorHex", type: "string" },
      { indexed: false, name: "price", type: "uint256" }
    ],
    name: "ColorMinted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "buyer", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "colorHex", type: "string" },
      { indexed: false, name: "price", type: "uint256" }
    ],
    name: "ColorPurchased",
    type: "event"
  }
] as const;

export const ArtworkNFTABI = [
  // ERC721 Standard Functions
  {
    inputs: [{ name: "to", type: "address" }, { name: "tokenId", type: "uint256" }],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },

  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Custom Artwork NFT Functions
  {
    inputs: [
      { name: "canvasData", type: "string" },
      { name: "contributors", type: "address[]" },
      { name: "contributions", type: "uint256[]" },
      { name: "dailyThemeId", type: "string" }
    ],
    name: "mintArtwork",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getArtworkDetails",
    outputs: [
      {
        components: [
          { name: "canvasData", type: "string" },
          { name: "contributors", type: "address[]" },
          { name: "contributions", type: "uint256[]" },
          { name: "dailyThemeId", type: "string" },
          { name: "mintedAt", type: "uint256" },
          { name: "price", type: "uint256" }
        ],
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "contributor", type: "address" }],
    name: "getContributorArtworks",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "contributors", type: "address[]" },
      { indexed: false, name: "dailyThemeId", type: "string" }
    ],
    name: "ArtworkMinted",
    type: "event"
  }
] as const;

// FemCanvasRevenue Contract ABI
export const FemCanvasRevenueABI = [
  {
    inputs: [{ name: "canvasId", type: "uint256" }],
    name: "receiveRevenue",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "canvasId", type: "uint256" }],
    name: "distributeRevenue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "canvasId", type: "uint256" }],
    name: "claimRevenue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "canvasId", type: "uint256" },
      { name: "contributor", type: "address" }
    ],
    name: "getClaimableAmount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "canvasId", type: "uint256" }],
    name: "getCanvasRevenueStatus",
    outputs: [
      { name: "totalRevenue", type: "uint256" },
      { name: "distributed", type: "bool" },
      { name: "contributorsCount", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "canvasId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    name: "RevenueReceived",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "canvasId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "contributorsCount", type: "uint256" }
    ],
    name: "RevenueDistributed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "canvasId", type: "uint256" },
      { indexed: true, name: "contributor", type: "address" },
      { indexed: false, name: "amount", type: "uint256" }
    ],
    name: "RevenueClaimed",
    type: "event"
  }
] as const;

// Contract Addresses (will be configured per environment)
export const CONTRACT_ADDRESSES = {
  sepolia: {
    colorNFT: '0x0000000000000000000000000000000000000000', // To be deployed
    artworkNFT: '0x0000000000000000000000000000000000000000', // To be deployed
    femCanvasRevenue: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  },
  mainnet: {
    colorNFT: '0x0000000000000000000000000000000000000000', // To be deployed
    artworkNFT: '0x0000000000000000000000000000000000000000', // To be deployed
    femCanvasRevenue: process.env.NEXT_PUBLIC_REVENUE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  }
} as const;

// Type definitions for contract interactions
export type ColorNFTContract = {
  address: `0x${string}`;
  abi: typeof ColorNFTABI;
};

export type ArtworkNFTContract = {
  address: `0x${string}`;
  abi: typeof ArtworkNFTABI;
};