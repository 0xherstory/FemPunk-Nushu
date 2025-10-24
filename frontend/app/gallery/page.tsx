'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { WalletModal } from '../../components/wallet/WalletModal';
import { useWalletModal } from '../../lib/hooks/useWalletModal';
import styles from './page.module.css';
import { ArtworkItem } from './gallery-types';

export default function GalleryPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { modalState, openModal: openWalletModal, closeModal: closeWalletModal } = useWalletModal();

  // Mock artworks data
  const artworks: ArtworkItem[] = [
    {
      id: '1',
      title: 'Spring Garden',
      day: 24,
      theme: 'Spring Garden',
      imageUrl: 'https://www.figma.com/api/mcp/asset/16e58fce-0456-4b6c-951b-f2d13665549a',
      status: 'painting',
      participants: 100,
      colors: [],
      colorPaletteImageUrl: 'https://www.figma.com/api/mcp/asset/bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1',
    },
    {
      id: '2',
      title: 'Spring Garden',
      day: 23,
      theme: 'Spring Garden',
      imageUrl: 'https://www.figma.com/api/mcp/asset/a7ab02df-9d13-41ca-9834-b99adff1817e',
      status: 'mint',
      participants: 100,
      price: 0.24,
      currency: 'ETH',
      colors: [],
      colorPaletteImageUrl: 'https://www.figma.com/api/mcp/asset/bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1',
    },
    {
      id: '3',
      title: 'Spring Garden',
      day: 22,
      theme: 'Spring Garden',
      imageUrl: 'https://www.figma.com/api/mcp/asset/1f978205-a23b-4e28-bfd9-6ed2391e28c9',
      status: 'buy',
      participants: 100,
      price: 0.24,
      currency: 'ETH',
      colors: [],
      colorPaletteImageUrl: 'https://www.figma.com/api/mcp/asset/bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1',
    },
    {
      id: '4',
      title: 'Spring Garden',
      day: 21,
      theme: 'Spring Garden',
      imageUrl: 'https://www.figma.com/api/mcp/asset/3c19f0c7-c11f-4423-b9a6-8343efd6bd41',
      status: 'buy',
      participants: 100,
      price: 0.24,
      currency: 'ETH',
      colors: [],
      colorPaletteImageUrl: 'https://www.figma.com/api/mcp/asset/bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1',
    },
    {
      id: '5',
      title: 'Spring Garden',
      day: 20,
      theme: 'Spring Garden',
      imageUrl: 'https://www.figma.com/api/mcp/asset/91958504-3915-4f6c-b21f-163580820bcf',
      status: 'buy',
      participants: 100,
      price: 0.24,
      currency: 'ETH',
      colors: [],
      colorPaletteImageUrl: 'https://www.figma.com/api/mcp/asset/bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1',
    },
    {
      id: '6',
      title: 'Spring Garden',
      day: 19,
      theme: 'Spring Garden',
      imageUrl: 'https://www.figma.com/api/mcp/asset/5741f542-1f8d-4eae-8cfd-8a9e59cbc351',
      status: 'buy',
      participants: 100,
      price: 0.24,
      currency: 'ETH',
      colors: [],
      colorPaletteImageUrl: 'https://www.figma.com/api/mcp/asset/bcc35645-ee7a-4fca-b9f5-8b2ddc1b0be1',
    },
  ];

  // Navigation handlers
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleArtworkClick = (artwork: ArtworkItem) => {
    console.log('Artwork clicked:', artwork);
  };

  const handlePaint = (artwork: ArtworkItem) => {
    router.push('/canvas');
  };

  const handleMint = (artwork: ArtworkItem) => {
    console.log('Mint artwork:', artwork);
    // Implement mint functionality
  };

  const handleBuy = (artwork: ArtworkItem) => {
    console.log('Buy artwork:', artwork);
    // Implement buy functionality
  };

  const handleActionClick = (artwork: ArtworkItem) => {
    switch (artwork.status) {
      case 'painting':
        handlePaint(artwork);
        break;
      case 'mint':
        handleMint(artwork);
        break;
      case 'buy':
        handleBuy(artwork);
        break;
    }
  };

  const getButtonText = (status: string): string => {
    switch (status) {
      case 'painting':
        return 'Paint';
      case 'mint':
        return 'Mint';
      case 'buy':
        return 'Buy';
      default:
        return 'Buy';
    }
  };

  return (
    <div className={styles.container} data-name="展览页" data-node-id="101:2395">
      {/* Navigation Bar */}
      <nav className={styles.navbar} data-name="导航栏" data-node-id="101:2399">
        <div className={styles.navbarBackdrop} data-node-id="I101:2399;70:1816" />
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft} data-node-id="I101:2399;70:1822">
            <button onClick={() => handleNavigation('/')} className={styles.logo} data-name="fempunk_logo" data-node-id="I101:2399;70:1823">
              <Image
                src="https://www.figma.com/api/mcp/asset/622cce7a-4e71-4086-8741-d8b730ba1fc5"
                alt="FemPunk Logo"
                width={18}
                height={41}
                data-node-id="I101:2399;70:1823;33:2505"
              />
              <Image
                src="https://www.figma.com/api/mcp/asset/749ee3d3-6def-4d3e-819a-a97f6a89ad0f"
                alt="FemPunk Text"
                width={140}
                height={45}
                data-node-id="I101:2399;70:1823;33:2515"
              />
            </button>
            <button onClick={() => handleNavigation('/canvas')} className={styles.navLink} data-node-id="I101:2399;70:1824">
              PAINT
            </button>
            <button onClick={() => handleNavigation('/buy')} className={styles.navLink} data-node-id="I101:2399;70:1825">
              COLOR
            </button>
            <button onClick={() => handleNavigation('/gallery')} className={`${styles.navLink} ${styles.navLinkActive}`} data-node-id="I101:2399;70:1826">
              GALLERY
            </button>
          </div>
          <div className={styles.navbarRight} data-node-id="I101:2399;70:1817">
            <button 
              className={styles.connectButton} 
              data-node-id="I101:2399;70:1821"
              onClick={isConnected ? () => {} : () => openWalletModal()}
            >
              <Image
                src="https://www.figma.com/api/mcp/asset/b4771eab-5ce8-4d52-bfd5-aa543a398bc4"
                alt="Wallet Icon"
                width={20}
                height={20}
                data-name="理财 1"
                data-node-id="I101:2399;70:1819"
              />
              <span data-node-id="I101:2399;70:1818">
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Gallery Grid */}
      <div className={styles.galleryGrid} data-node-id="101:2739">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={styles.galleryCard}
            data-node-id={
              index === 0
                ? '101:2539'
                : index === 1
                ? '101:2540'
                : index === 2
                ? '101:2552'
                : index === 3
                ? '101:2588'
                : index === 4
                ? '101:2576'
                : '101:2564'
            }
            onClick={() => handleArtworkClick(artwork)}
          >
            {/* Card Background */}
            <div className={styles.cardBackground} data-node-id="101:2525" />

            {/* Artwork Image */}
            <div className={styles.cardImage} data-name="IMG_6407" data-node-id="101:2511">
              <Image
                src={artwork.imageUrl}
                alt={`Day ${artwork.day} - ${artwork.theme}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Card Title */}
            <div className={styles.cardTitle} data-node-id="101:2523">
              Day {artwork.day}｜{artwork.theme}
            </div>

            {/* Participants */}
            <div className={styles.cardParticipants} data-node-id="101:2865">
              <Image
                src="https://www.figma.com/api/mcp/asset/8101c3a4-3e18-46dc-b325-6466ebcb6ac1"
                alt="Participants"
                width={14}
                height={14}
                className={styles.iconParticipants}
                data-name="实景酷-人数 1"
                data-node-id="101:3045"
              />
              <span className={styles.participantsCount} data-node-id="101:2668">
                {artwork.participants}
              </span>
            </div>

            {/* Price or Status */}
            {artwork.status === 'painting' ? (
              <div className={styles.cardStatus} data-node-id="101:3074">
                Painting now...
              </div>
            ) : (
              <div className={styles.cardPrice} data-node-id="101:2941">
                <Image
                  src="https://www.figma.com/api/mcp/asset/5c701117-b4dc-4931-9a5f-5c036993035b"
                  alt="ETH"
                  width={12}
                  height={12}
                  className={styles.iconEth}
                  data-node-id="101:2943"
                />
                <span className={styles.priceValue} data-node-id="101:2942">
                  {artwork.price}
                  {artwork.currency}
                </span>
              </div>
            )}

            {/* Color Palette */}
            <div className={styles.cardColors} data-node-id="101:2537">
              <Image
                src={artwork.colorPaletteImageUrl || ''}
                alt="Color Palette"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Action Button */}
            <div className={styles.cardButtonWrapper} data-node-id="101:2508">
              <button
                className={`${styles.cardButton} ${
                  styles[`cardButton${artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}`]
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(artwork);
                }}
                data-node-id="101:2509"
              >
                <span data-node-id="101:2510">{getButtonText(artwork.status)}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={modalState.isOpen}
        onClose={closeWalletModal}
      />
    </div>
  );
}