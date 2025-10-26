'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PageLayout } from '../layout/PageLayout';
import { RevenueModal, useRevenueModal } from '../revenue/RevenueManager';
import { SendRevenueButton } from '../revenue/RevenueButton';
import { SetupGuide } from '../setup/SetupGuide';
import styles from './OptimizedHomePage.module.css';

interface ArtworkData {
  id: string;
  imageUrl: string;
  alt: string;
}

const FEATURED_ARTWORKS: ArtworkData[] = [
  {
    id: '1',
    imageUrl: 'https://www.figma.com/api/mcp/asset/a6373279-6d52-4edf-9218-f6d1b72ba886',
    alt: 'Community Artwork 1'
  },
  {
    id: '2', 
    imageUrl: 'https://www.figma.com/api/mcp/asset/52fff1ab-659b-4c98-aeee-775f3ef30f63',
    alt: 'Community Artwork 2'
  },
  {
    id: '3',
    imageUrl: 'https://www.figma.com/api/mcp/asset/993ef106-aa75-444c-a6ee-b673a15a8b49',
    alt: 'Community Artwork 3'
  },
  {
    id: '4',
    imageUrl: 'https://www.figma.com/api/mcp/asset/6d329de4-1fa1-4f48-a33b-9342bef9ddc8',
    alt: 'Community Artwork 4'
  },
  {
    id: '5',
    imageUrl: 'https://www.figma.com/api/mcp/asset/ab7991b7-a71a-4415-a109-4cb079f4e25a',
    alt: 'Community Artwork 5'
  },
  {
    id: '6',
    imageUrl: 'https://www.figma.com/api/mcp/asset/31764469-bdfc-4cd4-93d1-8a64c2d39da9',
    alt: 'Community Artwork 6'
  }
];

export function OptimizedHomePage() {
  const router = useRouter();
  const { isOpen, mode, canvasId, openModal, closeModal } = useRevenueModal();

  const handleStartPainting = useCallback(() => {
    console.log('Start Painting button clicked!');
    router.push('/canvas');
  }, [router]);

  const handleViewAllArtworks = useCallback(() => {
    router.push('/gallery');
  }, [router]);

  const handleBuyArtwork = useCallback((artworkId: string) => {
    console.log('Buy artwork:', artworkId);
    // TODO: Implement buy functionality
  }, []);

  const handleMintArtwork = useCallback((artworkId: string) => {
    console.log('Mint artwork:', artworkId);
    // Open revenue modal directly for quick minting
    const canvasIdNum = parseInt(artworkId) || 1; // Default to canvas ID 1
    openModal(canvasIdNum, 'send');
  }, [openModal]);

  return (
    <PageLayout navigationVariant="transparent" className={styles.homePage}>
      <div className={styles.container}>
        {/* Background Decoration Layers */}
        <div className={styles.backgroundLayers}>
          <div className={styles.gradientOverlay} />
          <div className={styles.bgMainImage}>
            <Image
              src="https://www.figma.com/api/mcp/asset/a10986f5-0f38-43ac-894d-ab94cc5848a8"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          {/* Simplified decorative elements for better performance */}
          <div className={styles.decorLeft}>
            <Image
              src="https://www.figma.com/api/mcp/asset/0ca3141b-80cd-4dac-940e-d33ee5617ba9"
              alt=""
              width={360}
              height={400}
              style={{ opacity: 0.8, mixBlendMode: 'lighten' }}
            />
          </div>
          
          <div className={styles.decorRight}>
            <Image
              src="https://www.figma.com/api/mcp/asset/1852609e-2922-4678-bd88-ca7c555f4284"
              alt=""
              width={430}
              height={400}
              style={{ opacity: 0.8 }}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection} aria-labelledby="hero-title">
          <div className={styles.heroTitle} id="hero-title">
            <Image
              src="https://www.figma.com/api/mcp/asset/37571abf-bfaf-4531-a440-ce475c8d0b25"
              alt="Nvshu Reborn Art Co-creation"
              width={846}
              height={233}
              priority
              sizes="(max-width: 768px) 90vw, 846px"
            />
          </div>

          <div className={styles.heroSubtitles}>
            <p className={styles.subtitle1}>Through decentralized collaboration,</p>
            <p className={styles.subtitle2}>the ancient script becomes the language of the future.</p>
          </div>

          {/* Decorative Elements */}
          <div className={styles.polygonLeft} aria-hidden="true">
            <Image
              src="https://www.figma.com/api/mcp/asset/d3014bc4-3192-4ef9-bc6c-3ea36a795f3b"
              alt=""
              width={574}
              height={770}
              sizes="574px"
            />
          </div>
          <div className={styles.polygonRight} aria-hidden="true">
            <Image
              src="https://www.figma.com/api/mcp/asset/fb114c74-9bd7-4376-9696-ed6549442c8b"
              alt=""
              width={574}
              height={770}
              sizes="574px"
            />
          </div>
        </section>

        {/* Nvshu of Today Section */}
        <section className={styles.nvshuTodaySection} aria-labelledby="nvshu-today-title">
          <div className={styles.sectionTitle} id="nvshu-today-title">
            <Image
              src="https://www.figma.com/api/mcp/asset/2a859fdb-b9bb-4acc-aeb5-7e613f49abc3"
              alt="Nvshu"
              width={185}
              height={52}
            />
            <Image
              src="https://www.figma.com/api/mcp/asset/c0b33612-8bcb-47e6-a7a2-ef4f5043f1ff"
              alt="of Today"
              width={216}
              height={52}
            />
          </div>

          <p className={styles.sectionSubtitle}>
            Join today&apos;s theme and paint your part in the evolving story of Nvshu.
          </p>

          {/* Nvshu Character Display */}
          <div className={styles.nvshuCharacter} role="img" aria-label="Today's Nvshu character meaning Spring">
            <div className={styles.characterGlow} />
            <div className={styles.characterLayers}>
              <div className={styles.characterMask}>
                <Image
                  src="https://www.figma.com/api/mcp/asset/c8e3bfbd-e2d6-4ca2-bc3e-16deb571b9cb"
                  alt=""
                  fill
                  sizes="480px"
                />
              </div>
              <div className={styles.characterOverlay}>
                <Image
                  src="https://www.figma.com/api/mcp/asset/3431327d-92b3-4f60-a9c7-500a148fb4e0"
                  alt=""
                  width={331}
                  height={331}
                />
              </div>
              <div className={styles.characterBase}>
                <Image
                  src="https://www.figma.com/api/mcp/asset/0453d87a-aa8a-4afa-9790-f658a6c7c7dd"
                  alt=""
                  fill
                  sizes="480px"
                />
              </div>
            </div>
            <div className={styles.characterTranslation}>
              <span>&quot;Spring&quot;</span>
            </div>
          </div>

          {/* Start Painting Button */}
          <div className={styles.ctaButtonWrapper}>
            <button
              className={styles.startPaintingButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked!', e);
                handleStartPainting();
              }}
              aria-describedby="paint-description"
            >
              <Image
                src="https://www.figma.com/api/mcp/asset/87e53dc9-cb97-48a6-b825-b8ad6f1ab046"
                alt=""
                width={28}
                height={28}
                aria-hidden="true"
              />
              <span>Start Painting</span>
            </button>
            <p id="paint-description" className={styles.srOnly}>
              Begin collaborative painting on today&apos;s canvas
            </p>
          </div>
        </section>

        {/* Community Artworks Section */}
        <section className={styles.communitySection} aria-labelledby="community-title">
          <div className={styles.sectionTitle} id="community-title">
            <Image
              src="https://www.figma.com/api/mcp/asset/1d29ed5a-9430-4cf4-908b-232bd1050941"
              alt="Community"
              width={247}
              height={52}
            />
            <Image
              src="https://www.figma.com/api/mcp/asset/cd4c7ebf-1155-459c-b1ce-298257efb2ec"
              alt="Artworks"
              width={244}
              height={52}
            />
          </div>

          <p className={styles.sectionSubtitle}>
            Explore past collaborative artworks and feel the visual power of feminine language.
          </p>

          {/* Artworks Grid */}
          <div className={styles.artworksGrid} role="grid" aria-label="Community artworks gallery">
            {FEATURED_ARTWORKS.map((artwork, index) => (
              <div key={artwork.id} className={styles.artworkItem} role="gridcell">
                <div className={styles.artworkImage}>
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.alt}
                    width={350}
                    height={350}
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 350px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {index === 0 ? (
                  <SendRevenueButton 
                    canvasId={parseInt(artwork.id) || 1}
                    className={styles.mintButton}
                  >
                    Mint
                  </SendRevenueButton>
                ) : (
                  <button
                    className={styles.buyButton}
                    onClick={() => handleBuyArtwork(artwork.id)}
                    aria-label={`Buy ${artwork.alt}`}
                  >
                    Buy
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className={styles.viewAllLink}>
            <button onClick={handleViewAllArtworks} className={styles.viewAllButton}>
              <span>View all artworks</span>
              <Image
                src="https://www.figma.com/api/mcp/asset/f40e1eb7-7621-40cb-a9c4-13b0d6778c74"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
            </button>
          </div>
        </section>
      </div>

      {/* Revenue Modal */}
      <RevenueModal
        isOpen={isOpen}
        onClose={closeModal}
        canvasId={canvasId}
        mode={mode}
      />

      {/* Setup Guide */}
      <SetupGuide />
    </PageLayout>
  );
}